/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, Transaction, EditorState, TextSelection, Command } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { findWrapping, canJoin } from "prosemirror-transform"
import { NodeType, Node, Attrs } from "prosemirror-model"

export class InputRule {
  handler: (state: EditorState, match: RegExpMatchArray, start: number, end: number) => Transaction | null

  undoable: boolean
  inCode: boolean | "only"

  constructor(
    readonly match: RegExp,
    handler: string | ((state: EditorState, match: RegExpMatchArray, start: number, end: number) => Transaction | null),
    options: {
      undoable?: boolean,
      inCode?: boolean | "only"
    } = {}
  ) {
    this.match = match
    this.handler = typeof handler == "string" ? stringHandler(handler) : handler
    this.undoable = options.undoable !== false
    this.inCode = options.inCode || false
  }
}

function stringHandler(string: string) {
  return function (state: EditorState, match: RegExpMatchArray, start: number, end: number) {
    let insert = string
    if (match[1]) {
      const offset = match[0].lastIndexOf(match[1])
      insert += match[0].slice(offset + match[1].length)
      start += offset
      const cutOff = start - end
      if (cutOff > 0) {
        insert = match[0].slice(offset - cutOff, offset) + insert
        start = end
      }
    }
    return state.tr.insertText(insert, start, end)
  }
}

const MAX_MATCH = 500

type PluginState =
  { transform: Transaction, from: number, to: number, text: string }
  | null

export function inputRules({ rules }: { rules: readonly InputRule[] }) {
  const plugin: Plugin<PluginState> = new Plugin<PluginState>({
    state: {
      init() { return null },
      apply(this: typeof plugin, tr, prev) {
        const stored = tr.getMeta(this)
        if (stored) return stored
        return tr.selectionSet || tr.docChanged ? null : prev
      }
    },

    props: {
      handleTextInput(view, from, to, text) {
        return run(view, from, to, text, rules, plugin)
      },
      handleDOMEvents: {
        compositionend: (view) => {
          setTimeout(() => {
            const { $cursor } = view.state.selection as TextSelection
            if ($cursor) run(view, $cursor.pos, $cursor.pos, "", rules, plugin)
          })
        }
      }
    },

    isInputRules: true
  })
  return plugin
}

function run(view: EditorView, from: number, to: number, text: string, rules: readonly InputRule[], plugin: Plugin) {
  if (view.composing) return false
  const state = view.state, $from = state.doc.resolve(from)
  const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset,
    null, "\ufffc") + text
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if ($from.parent.type.spec.code) {
      if (!rule.inCode) continue
    } else if (rule.inCode === "only") {
      continue
    }
    const match = rule.match.exec(textBefore)
    const tr = match && rule.handler(state, match, from - (match[0].length - text.length), to)
    if (!tr) continue
    if (rule.undoable) tr.setMeta(plugin, { transform: tr, from, to, text })
    view.dispatch(tr)
    return true
  }
  return false
}

/// This is a command that will undo an input rule, if applying such a
/// rule was the last thing that the user did.
export const undoInputRule: Command = (state, dispatch) => {
  const plugins = state.plugins
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    let undoable
    if ((plugin.spec as any).isInputRules && (undoable = plugin.getState(state))) {
      if (dispatch) {
        const tr = state.tr, toUndo = undoable.transform
        for (let j = toUndo.steps.length - 1; j >= 0; j--)
          tr.step(toUndo.steps[j].invert(toUndo.docs[j]))
        if (undoable.text) {
          const marks = tr.doc.resolve(undoable.from).marks()
          tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks))
        } else {
          tr.delete(undoable.from, undoable.to)
        }
        dispatch(tr)
      }
      return true
    }
  }
  return false
}


/// Build an input rule for automatically wrapping a textblock when a
/// given string is typed. The `regexp` argument is
/// directly passed through to the `InputRule` constructor. You'll
/// probably want the regexp to start with `^`, so that the pattern can
/// only occur at the start of a textblock.
///
/// `nodeType` is the type of node to wrap in. If it needs attributes,
/// you can either pass them directly, or pass a function that will
/// compute them from the regular expression match.
///
/// By default, if there's a node with the same type above the newly
/// wrapped node, the rule will try to [join](#transform.Transform.join) those
/// two nodes. You can pass a join predicate, which takes a regular
/// expression match and the node before the wrapped node, and can
/// return a boolean to indicate whether a join should happen.
export function wrappingInputRule(
  regexp: RegExp,
  nodeType: NodeType,
  getAttrs: Attrs | null | ((matches: RegExpMatchArray) => Attrs | null) = null,
  joinPredicate?: (match: RegExpMatchArray, node: Node) => boolean
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    const tr = state.tr.delete(start, end)
    const $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && findWrapping(range, nodeType, attrs)
    if (!wrapping) return null
    tr.wrap(range!, wrapping)
    const before = tr.doc.resolve(start - 1).nodeBefore
    if (before && before.type == nodeType && canJoin(tr.doc, start - 1) &&
      (!joinPredicate || joinPredicate(match, before)))
      tr.join(start - 1)
    return tr
  })
}

export function textblockTypeInputRule(
  regexp: RegExp,
  nodeType: NodeType,
  getAttrs: Attrs | null | ((match: RegExpMatchArray) => Attrs | null) = null
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const $start = state.doc.resolve(start)
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs
    if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) return null
    return state.tr
      .delete(start, end)
      .setBlockType(start, start, nodeType, attrs)
  })
}
export const emDash = new InputRule(/--$/, "—")
export const ellipsis = new InputRule(/\.\.\.$/, "…")
export const openDoubleQuote = new InputRule(/(?:^|[\s{[(<'"\u2018\u201C])(")$/, "“")
export const closeDoubleQuote = new InputRule(/"$/, "”")
export const openSingleQuote = new InputRule(/(?:^|[\s{[(<'"\u2018\u201C])(')$/, "‘")
export const closeSingleQuote = new InputRule(/'$/, "’")
export const smartQuotes: readonly InputRule[] = [openDoubleQuote, closeDoubleQuote, openSingleQuote, closeSingleQuote]

