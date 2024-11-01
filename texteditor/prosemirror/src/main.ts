/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditorState, Plugin, PluginView } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { DOMParser as ProseDOMParser, Node as ProseNode, Schema } from 'prosemirror-model'
import { schema } from './schemas'
import { buildMenuItems, exampleSetup, menuBar } from './setup'
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
    handleClick(view, pos, event) {
      console.log('view: ', view);
      console.log('event: ', event);
      console.log('pos: ', pos);
      return false;
    },
    handleDrop(view, event, slice, moved) {
      console.log('view: ', view);
      console.log('event: ', event);
      console.log('slice: ', slice);
      console.log('moved: ', moved);
      return false;
    },
    handleKeyDown(view, event) {
      console.log('view: ', view);
      console.log('event: ', event);
      return false;
    }
  }
})

const helloWorldPluginView: PluginView = {
  update(view, prevState) {
    if (prevState.doc.content.childCount > 4) return
    const otherHeder = document.createElement('h1')
    otherHeder.innerHTML = 'second header'

    if (prevState.doc.content.childCount < 4) view.dom.appendChild(otherHeder)

  },
  destroy() {

  },
};

const helloWorldPlugin = new Plugin({
  view: (view) => helloWorldPluginView
})

const mySchema = new Schema({
  nodes: schema.spec.nodes,
  marks: schema.spec.marks
})

const state = EditorState.create(
  {
    doc: ProseDOMParser.fromSchema(mySchema).parse(new DOMParser().parseFromString("<h2>hello</h2>", 'text/html')),
    plugins: [
      // ...exampleSetup({ schema: mySchema }),
      // customPlugin
      helloWorldPlugin
    ]
  }
);


const view = new EditorView(app, {
  state,
})

window.view = view;
