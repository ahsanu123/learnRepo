/* eslint-disable @typescript-eslint/no-explicit-any */
import { Attrs, ContentMatch, Fragment, MarkType, Node, NodeType, ResolvedPos, Slice } from "prosemirror-model"
import {
  AllSelection,
  Command,
  EditorState,
  NodeSelection,
  Selection,
  SelectionRange,
  TextSelection,
  Transaction
} from "prosemirror-state"
import {
  canJoin,
  canSplit,
  findWrapping,
  joinPoint,
  liftTarget,
  ReplaceAroundStep,
  ReplaceStep,
  replaceStep
} from "prosemirror-transform"
import { EditorView } from "prosemirror-view"

export const deleteSelection: Command = (state, dispatch) => {
  if (state.selection.empty) return false
  if (dispatch) dispatch(state.tr.deleteSelection().scrollIntoView())
  return true
}

function atBlockStart(state: EditorState, view?: EditorView): ResolvedPos | null {
  const { $cursor } = state.selection as TextSelection
  if (!$cursor || (view ? !view.endOfTextblock("backward", state)
    : $cursor.parentOffset > 0))
    return null
  return $cursor
}

export const joinBackward: Command = (state, dispatch, view) => {
  const $cursor = atBlockStart(state, view)
  if (!$cursor) return false

  const $cut = findCutBefore($cursor)

  if (!$cut) {
    const range = $cursor.blockRange(), target = range && liftTarget(range)
    if (target == null) return false
    if (dispatch) dispatch(state.tr.lift(range!, target).scrollIntoView())
    return true
  }

  const before = $cut.nodeBefore!

  if (deleteBarrier(state, $cut, dispatch, -1)) return true

  if ($cursor.parent.content.size == 0 &&
    (textblockAt(before, "end") || NodeSelection.isSelectable(before))) {
    for (let depth = $cursor.depth; ; depth--) {
      const delStep = replaceStep(state.doc, $cursor.before(depth), $cursor.after(depth), Slice.empty)
      if (delStep && (delStep as ReplaceStep).slice.size < (delStep as ReplaceStep).to - (delStep as ReplaceStep).from) {
        if (dispatch) {
          const tr = state.tr.step(delStep)
          tr.setSelection(textblockAt(before, "end")
            ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1)!
            : NodeSelection.create(tr.doc, $cut.pos - before.nodeSize))
          dispatch(tr.scrollIntoView())
        }
        return true
      }
      if (depth == 1 || $cursor.node(depth - 1).childCount > 1) break
    }
  }

  if (before.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) dispatch(state.tr.delete($cut.pos - before.nodeSize, $cut.pos).scrollIntoView())
    return true
  }

  return false
}

export const joinTextblockBackward: Command = (state, dispatch, view) => {
  const $cursor = atBlockStart(state, view)
  if (!$cursor) return false
  const $cut = findCutBefore($cursor)
  return $cut ? joinTextblocksAround(state, $cut, dispatch) : false
}

export const joinTextblockForward: Command = (state, dispatch, view) => {
  const $cursor = atBlockEnd(state, view)
  if (!$cursor) return false
  const $cut = findCutAfter($cursor)
  return $cut ? joinTextblocksAround(state, $cut, dispatch) : false
}

function joinTextblocksAround(state: EditorState, $cut: ResolvedPos, dispatch?: (tr: Transaction) => void) {
  const before = $cut.nodeBefore!
  let beforeText = before, beforePos = $cut.pos - 1
  for (; !beforeText.isTextblock; beforePos--) {
    if (beforeText.type.spec.isolating) return false
    const child = beforeText.lastChild
    if (!child) return false
    beforeText = child
  }
  const after = $cut.nodeAfter!
  let afterText = after, afterPos = $cut.pos + 1
  for (; !afterText.isTextblock; afterPos++) {
    if (afterText.type.spec.isolating) return false
    const child = afterText.firstChild
    if (!child) return false
    afterText = child
  }
  const step = replaceStep(state.doc, beforePos, afterPos, Slice.empty) as ReplaceStep | null
  if (!step || step.from != beforePos ||
    step instanceof ReplaceStep && step.slice.size >= afterPos - beforePos) return false
  if (dispatch) {
    const tr = state.tr.step(step)
    tr.setSelection(TextSelection.create(tr.doc, beforePos))
    dispatch(tr.scrollIntoView())
  }
  return true

}

