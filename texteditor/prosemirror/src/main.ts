/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditorState, Plugin, PluginView } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'
import { DOMParser as ProseDOMParser, Node as ProseNode, Schema } from 'prosemirror-model'
import { schema } from './schemas'
import { baseKeymap, buildMenuItems, exampleSetup, menuBar } from './setup'
import './style.scss'
import { keymap } from './setup/prose-keymap'
import { findWrapping } from 'prosemirror-transform'
import { DispatchCallback } from './util/Util'

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


const printDocOnEnter = new Plugin({
  props: {
    handleClick: (view, pos, event) => {
      const json = view.state.toJSON();
      console.dir(json, {
        colors: true
      })
    },
  },
  // view: (view) => helloWorldPluginView
})

const noteSchema = new Schema({
  nodes: {
    text: {
      group: "inline",
    },
    star: {
      inline: true,
      group: "inline",
      toDOM() { return ["star", "🔥"] },
      parseDOM: [{ tag: "star" }]
    },
    paragraph: {
      group: "block",
      content: "inline*",
      toDOM() { return ["p", 0] },
      parseDOM: [{ tag: "p" }]
    },
    boring_paragraph: {
      group: "block",
      content: "text*",
      marks: "",
      toDOM() { return ["p", { class: "boring" }, 0] },
      parseDOM: [{ tag: "p.boring", priority: 60 }]
    },
    doc: {
      content: "block+"
    }
  }
});

function insertStar(state: EditorState, dispatch: DispatchCallback) {
  const type = noteSchema.nodes.star
  const { $from } = state.selection
  if (!$from.parent.canReplaceWith($from.index(), $from.index(), type))
    return false
  dispatch && dispatch(state.tr.replaceSelectionWith(type.create()))
  return true
}

function makeNoteGroup(state: EditorState, dispatch: DispatchCallback) {
  // Get a range around the selected blocks
  const range = state.selection.$from.blockRange(state.selection.$to)
  // See if it is possible to wrap that range in a note group
  if (!range) return false;
  const wrapping = findWrapping(range, noteSchema.nodes.notegroup)
  // If not, the command doesn't apply
  if (!wrapping) return false
  // Otherwise, dispatch a transaction, using the `wrap` method to
  // create the step that does the actual wrapping.
  if (dispatch) dispatch(state.tr.wrap(range, wrapping).scrollIntoView())
  return true
}

function consoleOnKeyPress(state: EditorState, dispatch: DispatchCallback) {
  console.dir(state, {
    colors: true
  })
  return true;
}

class SimpleButton implements PluginView {
  private view: EditorView
  private dom: HTMLElement

  constructor(view: EditorView) {
    this.view = view
    this.dom = document.createElement('div')
    const firstButton = document.createElement('button');
    firstButton.innerText = 'simple Button'
    firstButton.addEventListener('click', () => console.log('simpleButton Clicked', this.view.state))

    const secondButton = document.createElement('button');
    secondButton.innerText = 'insert fire'
    secondButton.addEventListener('click', () => {
      const type = noteSchema.nodes.star
      // view.dispatch(view.state.tr.insertText('multiple time?? '))
      view.dispatch(view.state.tr.insert(view.state.selection.head, type.create()))
    })
    this.dom.append(firstButton)
    this.dom.append(secondButton)


  }

  get simpleButtonDom() {
    return this.dom
  }
  update(view: EditorView, prevState: EditorState) { }
  destroy() { }
}

const menuPlug = new Plugin({
  view(view) {
    const pluginView = new SimpleButton(view);
    view.dom.parentNode?.append(pluginView.simpleButtonDom)
    return pluginView
  },
});

const state = EditorState.create(
  {
    doc: ProseDOMParser.fromSchema(noteSchema).parse(new DOMParser().parseFromString("initial text", 'text/html')),
    plugins: [
      keymap({
        'Ctrl-b': makeNoteGroup,
        'Ctrl-q': insertStar,
        'Ctrl-g': consoleOnKeyPress,
        ...baseKeymap,
      }),
      menuPlug
    ]
  }
);

const view = new EditorView(app, {
  state,
})

window.view = view;
