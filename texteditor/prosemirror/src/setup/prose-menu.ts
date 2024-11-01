/* eslint-disable @typescript-eslint/no-explicit-any */
// ICON
import crelt from "./prose-crelt"
import { lift, joinUp, selectParentNode, wrapIn, setBlockType } from "./prose-command"
import { undo, redo } from "./prose-history"
import { EditorView } from "prosemirror-view"
import { Plugin, EditorState, Transaction, NodeSelection } from "prosemirror-state"
import { NodeType, Attrs } from "prosemirror-model"

interface MenuBarOption {
  readonly content: readonly (MenuElement[])[],
  floating?: boolean;
}

interface IconSpecWithWidth {
  path: string,
  width: number,
  height: number
}

interface IconSpecWithCss {
  text: string,
  css?: string
}

interface IconSpecWithDom {
  dom: Node
}

type WrapItemOption =
  Partial<MenuItemSpec> & {
    attrs?: Attrs | null
  }

export type IconSpec =
  IconSpecWithWidth
  | IconSpecWithCss
  | IconSpecWithDom
  ;

interface MenuElementReturnType {
  dom: HTMLElement,
  update: (state: EditorState) => boolean
}

export interface MenuElement {
  render: (pm: EditorView) => MenuElementReturnType
}

export interface MenuItemSpec {
  run: (state: EditorState, dispatch: (tr: Transaction) => void, view: EditorView, event: Event) => void;
  select?: (state: EditorState) => boolean
  enable?: (state: EditorState) => boolean
  active?: (state: EditorState) => boolean
  render?: (view: EditorView) => HTMLElement
  icon?: IconSpec
  label?: string
  title?: string | ((state: EditorState) => string)
  class?: string
  css?: string
}

export class MenuItem implements MenuElement {
  constructor(
    readonly spec: MenuItemSpec
  ) { }

  render(view: EditorView) {
    const spec = this.spec
    const dom = spec.render ? spec.render(view)
      : spec.icon ? getIcon(view.root, spec.icon)
        : spec.label ? crelt("div", null, translate(view, spec.label))
          : null
    if (!dom) throw new RangeError("MenuItem without icon or label property")
    if (spec.title) {
      const title = (typeof spec.title === "function" ? spec.title(view.state) : spec.title);
      (dom as HTMLElement).setAttribute("title", translate(view, title));
    }
    if (spec.class) dom.classList.add(spec.class)
    if (spec.css) dom.style.cssText += spec.css

    dom.addEventListener("mousedown", (e: any) => {
      e.preventDefault()
      if (!dom!.classList.contains(prefixMenu + "-disabled"))
        spec.run(view.state, view.dispatch, view, e)
    })

    function update(state: EditorState) {
      if (spec.select) {
        const selected = spec.select(state)
        dom!.style.display = selected ? "" : "none"
        if (!selected) return false
      }
      let enabled = true
      if (spec.enable) {
        enabled = spec.enable(state) || false
        setClass(dom!, prefixMenu + "-disabled", !enabled)
      }
      if (spec.active) {
        const active = enabled && spec.active(state) || false
        setClass(dom!, prefixMenu + "-active", active)
      }
      return true
    }

    return { dom, update }
  }
}

const SVG = "http://www.w3.org/2000/svg"
const XLINK = "http://www.w3.org/1999/xlink"

const prefixIcon = "ProseMirror-icon"
const prefixMenuBar = "ProseMirror-menubar"
const prefixMenu = "ProseMirror-menu"

const lastMenuEvent: { time: number, node: null | Node } = { time: 0, node: null }