function textblockAt(node: Node, side: "start" | "end", only = false) {
  for (let scan: Node | null = node; scan; scan = (side == "start" ? scan.firstChild : scan.lastChild)) {
    if (scan.isTextblock) return true
    if (only && scan.childCount != 1) return false
  }
  return false
}

export const selectNodeBackward: Command = (state, dispatch, view) => {
  const { $head, empty } = state.selection
  let $cut: ResolvedPos | null = $head

  if (!empty) return false

  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) return false
    $cut = findCutBefore($head)
  }
  const node = $cut && $cut.nodeBefore
  if (!node || !NodeSelection.isSelectable(node)) return false
  if (dispatch)
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut!.pos - node.nodeSize)).scrollIntoView())
  return true
}

function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
  if (!$pos.parent.type.spec.isolating) for (let i = $pos.depth - 1; i >= 0; i--) {
    if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1))
    if ($pos.node(i).type.spec.isolating) break
  }
  return null
}

function atBlockEnd(state: EditorState, view?: EditorView): ResolvedPos | null {
  const { $cursor } = state.selection as TextSelection
  if (!$cursor || (view ? !view.endOfTextblock("forward", state)
    : $cursor.parentOffset < $cursor.parent.content.size))
    return null
  return $cursor
}

export const joinForward: Command = (state, dispatch, view) => {
  const $cursor = atBlockEnd(state, view)
  if (!$cursor) return false

  const $cut = findCutAfter($cursor)
  if (!$cut) return false

  const after = $cut.nodeAfter!

  if (deleteBarrier(state, $cut, dispatch, 1)) return true

  if ($cursor.parent.content.size == 0 &&
    (textblockAt(after, "start") || NodeSelection.isSelectable(after))) {
    const delStep = replaceStep(state.doc, $cursor.before(), $cursor.after(), Slice.empty)
    if (delStep && (delStep as ReplaceStep).slice.size < (delStep as ReplaceStep).to - (delStep as ReplaceStep).from) {
      if (dispatch) {
        const tr = state.tr.step(delStep)
        tr.setSelection(textblockAt(after, "start") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1)!
          : NodeSelection.create(tr.doc, tr.mapping.map($cut.pos)))
        dispatch(tr.scrollIntoView())
      }
      return true
    }
  }

  if (after.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) dispatch(state.tr.delete($cut.pos, $cut.pos + after.nodeSize).scrollIntoView())
    return true
  }

  return false
}

export const selectNodeForward: Command = (state, dispatch, view) => {
  const { $head, empty } = state.selection
  let $cut: ResolvedPos | null = $head
  if (!empty) return false
  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size)
      return false
    $cut = findCutAfter($head)
  }
  const node = $cut && $cut.nodeAfter
  if (!node || !NodeSelection.isSelectable(node)) return false
  if (dispatch)
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut!.pos)).scrollIntoView())
  return true
}

function findCutAfter($pos: ResolvedPos) {
  if (!$pos.parent.type.spec.isolating) for (let i = $pos.depth - 1; i >= 0; i--) {
    const parent = $pos.node(i)
    if ($pos.index(i) + 1 < parent.childCount) return $pos.doc.resolve($pos.after(i + 1))
    if (parent.type.spec.isolating) break
  }
  return null
}

export const joinUp: Command = (state, dispatch) => {
  const sel = state.selection, nodeSel = sel instanceof NodeSelection
  let point
  if (nodeSel) {
    if ((sel as NodeSelection).node.isTextblock || !canJoin(state.doc, sel.from)) return false
    point = sel.from
  } else {
    point = joinPoint(state.doc, sel.from, -1)
    if (point == null) return false
  }
  if (dispatch) {
    const tr = state.tr.join(point)
    if (nodeSel) tr.setSelection(NodeSelection.create(tr.doc, point - state.doc.resolve(point).nodeBefore!.nodeSize))
    dispatch(tr.scrollIntoView())
  }
  return true
}

export const joinDown: Command = (state, dispatch) => {
  const sel = state.selection
  let point
  if (sel instanceof NodeSelection) {
    if (sel.node.isTextblock || !canJoin(state.doc, sel.to)) return false
    point = sel.to
  } else {
    point = joinPoint(state.doc, sel.to, 1)
    if (point == null) return false
  }
  if (dispatch)
    dispatch(state.tr.join(point).scrollIntoView())
  return true
}

