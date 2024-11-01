/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { DOMParser as ProseDOMParser, Node as ProseNode, Schema } from 'prosemirror-model'
import { schema } from './schemas'
import { exampleSetup } from './setup'
import './style.scss'

declare global {
  interface Window {
    view: EditorView
  }
}

class ImageView implements NodeView {
  dom: HTMLImageElement

  constructor(node: ProseNode) {
    // The editor will use this as the node's DOM representation
    this.dom = document.createElement("img")
    this.dom.src = node.attrs.src
    this.dom.addEventListener("click", e => {
      console.log("You clicked me!")
      e.preventDefault()
    })
  }
  stopEvent() { return true }
}

const app = document.querySelector<HTMLDivElement>('#app')!

const customPlugin = new Plugin({
  props: {
    handleKeyDown(view, event) {
      return false;
    }
  }
})

const mySchema = new Schema({
  nodes: schema.spec.nodes,
  marks: schema.spec.marks
})

const state = EditorState.create(
  {
    doc: ProseDOMParser.fromSchema(mySchema).parse(new DOMParser().parseFromString("<h2>hello</h2>", 'text/html')),
    plugins: [
      ...exampleSetup({ schema: mySchema }),
      customPlugin
    ]
  }
);


const view = new EditorView(app, { state })

window.view = view;
