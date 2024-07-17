
import './style.scss'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { Node as ProseNode, Schema } from 'prosemirror-model'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'

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

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
})

const state = EditorState.create({
  schema: schema,
  plugins: exampleSetup({
    schema: mySchema,
    menuBar: false
  })
})
const view = new EditorView(app, {
  state: state,
})

window.view = view;