export const lift: Command = (state, dispatch) => {
  const { $from, $to } = state.selection
  const range = $from.blockRange($to), target = range && liftTarget(range)
  if (target == null) return false
  if (dispatch) dispatch(state.tr.lift(range!, target).scrollIntoView())
  return true
}

export const newlineInCode: Command = (state, dispatch) => {
  const { $head, $anchor } = state.selection
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false
  if (dispatch) dispatch(state.tr.insertText("\n").scrollIntoView())
  return true
}

function defaultBlockAt(match: ContentMatch) {
  for (let i = 0; i < match.edgeCount; i++) {
    const { type } = match.edge(i)
    if (type.isTextblock && !type.hasRequiredAttrs()) return type
  }
  return null
}

export const exitCode: Command = (state, dispatch) => {
  const { $head, $anchor } = state.selection
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) return false
  const above = $head.node(-1), after = $head.indexAfter(-1), type = defaultBlockAt(above.contentMatchAt(after))
  if (!type || !above.canReplaceWith(after, after, type)) return false
  if (dispatch) {
    const pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill()!)
    tr.setSelection(Selection.near(tr.doc.resolve(pos), 1))
    dispatch(tr.scrollIntoView())
  }
  return true
}

export const createParagraphNear: Command = (state, dispatch) => {
  const sel = state.selection
  const { $from, $to } = sel
  if (sel instanceof AllSelection || $from.parent.inlineContent || $to.parent.inlineContent) return false
  const type = defaultBlockAt($to.parent.contentMatchAt($to.indexAfter()))
  if (!type || !type.isTextblock) return false
  if (dispatch) {
    const side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos
    const tr = state.tr.insert(side, type.createAndFill()!)
    tr.setSelection(TextSelection.create(tr.doc, side + 1))
    dispatch(tr.scrollIntoView())
  }
  return true
}

export const liftEmptyBlock: Command = (state, dispatch) => {
  const { $cursor } = state.selection as TextSelection
  if (!$cursor || $cursor.parent.content.size) return false
  if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
    const before = $cursor.before()
    if (canSplit(state.doc, before)) {
      if (dispatch) dispatch(state.tr.split(before).scrollIntoView())
      return true
    }
  }
  const range = $cursor.blockRange(), target = range && liftTarget(range)
  if (target == null) return false
  if (dispatch) dispatch(state.tr.lift(range!, target).scrollIntoView())
  return true
}

export function splitBlockAs(
  splitNode?: (node: Node, atEnd: boolean, $from: ResolvedPos) => { type: NodeType, attrs?: Attrs } | null
): Command {
  return (state, dispatch) => {
    const { $from, $to } = state.selection
    if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) return false
      if (dispatch) dispatch(state.tr.split($from.pos).scrollIntoView())
      return true
    }

    if (!$from.depth) return false
    const types: (null | { type: NodeType, attrs?: Attrs | null })[] = []
    let splitDepth, deflt, atEnd = false, atStart = false
    for (let d = $from.depth; ; d--) {
      const node = $from.node(d)
      if (node.isBlock) {
        atEnd = $from.end(d) == $from.pos + ($from.depth - d)
        atStart = $from.start(d) == $from.pos - ($from.depth - d)
        deflt = defaultBlockAt($from.node(d - 1).contentMatchAt($from.indexAfter(d - 1)))
        const splitType = splitNode && splitNode($to.parent, atEnd, $from)
        types.unshift(splitType || (atEnd && deflt ? { type: deflt } : null))
        splitDepth = d
        break
      } else {
        if (d == 1) return false
        types.unshift(null)
      }
    }

    const tr = state.tr
    if (state.selection instanceof TextSelection || state.selection instanceof AllSelection) tr.deleteSelection()
    const splitPos = tr.mapping.map($from.pos)
    let can = canSplit(tr.doc, splitPos, types.length, types)
    if (!can) {
      types[0] = deflt ? { type: deflt } : null
      can = canSplit(tr.doc, splitPos, types.length, types)
    }
    tr.split(splitPos, types.length, types)
    if (!atEnd && atStart && $from.node(splitDepth).type != deflt) {
      const first = tr.mapping.map($from.before(splitDepth)), $first = tr.doc.resolve(first)
      if (deflt && $from.node(splitDepth - 1).canReplaceWith($first.index(), $first.index() + 1, deflt))
        tr.setNodeMarkup(tr.mapping.map($from.before(splitDepth)), deflt)
    }
    if (dispatch) dispatch(tr.scrollIntoView())
    return true
  }
}

