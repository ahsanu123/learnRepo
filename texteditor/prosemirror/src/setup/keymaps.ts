import { Schema } from "prosemirror-model"
import { Command } from "prosemirror-state"
import {
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift, selectParentNode,
  setBlockType,
  toggleMark,
  wrapIn
} from "./prose-command"
import { redo, undo } from "./prose-history"
import { undoInputRule } from "./prose-input-rule"
import { liftListItem, sinkListItem, splitListItem, wrapInList } from "./prose-schema-list"

const mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false

export function buildKeymap(schema: Schema, mapKeys?: { [key: string]: false | string }) {
  const keys: { [key: string]: Command } = {}
  let type
  function bind(key: string, cmd: Command) {
    if (mapKeys) {
      const mapped = mapKeys[key]
      if (mapped === false) return
      if (mapped) key = mapped
    }
    keys[key] = cmd
  }
  bind("Mod-z", undo)
  bind("Shift-Mod-z", redo)
  bind("Backspace", undoInputRule)
  if (!mac) bind("Mod-y", redo)

  bind("Alt-ArrowUp", joinUp)
  bind("Alt-ArrowDown", joinDown)
  bind("Mod-BracketLeft", lift)
  bind("Escape", selectParentNode)
  type = schema.marks.strong
  if (type) {
    bind("Mod-b", toggleMark(type))
    bind("Mod-B", toggleMark(type))
  }
  type = schema.marks.em
  if (type) {
    bind("Mod-i", toggleMark(type))
    bind("Mod-I", toggleMark(type))
  }
  type = schema.marks.code
  if (type)
    bind("Mod-`", toggleMark(type))
  type = schema.nodes.bullet_list
  if (type)
    bind("Shift-Ctrl-8", wrapInList(type))
  type = schema.nodes.ordered_list
  if (type)
    bind("Shift-Ctrl-9", wrapInList(type))
  type = schema.nodes.blockquote
  if (type)
    bind("Ctrl->", wrapIn(type))
  type = schema.nodes.hard_break
  if (type) {
    const br = type, cmd = chainCommands(exitCode, (state, dispatch) => {
      if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView())
      return true
    })
    bind("Mod-Enter", cmd)
    bind("Shift-Enter", cmd)
    if (mac) bind("Ctrl-Enter", cmd)
  }
  type = schema.nodes.list_item
  if (type) {
    bind("Enter", splitListItem(type))
    bind("Mod-[", liftListItem(type))
    bind("Mod-]", sinkListItem(type))
  }
  type = schema.nodes.paragraph
  if (type)
    bind("Shift-Ctrl-0", setBlockType(type))
  type = schema.nodes.code_block
  if (type)
    bind("Shift-Ctrl-\\", setBlockType(type))
  type = schema.nodes.heading
  if (type)
    for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(type, { level: i }))
  type = schema.nodes.horizontal_rule
  if (type) {
    const hr = type
    bind("Mod-_", (state, dispatch) => {
      if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView())
      return true
    })
  }

  return keys
}
