
export default class EquationRefView {
  constructor(node, view, getPos, equationManager) {
    this.node = node
    this.outerView = view
    this.getPos = getPos

    this.dom = document.createElement("span");
    this.dom.className = "limpid-equation-ref";
    let key = this.node.attrs.id;
    this.dom.setAttribute('data-equation-key', key);

    this.dom.innerText = "Eq. " + equationManager.fetchCountByKey(key);
  }

  update(node) {
    if (node.type != this.node.type) return false
    this.node = node;
    return true;
  }

  selectNode() {
    this.dom.classList.add("ProseMirror-selectednode")
  }

  deselectNode() {
    this.dom.classList.remove("ProseMirror-selectednode")
  }

  stopEvent() {
    return true;
  }

  destroy() {
    console.log('equation destroyed ')
  }
}