export const icons: { [name: string]: IconSpec } = {
  join: {
    width: 800, height: 900,
    path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
  },
  lift: {
    width: 1024, height: 1024,
    path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
  },
  selectParentNode: { text: "\u2b1a", css: "font-weight: bold" },
  undo: {
    width: 202, height: 202,
    path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
  },
  redo: {
    width: 1024, height: 1024,
    path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
  },
  strong: {
    width: 805, height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  },
  em: {
    width: 585, height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
  },
  code: {
    width: 896, height: 1024,
    path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
  },
  link: {
    width: 951, height: 1024,
    path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
  },
  bulletList: {
    width: 768, height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  orderedList: {
    width: 768, height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  blockquote: {
    width: 640, height: 896,
    path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
  }
}

export const joinUpItem = new MenuItem({
  title: "Join with above block",
  run: joinUp,
  select: state => joinUp(state),
  icon: icons.join
})

export const liftItem = new MenuItem({
  title: "Lift out of enclosing block",
  run: lift,
  select: state => lift(state),
  icon: icons.lift
})

export const selectParentNodeItem = new MenuItem({
  title: "Select parent node",
  run: selectParentNode,
  select: state => selectParentNode(state),
  icon: icons.selectParentNode
})

export const undoItem = new MenuItem({
  title: "Undo last change",
  run: undo,
  enable: state => undo(state),
  icon: icons.undo
})

export const redoItem = new MenuItem({
  title: "Redo last undone change",
  run: redo,
  enable: state => redo(state),
  icon: icons.redo
})

export class Dropdown implements MenuElement {
  content: readonly MenuElement[]

  constructor(
    content: readonly MenuElement[] | MenuElement,
    readonly options: {
      label?: string
      title?: string
      class?: string
      css?: string
    } = {}
  ) {
    this.options = options || {}
    this.content = Array.isArray(content) ? content : [content]
  }

  render(view: EditorView) {
    const content = renderDropdownItems(this.content, view)
    const win = view.dom.ownerDocument.defaultView || window

    const label = crelt("div", {
      class: prefixMenu + "-dropdown " + (this.options.class || ""),
      style: this.options.css
    },
      translate(view, this.options.label || ""))
    if (this.options.title) label.setAttribute("title", translate(view, this.options.title))
    const wrap = crelt("div", { class: prefixMenu + "-dropdown-wrap" }, label)
    let open: { close: () => boolean, node: HTMLElement } | null = null
    let listeningOnClose: (() => void) | null = null
    const close = () => {
      if (open && open.close()) {
        open = null
        win.removeEventListener("mousedown", listeningOnClose!)
      }
    }
    label.addEventListener("mousedown", (e: any) => {
      e.preventDefault()
      markMenuEvent(e)
      if (open) {
        close()
      } else {
        open = this.expand(wrap, content.dom)
        win.addEventListener("mousedown", listeningOnClose = () => {
          if (!isMenuEvent(wrap)) close()
        })
      }
    })

    function update(state: EditorState) {
      const inner = content.update(state)
      wrap.style.display = inner ? "" : "none"
      return inner
    }

    return { dom: wrap, update }
  }

  expand(dom: HTMLElement, items: readonly Node[]) {
    const menuDOM = crelt("div", { class: prefixMenu + "-dropdown-menu " + (this.options.class || "") }, items)

    let done = false
    function close(): boolean {
      if (done) return false
      done = true
      dom.removeChild(menuDOM)
      return true
    }
    dom.appendChild(menuDOM)
    return { close, node: menuDOM }
  }
}

export class DropdownSubmenu implements MenuElement {
  content: readonly MenuElement[]

  constructor(
    content: readonly MenuElement[] | MenuElement,
    readonly options: {
      label?: string
    } = {}
  ) {
    this.content = Array.isArray(content) ? content : [content]
  }

  render(view: EditorView) {
    const items = renderDropdownItems(this.content, view)
    const win = view.dom.ownerDocument.defaultView || window

    const label = crelt("div", { class: prefixMenu + "-submenu-label" }, translate(view, this.options.label || ""))
    const wrap = crelt("div", { class: prefixMenu + "-submenu-wrap" }, label,
      crelt("div", { class: prefixMenu + "-submenu" }, items.dom))
    let listeningOnClose: (() => void) | null = null
    label.addEventListener("mousedown", (e: any) => {
      e.preventDefault()
      markMenuEvent(e)
      setClass(wrap, prefixMenu + "-submenu-wrap-active", false)
      if (!listeningOnClose)
        win.addEventListener("mousedown", listeningOnClose = () => {
          if (!isMenuEvent(wrap)) {
            wrap.classList.remove(prefixMenu + "-submenu-wrap-active")
            win.removeEventListener("mousedown", listeningOnClose!)
            listeningOnClose = null
          }
        })
    })

    function update(state: EditorState) {
      const inner = items.update(state)
      wrap.style.display = inner ? "" : "none"
      return inner
    }
    return { dom: wrap, update }
  }
}


class MenuBarView {
  wrapper: HTMLElement
  menu: HTMLElement
  spacer: HTMLElement | null = null
  maxHeight = 0
  widthForMaxHeight = 0
  floating = false
  contentUpdate: (state: EditorState) => boolean
  scrollHandler: ((event: Event) => void) | null = null
  root: Document | ShadowRoot

  constructor(
    readonly editorView: EditorView,
    readonly options: Parameters<typeof menuBar>[0]
  ) {
    this.root = editorView.root
    this.wrapper = crelt("div", { class: prefixMenuBar + "-wrapper" })
    this.menu = this.wrapper.appendChild(crelt("div", { class: prefixMenuBar }))
    this.menu.className = prefixMenuBar

    if (editorView.dom.parentNode)
      editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom)
    this.wrapper.appendChild(editorView.dom)

    const { dom, update } = renderGrouped(this.editorView, this.options.content)
    this.contentUpdate = update
    this.menu.appendChild(dom)
    this.update()

    if (options.floating && !isIOS()) {
      this.updateFloat()
      const potentialScrollers = getAllWrapping(this.wrapper)
      this.scrollHandler = (e: Event) => {
        const root = this.editorView.root
        if (!((root as Document).body || root).contains(this.wrapper))
          potentialScrollers.forEach(el => el.removeEventListener("scroll", this.scrollHandler!))
        else
          this.updateFloat((e.target as HTMLElement).getBoundingClientRect ? e.target as HTMLElement : undefined)
      }
      potentialScrollers.forEach(el => el.addEventListener('scroll', this.scrollHandler!))
    }
  }

  update() {
    if (this.editorView.root != this.root) {
      const { dom, update } = renderGrouped(this.editorView, this.options.content)
      this.contentUpdate = update
      this.menu.replaceChild(dom, this.menu.firstChild!)
      this.root = this.editorView.root
    }
    this.contentUpdate(this.editorView.state)

    if (this.floating) {
      this.updateScrollCursor()
    } else {
      if (this.menu.offsetWidth != this.widthForMaxHeight) {
        this.widthForMaxHeight = this.menu.offsetWidth
        this.maxHeight = 0
      }
      if (this.menu.offsetHeight > this.maxHeight) {
        this.maxHeight = this.menu.offsetHeight
        this.menu.style.minHeight = this.maxHeight + "px"
      }
    }
  }

  updateScrollCursor() {
    const selection = (this.editorView.root as Document).getSelection()!
    if (!selection.focusNode) return
    const rects = selection.getRangeAt(0).getClientRects()
    const selRect = rects[selectionIsInverted(selection) ? 0 : rects.length - 1]
    if (!selRect) return
    const menuRect = this.menu.getBoundingClientRect()
    if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
      const scrollable = findWrappingScrollable(this.wrapper)
      if (scrollable) scrollable.scrollTop -= (menuRect.bottom - selRect.top)
    }
  }

  updateFloat(scrollAncestor?: HTMLElement) {
    const parent = this.wrapper, editorRect = parent.getBoundingClientRect(),
      top = scrollAncestor ? Math.max(0, scrollAncestor.getBoundingClientRect().top) : 0

    if (this.floating) {
      if (editorRect.top >= top || editorRect.bottom < this.menu.offsetHeight + 10) {
        this.floating = false
        this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = ""
        this.menu.style.display = ""
        this.spacer!.parentNode!.removeChild(this.spacer!)
        this.spacer = null
      } else {
        const border = (parent.offsetWidth - parent.clientWidth) / 2
        this.menu.style.left = (editorRect.left + border) + "px"
        this.menu.style.display = editorRect.top > (this.editorView.dom.ownerDocument.defaultView || window).innerHeight
          ? "none" : ""
        if (scrollAncestor) this.menu.style.top = top + "px"
      }
    } else {
      if (editorRect.top < top && editorRect.bottom >= this.menu.offsetHeight + 10) {
        this.floating = true
        const menuRect = this.menu.getBoundingClientRect()
        this.menu.style.left = menuRect.left + "px"
        this.menu.style.width = menuRect.width + "px"
        if (scrollAncestor) this.menu.style.top = top + "px"
        this.menu.style.position = "fixed"
        this.spacer = crelt("div", { class: prefixMenuBar + "-spacer", style: `height: ${menuRect.height}px` })
        parent.insertBefore(this.spacer!, this.menu)
      }
    }
  }

  destroy() {
    if (this.wrapper.parentNode)
      this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper)
  }
}

