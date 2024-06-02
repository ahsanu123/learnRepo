import { Component } from '@angular/core';
import { Attrs } from '@milkdown/prose/model';


const prefix = "ProseMirror-Prompt";

@Component({
  selector: 'app-prosemirror-basic-editor',
  standalone: true,
  imports: [],
  templateUrl: './prosemirror-basic-editor.component.html',
  styleUrl: './prosemirror-basic-editor.component.scss'
})
export class ProsemirrorBasicEditorComponent {

}

// function from example: https://github.com/ProseMirror/prosemirror-example-setup

// ========================================================
// Promt 
// ========================================================

interface FieldOptionsProps {
  value?: any;
  label: string;
  required?: boolean;
  validate?: (value: any) => string | null;
  clean?: (value: any) => any;
}

abstract class Field {
  constructor(
    readonly options: FieldOptionsProps
  ) { }

  abstract render(): HTMLElement

  read(dom: HTMLElement) { return (dom as any).value }

  validateType(value: any): string | null { return null }

  validate(value: any): string | null {
    if (!value && this.options.required) {
      return "Required Fields";
    }
    return this.validateType(value) || (this.options.validate ? this.options.validate(value) : null);
  }

  clean(value: any): any {
    return this.options.clean ? this.options.clean(value) : null;
  }
}

interface OpenProptProps {
  title: string;
  fields: {
    [name: string]: Field
  },
  callback: (attrs: Attrs) => void
}{

}

function openPromt(options: OpenProptProps) {
  let wrapper = document.body.appendChild(document.createElement("div"))
  wrapper.className = prefix

  let mouseOutside = (e: MouseEvent) => { if (!wrapper.contains(e.target as HTMLElement)) close() }
  setTimeout(() => window.addEventListener("mousedown", mouseOutside), 50)
  let close = () => {
    window.removeEventListener("mousedown", mouseOutside)
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper)
  }

  let domFields: HTMLElement[] = []
  for (let name in options.fields) domFields.push(options.fields[name].render())

  let submitButton = document.createElement("button")
  submitButton.type = "submit"
  submitButton.className = prefix + "-submit"
  submitButton.textContent = "OK"
  let cancelButton = document.createElement("button")
  cancelButton.type = "button"
  cancelButton.className = prefix + "-cancel"
  cancelButton.textContent = "Cancel"
  cancelButton.addEventListener("click", close)

  let form = wrapper.appendChild(document.createElement("form"))
  if (options.title) form.appendChild(document.createElement("h5")).textContent = options.title
  domFields.forEach(field => {
    form.appendChild(document.createElement("div")).appendChild(field)
  })
  let buttons = form.appendChild(document.createElement("div"))
  buttons.className = prefix + "-buttons"
  buttons.appendChild(submitButton)
  buttons.appendChild(document.createTextNode(" "))
  buttons.appendChild(cancelButton)

  let box = wrapper.getBoundingClientRect()
  wrapper.style.top = ((window.innerHeight - box.height) / 2) + "px"
  wrapper.style.left = ((window.innerWidth - box.width) / 2) + "px"

  let submit = () => {

  }

  form.addEventListener("submit", e => {
    e.preventDefault()
    submit()
  })

  form.addEventListener("keydown", e => {
    if (e.keyCode == 27) {
      e.preventDefault()
      close()
    } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault()
      submit()
    } else if (e.keyCode == 9) {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) close()
      }, 500)
    }
  })

  let input = form.elements[0] as HTMLElement
  if (input) input.focus()
}

// ========================================================
// Menu 
// ========================================================



// ========================================================
// Keymaps 
// ========================================================



// ========================================================
// Input Rules 
// ========================================================


