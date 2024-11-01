/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownIt from "markdown-it"
import Token from "markdown-it/lib/token.mjs"
import { schema } from "./prose-markdown-schema"
import { Mark, MarkType, Node, Attrs, Schema, NodeType } from "prosemirror-model"

interface MarkdownStack {
  type: NodeType,
  attrs: Attrs | null,
  content: Node[],
  marks: readonly Mark[]
}

interface TokenHandler {
  [token: string]: (stat: MarkdownParseState, token: Token, tokens: Token[], i: number) => void
}

function maybeMerge(a: Node, b: Node): Node | undefined {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks))
    return (a as any).withText(a.text! + b.text!)
}

class MarkdownParseState {
  stack: MarkdownStack[]

  constructor(
    readonly schema: Schema,
    readonly tokenHandlers: TokenHandler
  ) {
    this.stack = [{
      type: schema.topNodeType,
      attrs: null,
      content: [],
      marks: Mark.none
    }]
  }

  top() {
    return this.stack[this.stack.length - 1]
  }

  push(elt: Node) {
    if (this.stack.length) this.top().content.push(elt)
  }

  addText(text: string) {
    if (!text) return
    const top = this.top(), nodes = top.content, last = nodes[nodes.length - 1]
    const node = this.schema.text(text, top.marks)
    let merged
    if (last && (merged = maybeMerge(last, node))) nodes[nodes.length - 1] = merged
    else nodes.push(node)
  }

  openMark(mark: Mark) {
    const top = this.top()
    top.marks = mark.addToSet(top.marks)
  }

  closeMark(mark: MarkType) {
    const top = this.top()
    top.marks = mark.removeFromSet(top.marks)
  }

  parseTokens(toks: Token[]) {
    for (let i = 0; i < toks.length; i++) {
      const tok = toks[i]
      const handler = this.tokenHandlers[tok.type]
      if (!handler)
        throw new Error("Token type `" + tok.type + "` not supported by Markdown parser")
      handler(this, tok, toks, i)
    }
  }

  addNode(type: NodeType, attrs: Attrs | null, content?: readonly Node[]) {
    const top = this.top()
    const node = type.createAndFill(attrs, content, top ? top.marks : [])
    if (!node) return null
    this.push(node)
    return node
  }

  openNode(type: NodeType, attrs: Attrs | null) {
    this.stack.push({ type: type, attrs: attrs, content: [], marks: Mark.none })
  }

  closeNode() {
    const info = this.stack.pop()!
    return this.addNode(info.type, info.attrs, info.content)
  }
}

function attrs(spec: ParseSpec, token: Token, tokens: Token[], i: number) {
  if (spec.getAttrs) return spec.getAttrs(token, tokens, i)

  else if (spec.attrs instanceof Function) return spec.attrs(token)
  else return spec.attrs
}

function noCloseToken(spec: ParseSpec, type: string) {
  return spec.noCloseToken || type == "code_inline" || type == "code_block" || type == "fence"
}

function withoutTrailingNewline(str: string) {
  return str[str.length - 1] == "\n" ? str.slice(0, str.length - 1) : str
}

function noOp() { }

function tokenHandlers(schema: Schema, tokens: { [token: string]: ParseSpec }) {
  const handlers: TokenHandler =
    Object.create(null)
  for (const type in tokens) {
    const spec = tokens[type]
    if (spec.block) {
      const nodeType = (schema as any).nodeType(spec.block)
      if (noCloseToken(spec, type)) {
        handlers[type] = (state, tok, tokens, i) => {
          state.openNode(nodeType, attrs(spec, tok, tokens, i))
          state.addText(withoutTrailingNewline(tok.content))
          state.closeNode()
        }
      } else {
        handlers[type + "_open"] = (state, tok, tokens, i) => state.openNode(nodeType, attrs(spec, tok, tokens, i))
        handlers[type + "_close"] = state => state.closeNode()
      }
    } else if (spec.node) {
      const nodeType = (schema as any).nodeType(spec.node)
      handlers[type] = (state, tok, tokens, i) => state.addNode(nodeType, attrs(spec, tok, tokens, i))
    } else if (spec.mark) {
      const markType = schema.marks[spec.mark]
      if (noCloseToken(spec, type)) {
        handlers[type] = (state, tok, tokens, i) => {
          state.openMark(markType.create(attrs(spec, tok, tokens, i)))
          state.addText(withoutTrailingNewline(tok.content))
          state.closeMark(markType)
        }
      } else {
        handlers[type + "_open"] = (state, tok, tokens, i) => state.openMark(markType.create(attrs(spec, tok, tokens, i)))
        handlers[type + "_close"] = state => state.closeMark(markType)
      }
    } else if (spec.ignore) {
      if (noCloseToken(spec, type)) {
        handlers[type] = noOp
      } else {
        handlers[type + "_open"] = noOp
        handlers[type + "_close"] = noOp
      }
    } else {
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(spec))
    }
  }

  handlers.text = (state, tok) => state.addText(tok.content)
  handlers.inline = (state, tok) => state.parseTokens(tok.children!)
  handlers.softbreak = handlers.softbreak || (state => state.addText(" "))

  return handlers
}

export interface ParseSpec {
  node?: string
  block?: string
  mark?: string
  attrs?: Attrs | null
  getAttrs?: (token: Token, tokenStream: Token[], index: number) => Attrs | null
  noCloseToken?: boolean
  ignore?: boolean
}

export class MarkdownParser {
  tokenHandlers: { [token: string]: (stat: MarkdownParseState, token: Token, tokens: Token[], i: number) => void }

  constructor(
    readonly schema: Schema,
    readonly tokenizer: MarkdownIt,
    readonly tokens: { [name: string]: ParseSpec }
  ) {
    this.tokenHandlers = tokenHandlers(schema, tokens)
  }

  parse(text: string, markdownEnv: any) {
    const state = new MarkdownParseState(this.schema, this.tokenHandlers)
    let doc
    state.parseTokens(this.tokenizer.parse(text, markdownEnv))
    do { doc = state.closeNode() } while (state.stack.length)
    return doc || this.schema.topNodeType.createAndFill()!
  }
}

function listIsTight(tokens: readonly Token[], i: number) {
  while (++i < tokens.length)
    if (tokens[i].type != "list_item_open") return tokens[i].hidden
  return false
}

export const defaultMarkdownParser = new MarkdownParser(schema, MarkdownIt("commonmark", { html: false }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) }) },
  ordered_list: {
    block: "ordered_list", getAttrs: (tok, tokens, i) => ({
      order: +tok.attrGet("start")! || 1,
      tight: listIsTight(tokens, i)
    })
  },
  heading: { block: "heading", getAttrs: tok => ({ level: +tok.tag.slice(1) }) },
  code_block: { block: "code_block", noCloseToken: true },
  fence: { block: "code_block", getAttrs: tok => ({ params: tok.info || "" }), noCloseToken: true },
  hr: { node: "horizontal_rule" },
  image: {
    node: "image", getAttrs: tok => ({
      src: tok.attrGet("src"),
      title: tok.attrGet("title") || null,
      alt: tok.children![0] && tok.children![0].content || null
    })
  },
  hardbreak: { node: "hard_break" },

  em: { mark: "em" },
  strong: { mark: "strong" },
  link: {
    mark: "link", getAttrs: tok => ({
      href: tok.attrGet("href"),
      title: tok.attrGet("title") || null
    })
  },
  code_inline: { mark: "code", noCloseToken: true }
})
