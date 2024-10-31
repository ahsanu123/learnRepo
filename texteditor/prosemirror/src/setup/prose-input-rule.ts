/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, Transaction, EditorState, TextSelection, Command } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

import { findWrapping, canJoin } from "prosemirror-transform"
import { NodeType, Node, Attrs } from "prosemirror-model"

/// Input rules are regular expressions describing a piece of text
/// that, when typed, causes something to happen. This might be
/// changing two dashes into an emdash, wrapping a paragraph starting
/// with `"> "` into a blockquote, or something entirely different.
export class InputRule {
  /// @internal
  handler: (state: EditorState, match: RegExpMatchArray, start: number, end: number) => Transaction | null

  /// @internal
  undoable: boolean
  inCode: boolean | "only"

  // :: (RegExp, union<string, (state: EditorState, match: [string], start: number, end: number) → ?Transaction>)
  /// Create an input rule. The rule applies when the user typed
  /// something and the text directly in front of the cursor matches
  /// `match`, which should end with `$`.
  ///
  /// The `handler` can be a string, in which case the matched text, or
  /// the first matched group in the regexp, is replaced by that
  /// string.
  ///
  /// Or a it can be a function, which will be called with the match
  /// array produced by
  /// [`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
  /// as well as the start and end of the matched range, and which can
  /// return a [transaction](#state.Transaction) that describes the
  /// rule's effect, or null to indicate the input was not handled.
  constructor(
    /// @internal
    readonly match: RegExp,
    handler: string | ((state: EditorState, match: RegExpMatchArray, start: number, end: number) => Transaction | null),
    options: {
      /// When set to false,
      /// [`undoInputRule`](#inputrules.undoInputRule) doesn't work on
      /// this rule.
      undoable?: boolean,
      /// By default, input rules will not apply inside nodes marked
      /// as [code](#model.NodeSpec.code). Set this to true to change
      /// that, or to `"only"` to _only_ match in such nodes.
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

type PluginState = { transform: Transaction, from: number, to: number, text: string } | null

/// Create an input rules plugin. When enabled, it will cause text
/// input that matches any of the given rules to trigger the rule's
/// action.
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

/// Build an input rule that changes the type of a textblock when the
/// matched text is typed into it. You'll usually want to start your
/// regexp with `^` to that it is only matched at the start of a
/// textblock. The optional `getAttrs` parameter can be used to compute
/// the new node's attributes, and works the same as in the
/// `wrappingInputRule` function.
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
/// Converts double dashes to an emdash.
export const emDash = new InputRule(/--$/, "—")
/// Converts three dots to an ellipsis character.
export const ellipsis = new InputRule(/\.\.\.$/, "…")
/// “Smart” opening double quotes.
export const openDoubleQuote = new InputRule(/(?:^|[\s{[(<'"\u2018\u201C])(")$/, "“")
/// “Smart” closing double quotes.
export const closeDoubleQuote = new InputRule(/"$/, "”")
/// “Smart” opening single quotes.
export const openSingleQuote = new InputRule(/(?:^|[\s{[(<'"\u2018\u201C])(')$/, "‘")
/// “Smart” closing single quotes.
export const closeSingleQuote = new InputRule(/'$/, "’")

/// Smart-quote related input rules.
export const smartQuotes: readonly InputRule[] = [openDoubleQuote, closeDoubleQuote, openSingleQuote, closeSingleQuote]

