import textSchema from "./textschema";
import { Selection } from "prosemirror-state"


export default class TagsView {
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node
    this.outerView = view
    this.getPos = getPos

    // The node's representation in the editor (empty, for now)
    this.dom = document.createElement("div");
    this.dom.classList.add('limpid-tag-area');
    this.input = document.createElement("input");
    this.input.classList.add('limpid-tag-input');
    this.input.classList.add('limpid-no-outline');
    this.input.placeholder = "Hit Enter, Tab or Comma to add a tag. Click on a tag to remove..."
    this.dom.appendChild(this.input);
    this.dom.onclick = (e) => {
      e.preventDefault();
      this.input.focus();
    }

    this.input.addEventListener('keyup', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
    })

    this.input.addEventListener('keydown', (e) => {

      if (!!(~['Enter', 'Tab', 'Comma'].indexOf(e.code))) {

        e.preventDefault();

        if (this.input.value.length == 0) {
          if (e.code === 'Tab') {
            this.input.blur();
            let targetPos = getPos() + this.node.nodeSize
            let selection = Selection.near(this.outerView.state.doc.resolve(targetPos), 1)
            let tr = this.outerView.state.tr.setSelection(selection).scrollIntoView()
            setTimeout(() => {
              this.outerView.dispatch(tr)
              this.outerView.focus()
            }, 100);
            return;
          }
          else {
            return;
          }
        }

        let existingSet = new Set();

        this.node.forEach(
          (node, offset, index) => {
            existingSet.add(node.textContent.toLowerCase());
          });

        existingSet.add(this.input.value.toLowerCase());
        existingSet = Array.from(existingSet);
        existingSet.sort();
        existingSet.reverse();

        this.input.value = '';
        let tagNodes = []
        existingSet.forEach((v) => {
          let nn = textSchema.nodes.tag.createAndFill(null, textSchema.text(v));
          tagNodes.push(nn);
        })

        let tr = this.outerView.state.tr.replaceWith(getPos() + 1, getPos() + 1 + this.node.nodeSize - 2, tagNodes);
        this.outerView.dispatch(tr);
      }
      else if (e.code === 'ArrowUp') {
        this.input.blur();
        let targetPos = getPos()
        let selection = Selection.near(this.outerView.state.doc.resolve(targetPos), -1)
        let tr = this.outerView.state.tr.setSelection(selection).scrollIntoView()
        setTimeout(() => {
          this.outerView.dispatch(tr)
          this.outerView.focus()
        }, 100);
      }
      else if (e.code === 'ArrowDown') {

        this.input.blur();
        let targetPos = getPos() + this.node.nodeSize
        let selection = Selection.near(this.outerView.state.doc.resolve(targetPos), 1)
        let tr = this.outerView.state.tr.setSelection(selection).scrollIntoView()
        setTimeout(() => {
          this.outerView.dispatch(tr)
          this.outerView.focus()
        }, 100);
      }
      this.input.style.opacity = 1.0;
      e.stopImmediatePropagation();
      e.stopPropagation();
    });


    this.node.forEach(
      (subNode, offset, index) => {

        let tag = document.createElement("span");
        tag.classList.add('limpid-tag-item');
        tag.innerText = '#' + subNode.textContent;
        this.dom.insertBefore(tag, this.dom.firstChild);

        if (this.input.placeholder.length > 0) {
          this.input.placeholder = '';
          this.input.style.minWidth = '100px';
        }
      }
    )
  }

  update(node) {
    if (node.type != this.node.type) return false
    this.node = node
    let tags = this.dom.getElementsByTagName("span");

    while (tags.length > 0) {
      this.dom.removeChild(tags[0]);
      tags = this.dom.getElementsByTagName("span");
    }

    this.node.forEach(
      (subNode, offset, index) => {

        let tag = document.createElement("span");
        tag.classList.add('limpid-tag-item');
        tag.innerText = '#' + subNode.textContent;
        this.dom.insertBefore(tag, this.dom.firstChild);

        if (this.input.placeholder.length > 0) {
          this.input.placeholder = '';
          this.input.style.minWidth = '100px';
        }
      }
    )

    return true;
  }

  selectNode() {
    this.input.focus();
  }

  deselectNode() {
    this.input.blur();
  }

  stopEvent() {
    return true;
  }
}