export const splitBlock: Command = splitBlockAs()

export const splitBlockKeepMarks: Command = (state, dispatch) => {
  return splitBlock(state, dispatch && (tr => {
    const marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks())
    if (marks) tr.ensureMarks(marks)
    dispatch(tr)
  }))
}

export const selectParentNode: Command = (state, dispatch) => {
  const { $from, to } = state.selection
  const same = $from.sharedDepth(to)
  if (same == 0) return false
  const pos = $from.before(same)
  if (dispatch) dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
  return true
}

export const selectAll: Command = (state, dispatch) => {
  if (dispatch) dispatch(state.tr.setSelection(new AllSelection(state.doc)))
  return true
}

function joinMaybeClear(state: EditorState, $pos: ResolvedPos, dispatch: ((tr: Transaction) => void) | undefined) {
  const before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index()
  if (!before || !after || !before.type.compatibleContent(after.type)) return false
  if (!before.content.size && $pos.parent.canReplace(index - 1, index)) {
    if (dispatch) dispatch(state.tr.delete($pos.pos - before.nodeSize, $pos.pos).scrollIntoView())
    return true
  }
  if (!$pos.parent.canReplace(index, index + 1) || !(after.isTextblock || canJoin(state.doc, $pos.pos)))
    return false
  if (dispatch)
    dispatch(state.tr.join($pos.pos).scrollIntoView())
  return true
}

function deleteBarrier(state: EditorState, $cut: ResolvedPos, dispatch: ((tr: Transaction) => void) | undefined, dir: number) {
  const before = $cut.nodeBefore!
  const after = $cut.nodeAfter!
  const isolated = before.type.spec.isolating || after.type.spec.isolating

  let conn, match
  if (!isolated && joinMaybeClear(state, $cut, dispatch)) return true

  const canDelAfter = !isolated && $cut.parent.canReplace($cut.index(), $cut.index() + 1)
  if (canDelAfter &&
    (conn = (match = before.contentMatchAt(before.childCount)).findWrapping(after.type)) &&
    match.matchType(conn[0] || after.type)!.validEnd) {
    if (dispatch) {
      const end = $cut.pos + after.nodeSize
      let wrap = Fragment.empty
      for (let i = conn.length - 1; i >= 0; i--)
        wrap = Fragment.from(conn[i].create(null, wrap))
      wrap = Fragment.from(before.copy(wrap))
      const tr = state.tr.step(new ReplaceAroundStep($cut.pos - 1, end, $cut.pos, end, new Slice(wrap, 1, 0), conn.length, true))
      const $joinAt = tr.doc.resolve(end + 2 * conn.length)
      if ($joinAt.nodeAfter && $joinAt.nodeAfter.type == before.type &&
        canJoin(tr.doc, $joinAt.pos)) tr.join($joinAt.pos)
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  const selAfter = after.type.spec.isolating || (dir > 0 && isolated) ? null : Selection.findFrom($cut, 1)
  const range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && liftTarget(range)
  if (target != null && target >= $cut.depth) {
    if (dispatch) dispatch(state.tr.lift(range!, target).scrollIntoView())
    return true
  }

  if (canDelAfter && textblockAt(after, "start", true) && textblockAt(before, "end")) {
    let at = before;
    const wrap = [];
    for (; ;) {
      wrap.push(at)
      if (at.isTextblock) break
      at = at.lastChild!
    }
    let afterText = after, afterDepth = 1
    for (; !afterText.isTextblock; afterText = afterText.firstChild!) afterDepth++
    if (at.canReplace(at.childCount, at.childCount, afterText.content)) {
      if (dispatch) {
        let end = Fragment.empty
        for (let i = wrap.length - 1; i >= 0; i--) end = Fragment.from(wrap[i].copy(end))
        const tr = state.tr.step(new ReplaceAroundStep($cut.pos - wrap.length, $cut.pos + after.nodeSize,
          $cut.pos + afterDepth, $cut.pos + after.nodeSize - afterDepth,
          new Slice(end, wrap.length, 0), 0, true))
        dispatch(tr.scrollIntoView())
      }
      return true
    }
  }

  return false
}

function selectTextblockSide(side: number): Command {
  return function (state, dispatch) {
    const sel = state.selection, $pos = side < 0 ? sel.$from : sel.$to
    let depth = $pos.depth
    while ($pos.node(depth).isInline) {
      if (!depth) return false
      depth--
    }
    if (!$pos.node(depth).isTextblock) return false
    if (dispatch)
      dispatch(state.tr.setSelection(TextSelection.create(
        state.doc, side < 0 ? $pos.start(depth) : $pos.end(depth))))
    return true
  }
}

export const selectTextblockStart = selectTextblockSide(-1)

export const selectTextblockEnd = selectTextblockSide(1)

export function wrapIn(nodeType: NodeType, attrs: Attrs | null = null): Command {
  return function (state, dispatch) {
    const { $from, $to } = state.selection
    const range = $from.blockRange($to), wrapping = range && findWrapping(range, nodeType, attrs)
    if (!wrapping) return false
    if (dispatch) dispatch(state.tr.wrap(range!, wrapping).scrollIntoView())
    return true
  }
}

export function setBlockType(nodeType: NodeType, attrs: Attrs | null = null): Command {
  return function (state, dispatch) {
    let applicable = false
    for (let i = 0; i < state.selection.ranges.length && !applicable; i++) {
      const { $from: { pos: from }, $to: { pos: to } } = state.selection.ranges[i]
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (applicable) return false
        if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return
        if (node.type == nodeType) {
          applicable = true
        } else {
          const $pos = state.doc.resolve(pos), index = $pos.index()
          applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType)
        }
      })
    }
    if (!applicable) return false
    if (dispatch) {
      const tr = state.tr
      for (let i = 0; i < state.selection.ranges.length; i++) {
        const { $from: { pos: from }, $to: { pos: to } } = state.selection.ranges[i]
        tr.setBlockType(from, to, nodeType, attrs)
      }
      dispatch(tr.scrollIntoView())
    }
    return true
  }
}