function hashPath(path: string) {
  let hash = 0
  for (let i = 0; i < path.length; i++)
    hash = (((hash << 5) - hash) + path.charCodeAt(i)) | 0
  return hash
}

export function getIcon(root: Document | ShadowRoot, icon: IconSpec): HTMLElement {
  const doc = (root.nodeType == 9 ? root as Document : root.ownerDocument) || document
  const node = doc.createElement("div")
  node.className = prefixIcon
  if ((icon as any).path) {
    const { path, width, height } = icon as { path: string, width: number, height: number }
    const name = "pm-icon-" + hashPath(path).toString(16)
    if (!doc.getElementById(name)) buildSVG(root, name, icon as { path: string, width: number, height: number })
    const svg = node.appendChild(doc.createElementNS(SVG, "svg"))
    svg.style.width = (width / height) + "em"
    const use = svg.appendChild(doc.createElementNS(SVG, "use"))
    use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(doc.location.toString())![1] + "#" + name)
  } else if ((icon as any).dom) {
    node.appendChild((icon as any).dom.cloneNode(true))
  } else {
    const { text, css } = icon as { text: string, css?: string }
    node.appendChild(doc.createElement("span")).textContent = text || ''
    if (css) (node.firstChild as HTMLElement).style.cssText = css
  }
  return node
}


