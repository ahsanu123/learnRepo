import { Schema, NodeSpec, MarkSpec, DOMOutputSpec } from "prosemirror-model"

type NodeSpecKey =
  'doc'
  | 'paragraph'
  | 'blockquote'
  | 'horizontal_rule'
  | 'heading'
  | 'code_block'
  | 'text'
  | 'image'
  | 'hard_break'
  | 'ordered_list'
  | 'bullet_list'
  | 'list_item'
  ;

type MarkSpecKey =
  'link'
  | 'em'
  | 'strong'
  | 'code'
  ;

type KeyedNodeSpec = Record<NodeSpecKey, NodeSpec>;
type KeyedMarkSpec = Record<MarkSpecKey, MarkSpec>;

const pDOM: DOMOutputSpec = ["p", 0],
  blockquoteDOM: DOMOutputSpec = ["blockquote", 0],
  hrDOM: DOMOutputSpec = ["hr"],
  preDOM: DOMOutputSpec = ["pre", ["code", 0]],
  brDOM: DOMOutputSpec = ["br"]

const emDOM: DOMOutputSpec = ["em", 0],
  strongDOM: DOMOutputSpec = ["strong", 0],
  codeDOM: DOMOutputSpec = ["code", 0]

const olDOM: DOMOutputSpec = ["ol", 0],
  ulDOM: DOMOutputSpec = ["ul", 0],
  liDOM: DOMOutputSpec = ["li", 0]

export const nodes: KeyedNodeSpec = {
  doc: {
    content: "block+"
  },

  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM() { return pDOM; }
  },

  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "blockquote" }],
    toDOM() { return blockquoteDOM; }
  },

  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM() { return hrDOM; }
  },

  heading: {
    attrs: { level: { default: 1, validate: "number" } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "h1", attrs: { level: 1 } },
    { tag: "h2", attrs: { level: 2 } },
    { tag: "h3", attrs: { level: 3 } },
    { tag: "h4", attrs: { level: 4 } },
    { tag: "h5", attrs: { level: 5 } },
    { tag: "h6", attrs: { level: 6 } }],
    toDOM(node) { return ["h" + node.attrs.level, 0]; }
  },

  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
    toDOM() { return preDOM; }
  },

  text: {
    group: "inline"
  },

  image: {
    inline: true,
    attrs: {
      src: { validate: "string" },
      alt: { default: null, validate: "string|null" },
      title: { default: null, validate: "string|null" }
    },
    group: "inline",
    draggable: true,
    parseDOM: [{
      tag: "img[src]", getAttrs(dom: HTMLElement) {
        return {
          src: dom.getAttribute("src"),
          title: dom.getAttribute("title"),
          alt: dom.getAttribute("alt")
        };
      }
    }],
    toDOM(node) {
      const { src, alt, title } = node.attrs;
      return ["img", { src, alt, title }];
    }
  },

  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() { return brDOM; }
  },

  ordered_list: {
    attrs: { order: { default: 1, validate: "number" } },
    content: "list_item+",
    group: "paragraph block*",
    parseDOM: [{
      tag: "ol", getAttrs(dom: HTMLElement) {
        return { order: dom.hasAttribute("start") ? +dom.getAttribute("start")! : 1 }
      }
    }],
    toDOM(node) {
      return node.attrs.order == 1 ? olDOM : ["ol", { start: node.attrs.order }, 0]
    }
  },
  bullet_list: {
    content: "list_item+",
    group: "paragraph block*",
    parseDOM: [{ tag: "ul" }],
    toDOM() { return ulDOM }
  },
  list_item: {
    parseDOM: [{ tag: "li" }],
    toDOM() { return liDOM },
    defining: true,
    content: 'block'
  }
};


export const marks: KeyedMarkSpec = {
  link: {
    attrs: {
      href: { validate: "string" },
      title: { default: null, validate: "string|null" }
    },
    inclusive: false,
    parseDOM: [{
      tag: "a[href]", getAttrs(dom: HTMLElement) {
        return { href: dom.getAttribute("href"), title: dom.getAttribute("title") }
      }
    }],
    toDOM(node) { const { href, title } = node.attrs; return ["a", { href, title }, 0] }
  },

  em: {
    parseDOM: [
      { tag: "i" }, { tag: "em" },
      { style: "font-style=italic" },
      { style: "font-style=normal", clearMark: m => m.type.name == "em" }
    ],
    toDOM() { return emDOM }
  },

  strong: {
    parseDOM: [
      { tag: "strong" },
      { tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null },
      { style: "font-weight=400", clearMark: m => m.type.name == "strong" },
      { style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
    ],
    toDOM() { return strongDOM }
  },

  code: {
    parseDOM: [{ tag: "code" }],
    toDOM() { return codeDOM }
  },
}

export const schema = new Schema({
  nodes,
  marks
}) 
