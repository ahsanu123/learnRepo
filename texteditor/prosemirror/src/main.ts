import './style.scss'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'

declare global {
  interface Window {
    view: EditorView
  }
}

const app = document.querySelector<HTMLDivElement>('#app')!

const state = EditorState.create({
  schema: schema,
  plugins: [
    history(),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo
    })
  ]
})
const view = new EditorView(app, {
  state: state,

  dispatchTransaction: function(transaction) {
    console.log("Document size went from", transaction.before.content.size,
      "to", transaction.doc.content.size)
    let newState = view.state.apply(transaction)
    view.updateState(newState)
  },

})

window.view = view;
