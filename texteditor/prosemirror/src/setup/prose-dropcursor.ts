/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { dropPoint } from "prosemirror-transform"

interface DropCursorOptions {
  color?: string | false
  width?: number
  class?: string
}

interface DropCursorHandler {
  name: string;
  handler: (event: Event) => void;
}

export function dropCursor(options: DropCursorOptions): Plugin {
  return new Plugin({
    view(editorView) { return new DropCursorView(editorView, options) }
  })
}

class DropCursorView {
  width: number
  color: string | undefined
  class: string | undefined
  cursorPos: number | null = null
  element: HTMLElement | null = null
  timeout: number = -1
  handlers: DropCursorHandler[]

  constructor(readonly editorView: EditorView, options: DropCursorOptions) {
    this.width = options.width ?? 1
    this.color = options.color === false ? undefined : (options.color || "black")
    this.class = options.class

    this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(name => {
      const handler = (e: Event) => { (this as any)[name](e) }
      editorView.dom.addEventListener(name, handler)
      return { name, handler }
    })
  }

  destroy() {
    this.handlers.forEach(({ name, handler }) => this.editorView.dom.removeEventListener(name, handler))
  }

  update(editorView: EditorView, prevState: EditorState) {
    if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
      if (this.cursorPos > editorView.state.doc.content.size) this.setCursor(null)
      else this.updateOverlay()
    }
  }

  setCursor(pos: number | null) {
    if (pos == this.cursorPos) return
    this.cursorPos = pos
    if (pos == null) {
      this.element!.parentNode!.removeChild(this.element!)
      this.element = null
    } else {
      this.updateOverlay()
    }
  }

  updateOverlay() {
    const $pos = this.editorView.state.doc.resolve(this.cursorPos!)
    const isBlock = !$pos.parent.inlineContent
    let rect
    const editorDOM = this.editorView.dom, editorRect = editorDOM.getBoundingClientRect()
    const scaleX = editorRect.width / editorDOM.offsetWidth, scaleY = editorRect.height / editorDOM.offsetHeight
    if (isBlock) {
      const before = $pos.nodeBefore, after = $pos.nodeAfter
      if (before || after) {
        const node = this.editorView.nodeDOM(this.cursorPos! - (before ? before.nodeSize : 0))
        if (node) {
          const nodeRect = (node as HTMLElement).getBoundingClientRect()
          let top = before ? nodeRect.bottom : nodeRect.top
          if (before && after)
            top = (top + (this.editorView.nodeDOM(this.cursorPos!) as HTMLElement).getBoundingClientRect().top) / 2
          const halfWidth = (this.width / 2) * scaleY
          rect = { left: nodeRect.left, right: nodeRect.right, top: top - halfWidth, bottom: top + halfWidth }
        }
      }
    }
    if (!rect) {
      const coords = this.editorView.coordsAtPos(this.cursorPos!)
      const halfWidth = (this.width / 2) * scaleX
      rect = { left: coords.left - halfWidth, right: coords.left + halfWidth, top: coords.top, bottom: coords.bottom }
    }

    const parent = this.editorView.dom.offsetParent as HTMLElement
    if (!this.element) {
      this.element = parent.appendChild(document.createElement("div"))
      if (this.class) this.element.className = this.class
      this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;"
      if (this.color) {
        this.element.style.backgroundColor = this.color
      }
    }
    this.element.classList.toggle("prosemirror-dropcursor-block", isBlock)
    this.element.classList.toggle("prosemirror-dropcursor-inline", !isBlock)
    let parentLeft, parentTop
    if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
      parentLeft = -pageXOffset
      parentTop = -pageYOffset
    } else {
      const rect = parent.getBoundingClientRect()
      const parentScaleX = rect.width / parent.offsetWidth, parentScaleY = rect.height / parent.offsetHeight
      parentLeft = rect.left - parent.scrollLeft * parentScaleX
      parentTop = rect.top - parent.scrollTop * parentScaleY
    }
    this.element.style.left = (rect.left - parentLeft) / scaleX + "px"
    this.element.style.top = (rect.top - parentTop) / scaleY + "px"
    this.element.style.width = (rect.right - rect.left) / scaleX + "px"
    this.element.style.height = (rect.bottom - rect.top) / scaleY + "px"
  }

  scheduleRemoval(timeout: number) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.setCursor(null), timeout)
  }

  dragover(event: DragEvent) {
    if (!this.editorView.editable) return
    const pos = this.editorView.posAtCoords({ left: event.clientX, top: event.clientY })

    const node = pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside)
    const disableDropCursor = node && node.type.spec.disableDropCursor
    const disabled = typeof disableDropCursor == "function" ? disableDropCursor(this.editorView, pos, event) : disableDropCursor

    if (pos && !disabled) {
      let target: number | null = pos.pos
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        const point = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice)
        if (point != null) target = point
      }
      this.setCursor(target)
      this.scheduleRemoval(5000)
    }
  }

  dragend() {
    this.scheduleRemoval(20)
  }

  drop() {
    this.scheduleRemoval(20)
  }

  dragleave(event: DragEvent) {
    if (event.target == this.editorView.dom || !this.editorView.dom.contains((event as any).relatedTarget))
      this.setCursor(null)
  }
}