function buildSVG(root: Document | ShadowRoot, name: string, data: IconSpecWithWidth) {
  const [doc, top] = root.nodeType == 9 ? [root as Document, (root as Document).body] : [root.ownerDocument || document, root]
  let collection = doc.getElementById(prefixIcon + "-collection") as Element
  if (!collection) {
    collection = doc.createElementNS(SVG, "svg")
    collection.id = prefixIcon + "-collection";
    (collection as HTMLElement).style.display = "none"
    top.insertBefore(collection, top.firstChild)
  }
  const sym = doc.createElementNS(SVG, "symbol")
  sym.id = name
  sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height)
  const path = sym.appendChild(doc.createElementNS(SVG, "path"))
  path.setAttribute("d", data.path)
  collection.appendChild(sym)
}


function translate(view: EditorView, text: string): string {
  return (view as any)._props.translate ? (view as any)._props.translate(text) : text
}

function markMenuEvent(e: Event) {
  lastMenuEvent.time = Date.now()
  lastMenuEvent.node = e.target as Node
}
function isMenuEvent(wrapper: HTMLElement) {
  return Date.now() - 100 < lastMenuEvent.time &&
    lastMenuEvent.node && wrapper.contains(lastMenuEvent.node)
}

function renderDropdownItems(items: readonly MenuElement[], view: EditorView) {
  const rendered = [], updates = []
  for (let i = 0; i < items.length; i++) {
    const { dom, update } = items[i].render(view)
    rendered.push(crelt("div", { class: prefixMenu + "-dropdown-item" }, dom))
    updates.push(update)
  }
  return { dom: rendered, update: combineUpdates(updates, rendered) }
}

