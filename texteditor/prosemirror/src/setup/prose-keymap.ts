import { Plugin, Command } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { base, keyName } from "./prose-w3c-keyname"

const mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false

function normalizeKeyName(name: string) {
  const parts = name.split(/-(?!$)/)
  let result = parts[parts.length - 1]
  if (result == "Space") result = " "
  let alt, ctrl, shift, meta
  for (let i = 0; i < parts.length - 1; i++) {
    const mod = parts[i]
    if (/^(cmd|meta|m)$/i.test(mod)) meta = true
    else if (/^a(lt)?$/i.test(mod)) alt = true
    else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true
    else if (/^s(hift)?$/i.test(mod)) shift = true
    else if (/^mod$/i.test(mod)) { if (mac) meta = true; else ctrl = true }
    else throw new Error("Unrecognized modifier name: " + mod)
  }
  if (alt) result = "Alt-" + result
  if (ctrl) result = "Ctrl-" + result
  if (meta) result = "Meta-" + result
  if (shift) result = "Shift-" + result
  return result
}

function normalize(map: { [key: string]: Command }) {
  const copy: { [key: string]: Command } = Object.create(null)
  for (const prop in map) copy[normalizeKeyName(prop)] = map[prop]
  return copy
}

function modifiers(name: string, event: KeyboardEvent, shift = true) {
  if (event.altKey) name = "Alt-" + name
  if (event.ctrlKey) name = "Ctrl-" + name
  if (event.metaKey) name = "Meta-" + name
  if (shift && event.shiftKey) name = "Shift-" + name
  return name
}

export function keymap(bindings: { [key: string]: Command }): Plugin {
  return new Plugin({
    props: {
      handleKeyDown: keydownHandler(bindings)
    }
  })
}

export function keydownHandler(bindings: { [key: string]: Command }): (view: EditorView, event: KeyboardEvent) => boolean {
  const map = normalize(bindings)
  return function (view, event) {
    const name = keyName(event), direct = map[modifiers(name, event)]
    let baseName
    if (direct && direct(view.state, view.dispatch, view)) return true

    if (name.length == 1 && name != " ") {
      if (event.shiftKey) {

        const noShift = map[modifiers(name, event, false)]
        if (noShift && noShift(view.state, view.dispatch, view)) return true
      }
      if ((event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) &&
        (baseName = base[event.keyCode]) && baseName != name) {

        const fromCode = map[modifiers(baseName, event)]
        if (fromCode && fromCode(view.state, view.dispatch, view)) return true
      }
    }
    return false
  }
}
