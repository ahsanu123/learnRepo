/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, Node, ResolvedPos, Slice } from "prosemirror-model"
import { Command, EditorState, NodeSelection, Plugin, Selection, TextSelection } from "prosemirror-state"
import { Decoration, DecorationSet, EditorView } from "prosemirror-view"
import { keydownHandler } from "./prose-keymap"

import { Mappable } from "prosemirror-transform"

export class GapCursor extends Selection {
  constructor($pos: ResolvedPos) {
    super($pos, $pos)
  }

  map(doc: Node, mapping: Mappable): Selection {
    const $pos = doc.resolve(mapping.map(this.head))
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos)
  }

  content() { return Slice.empty }

  eq(other: Selection): boolean {
    return other instanceof GapCursor && other.head == this.head
  }

  toJSON(): any {
    return { type: "gapcursor", pos: this.head }
  }

  static fromJSON(doc: Node, json: any): GapCursor {
    if (typeof json.pos != "number") throw new RangeError("Invalid input for GapCursor.fromJSON")
    return new GapCursor(doc.resolve(json.pos))
  }

  getBookmark() { return new GapBookmark(this.anchor) }

  static valid($pos: ResolvedPos) {
    const parent = $pos.parent
    if (parent.isTextblock || !closedBefore($pos) || !closedAfter($pos)) return false
    const override = parent.type.spec.allowGapCursor
    if (override != null) return override
    const deflt = parent.contentMatchAt($pos.index()).defaultType
    return deflt && deflt.isTextblock
  }

  static findGapCursorFrom($pos: ResolvedPos, dir: number, mustMove = false) {
    search: for (; ;) {
      if (!mustMove && GapCursor.valid($pos)) return $pos
      let pos = $pos.pos, next = null

      for (let d = $pos.depth; ; d--) {
        const parent = $pos.node(d)
        if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
          next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1)
          break
        } else if (d == 0) {
          return null
        }
        pos += dir
        const $cur = $pos.doc.resolve(pos)
        if (GapCursor.valid($cur)) return $cur
      }

      for (; ;) {
        const inside: Node | null = dir > 0 ? next.firstChild : next.lastChild
        if (!inside) {
          if (next.isAtom && !next.isText && !NodeSelection.isSelectable(next)) {
            $pos = $pos.doc.resolve(pos + next.nodeSize * dir)
            mustMove = false
            continue search
          }
          break
        }
        next = inside
        pos += dir
        const $cur = $pos.doc.resolve(pos)
        if (GapCursor.valid($cur)) return $cur
      }

      return null
    }
  }
}

GapCursor.prototype.visible = false;
(GapCursor as any).findFrom = GapCursor.findGapCursorFrom

Selection.jsonID("gapcursor", GapCursor)

class GapBookmark {
  constructor(readonly pos: number) { }

  map(mapping: Mappable) {
    return new GapBookmark(mapping.map(this.pos))
  }
  resolve(doc: Node) {
    const $pos = doc.resolve(this.pos)
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos)
  }
}

function closedBefore($pos: ResolvedPos) {
  for (let d = $pos.depth; d >= 0; d--) {
    const index = $pos.index(d), parent = $pos.node(d)

    if (index == 0) {
      if (parent.type.spec.isolating) return true
      continue
    }
    for (let before = parent.child(index - 1); ; before = before.lastChild!) {
      if ((before.childCount == 0 && !before.inlineContent) || before.isAtom || before.type.spec.isolating) return true
      if (before.inlineContent) return false
    }
  }
  return true
}

function closedAfter($pos: ResolvedPos) {
  for (let d = $pos.depth; d >= 0; d--) {
    const index = $pos.indexAfter(d), parent = $pos.node(d)
    if (index == parent.childCount) {
      if (parent.type.spec.isolating) return true
      continue
    }
    for (let after = parent.child(index); ; after = after.firstChild!) {
      if ((after.childCount == 0 && !after.inlineContent) || after.isAtom || after.type.spec.isolating) return true
      if (after.inlineContent) return false
    }
  }
  return true
}

export function gapCursor(): Plugin {
  return new Plugin({
    props: {
      decorations: drawGapCursor,

      createSelectionBetween(_view, $anchor, $head) {
        return $anchor.pos == $head.pos && GapCursor.valid($head) ? new GapCursor($head) : null
      },

      handleClick,
      handleKeyDown,
      handleDOMEvents: { beforeinput: beforeinput as any }
    }
  })
}


const handleKeyDown = keydownHandler({
  "ArrowLeft": arrow("horiz", -1),
  "ArrowRight": arrow("horiz", 1),
  "ArrowUp": arrow("vert", -1),
  "ArrowDown": arrow("vert", 1)
})

function arrow(axis: "vert" | "horiz", dir: number): Command {
  const dirStr = axis == "vert" ? (dir > 0 ? "down" : "up") : (dir > 0 ? "right" : "left")
  return function (state, dispatch, view) {
    const sel = state.selection
    let $start = dir > 0 ? sel.$to : sel.$from, mustMove = sel.empty
    if (sel instanceof TextSelection) {
      if (!view!.endOfTextblock(dirStr) || $start.depth == 0) return false
      mustMove = false
      $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before())
    }
    const $found = GapCursor.findGapCursorFrom($start, dir, mustMove)
    if (!$found) return false
    if (dispatch) dispatch(state.tr.setSelection(new GapCursor($found)))
    return true
  }
}

function handleClick(view: EditorView, pos: number, event: MouseEvent) {
  if (!view || !view.editable) return false
  const $pos = view.state.doc.resolve(pos)
  if (!GapCursor.valid($pos)) return false
  const clickPos = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (clickPos && clickPos.inside > -1 && NodeSelection.isSelectable(view.state.doc.nodeAt(clickPos.inside)!)) return false
  view.dispatch(view.state.tr.setSelection(new GapCursor($pos)))
  return true
}

function beforeinput(view: EditorView, event: InputEvent) {
  if (event.inputType != "insertCompositionText" || !(view.state.selection instanceof GapCursor)) return false

  const { $from } = view.state.selection
  const insert = $from.parent.contentMatchAt($from.index()).findWrapping(view.state.schema.nodes.text)
  if (!insert) return false

  let frag = Fragment.empty
  for (let i = insert.length - 1; i >= 0; i--) frag = Fragment.from(insert[i].createAndFill(null, frag))
  const tr = view.state.tr.replace($from.pos, $from.pos, new Slice(frag, 0, 0))
  tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + 1)))
  view.dispatch(tr)
  return false
}

function drawGapCursor(state: EditorState) {
  if (!(state.selection instanceof GapCursor)) return null
  const node = document.createElement("div")
  node.className = "ProseMirror-gapcursor"
  return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node, { key: "gapcursor" })])
}