function markApplies(doc: Node, ranges: readonly SelectionRange[], type: MarkType, enterAtoms: boolean) {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i]
    let can = $from.depth == 0 ? doc.inlineContent && doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (can || !enterAtoms && node.isAtom && node.isInline && pos >= $from.pos && pos + node.nodeSize <= $to.pos)
        return false
      can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

function removeInlineAtoms(ranges: readonly SelectionRange[]): readonly SelectionRange[] {
  const result = []
  for (let i = 0; i < ranges.length; i++) {
    let { $from } = ranges[i]
    const { $to } = ranges[i];
    $from.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      if (node.isAtom && node.content.size && node.isInline && pos >= $from.pos && pos + node.nodeSize <= $to.pos) {
        if (pos + 1 > $from.pos) result.push(new SelectionRange($from, $from.doc.resolve(pos + 1)))
        $from = $from.doc.resolve(pos + 1 + node.content.size)
        return false
      }
    })
    if ($from.pos < $to.pos) result.push(new SelectionRange($from, $to))
  }
  return result
}

export function toggleMark(
  markType: MarkType,
  attrs: Attrs | null = null,
  options?: {
    removeWhenPresent?: boolean
    enterInlineAtoms?: boolean
  }
): Command {
  const removeWhenPresent = (options && options.removeWhenPresent) !== false
  const enterAtoms = (options && options.enterInlineAtoms) !== false
  return function (state, dispatch) {
    let { ranges } = state.selection as TextSelection
    const { empty, $cursor } = state.selection as TextSelection
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType, enterAtoms)) return false
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks()))
          dispatch(state.tr.removeStoredMark(markType))
        else
          dispatch(state.tr.addStoredMark(markType.create(attrs)))
      } else {
        let add
        const tr = state.tr
        if (!enterAtoms) ranges = removeInlineAtoms(ranges)
        if (removeWhenPresent) {
          add = !ranges.some(r => state.doc.rangeHasMark(r.$from.pos, r.$to.pos, markType))
        } else {
          add = !ranges.every(r => {
            let missing = false
            tr.doc.nodesBetween(r.$from.pos, r.$to.pos, (node, pos, parent) => {
              if (missing) return false
              missing = !markType.isInSet(node.marks) && !!parent && parent.type.allowsMarkType(markType) &&
                !(node.isText && /^\s*$/.test(node.textBetween(Math.max(0, r.$from.pos - pos),
                  Math.min(node.nodeSize, r.$to.pos - pos))))
            })
            return !missing
          })
        }
        for (let i = 0; i < ranges.length; i++) {
          const { $from, $to } = ranges[i]
          if (!add) {
            tr.removeMark($from.pos, $to.pos, markType)
          } else {
            let from = $from.pos, to = $to.pos
            const start = $from.nodeAfter, end = $to.nodeBefore
            const spaceStart = start && start.isText ? /^\s*/.exec(start.text!)![0].length : 0
            const spaceEnd = end && end.isText ? /\s*$/.exec(end.text!)![0].length : 0
            if (from + spaceStart < to) { from += spaceStart; to -= spaceEnd }
            tr.addMark(from, to, markType.create(attrs))
          }
        }
        dispatch(tr.scrollIntoView())
      }
    }
    return true
  }
}