function combineUpdates(
  updates: readonly ((state: EditorState) => boolean)[],
  nodes: readonly HTMLElement[]
) {
  return (state: EditorState) => {
    let something = false
    for (let i = 0; i < updates.length; i++) {
      const up = updates[i](state)
      nodes[i].style.display = up ? "" : "none"
      if (up) something = true
    }
    return something
  }
}

export function renderGrouped(view: EditorView, content: readonly (readonly MenuElement[])[]) {
  const result = document.createDocumentFragment()
  const updates: ((state: EditorState) => boolean)[] = [], separators: HTMLElement[] = []
  for (let i = 0; i < content.length; i++) {
    const items = content[i], localUpdates = [], localNodes = []
    for (let j = 0; j < items.length; j++) {
      const { dom, update } = items[j].render(view)
      const span = crelt("span", { class: prefixMenu + "item" }, dom)
      result.appendChild(span)
      localNodes.push(span)
      localUpdates.push(update)
    }
    if (localUpdates.length) {
      updates.push(combineUpdates(localUpdates, localNodes))
      if (i < content.length - 1)
        separators.push(result.appendChild(separator()))
    }
  }

  function update(state: EditorState) {
    let something = false, needSep = false
    for (let i = 0; i < updates.length; i++) {
      const hasContent = updates[i](state)
      if (i) separators[i - 1].style.display = needSep && hasContent ? "" : "none"
      needSep = hasContent
      if (hasContent) something = true
    }
    return something
  }
  return { dom: result, update }
}

function separator() {
  return crelt("span", { class: prefixMenu + "separator" })
}

export function wrapItem(nodeType: NodeType, options: WrapItemOption) {
  const passedOptions: MenuItemSpec = {
    run(state, dispatch) {
      return wrapIn(nodeType, options.attrs)(state, dispatch)
    },
    select(state) {
      return wrapIn(nodeType, options.attrs)(state)
    }
  }
  for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop]
  return new MenuItem(passedOptions)
}

export function blockTypeItem(nodeType: NodeType, options: WrapItemOption) {
  const command = setBlockType(nodeType, options.attrs)
  const passedOptions: MenuItemSpec = {
    run: command,
    enable(state) { return command(state) },
    active(state) {
      const { $from, to, node } = state.selection as NodeSelection
      if (node) return node.hasMarkup(nodeType, options.attrs)
      return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs)
    }
  }
  for (const prop in options) (passedOptions as any)[prop] = (options as any)[prop]
  return new MenuItem(passedOptions)
}

function setClass(dom: HTMLElement, cls: string, on: boolean) {
  if (on) dom.classList.add(cls)
  else dom.classList.remove(cls)
}

function isIOS() {
  if (typeof navigator == "undefined") return false
  const agent = navigator.userAgent
  return !/Edge\/\d/.test(agent) && /AppleWebKit/.test(agent) && /Mobile\/\w+/.test(agent)
}

export function menuBar(options: MenuBarOption): Plugin {
  return new Plugin({
    view(editorView) { return new MenuBarView(editorView, options) }
  })
}

function selectionIsInverted(selection: Selection) {
  if (selection.anchorNode == selection.focusNode) return selection.anchorOffset > selection.focusOffset
  return selection.anchorNode!.compareDocumentPosition(selection.focusNode!) == Node.DOCUMENT_POSITION_FOLLOWING
}

function findWrappingScrollable(node: Node) {
  for (let cur = node.parentNode; cur; cur = cur.parentNode)
    if ((cur as HTMLElement).scrollHeight > (cur as HTMLElement).clientHeight) return cur as HTMLElement
}

function getAllWrapping(node: Node) {
  const res: (Node | Window)[] = [node.ownerDocument!.defaultView || window]
  for (let cur = node.parentNode; cur; cur = cur.parentNode)
    res.push(cur)
  return res
}