function wrapDispatchForJoin(dispatch: (tr: Transaction) => void, isJoinable: (a: Node, b: Node) => boolean) {
  return (tr: Transaction) => {
    if (!tr.isGeneric) return dispatch(tr)

    const ranges: number[] = []
    for (let i = 0; i < tr.mapping.maps.length; i++) {
      const map = tr.mapping.maps[i]
      for (let j = 0; j < ranges.length; j++)
        ranges[j] = map.map(ranges[j])
      map.forEach((_s, _e, from, to) => ranges.push(from, to))
    }

    const joinable = []
    for (let i = 0; i < ranges.length; i += 2) {
      const from = ranges[i], to = ranges[i + 1]
      const $from = tr.doc.resolve(from), depth = $from.sharedDepth(to), parent = $from.node(depth)
      for (let index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index) {
        const after = parent.maybeChild(index)
        if (!after) break
        if (index && joinable.indexOf(pos) == -1) {
          const before = parent.child(index - 1)
          if (before.type == after.type && isJoinable(before, after))
            joinable.push(pos)
        }
        pos += after.nodeSize
      }
    }

    joinable.sort((a, b) => a - b)
    for (let i = joinable.length - 1; i >= 0; i--) {
      if (canJoin(tr.doc, joinable[i])) tr.join(joinable[i])
    }
    dispatch(tr)
  }
}

export function autoJoin(
  command: Command,
  isJoinable: ((before: Node, after: Node) => boolean) | readonly string[]
): Command {
  const canJoin = Array.isArray(isJoinable) ? (node: Node) => isJoinable.indexOf(node.type.name) > -1
    : isJoinable as (a: Node, b: Node) => boolean
  return (state, dispatch, view) => command(state, dispatch && wrapDispatchForJoin(dispatch, canJoin), view)
}

export function chainCommands(...commands: readonly Command[]): Command {
  return function (state, dispatch, view) {
    for (let i = 0; i < commands.length; i++)
      if (commands[i](state, dispatch, view)) return true
    return false
  }
}

const backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward)
const del = chainCommands(deleteSelection, joinForward, selectNodeForward)

export const pcBaseKeymap: { [key: string]: Command } = {
  "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
  "Mod-Enter": exitCode,
  "Backspace": backspace,
  "Mod-Backspace": backspace,
  "Shift-Backspace": backspace,
  "Delete": del,
  "Mod-Delete": del,
  "Mod-a": selectAll
}

export const macBaseKeymap: { [key: string]: Command } = {
  "Ctrl-h": pcBaseKeymap["Backspace"],
  "Alt-Backspace": pcBaseKeymap["Mod-Backspace"],
  "Ctrl-d": pcBaseKeymap["Delete"],
  "Ctrl-Alt-Backspace": pcBaseKeymap["Mod-Delete"],
  "Alt-Delete": pcBaseKeymap["Mod-Delete"],
  "Alt-d": pcBaseKeymap["Mod-Delete"],
  "Ctrl-a": selectTextblockStart,
  "Ctrl-e": selectTextblockEnd
}
for (const key in pcBaseKeymap) (macBaseKeymap as any)[key] = pcBaseKeymap[key]

const mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  : typeof os != "undefined" && os.platform ? os.platform() == "darwin" : false

export const baseKeymap: { [key: string]: Command } = mac ? macBaseKeymap : pcBaseKeymap
