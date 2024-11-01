/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node, Mark } from "prosemirror-model"

type MarkSerializerSpec = {
  open: string | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string),
  close: string | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string),
  mixable?: boolean,
  expelEnclosingWhitespace?: boolean,
  escape?: boolean
}

const blankMark: MarkSerializerSpec = { open: "", close: "", mixable: true }
export class MarkdownSerializer {
  constructor(
    readonly nodes: { [node: string]: (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void },
    readonly marks: { [mark: string]: MarkSerializerSpec },
    readonly options: {
      escapeExtraCharacters?: RegExp,
      hardBreakNodeName?: string,
      strict?: boolean
    } = {}
  ) { }

  serialize(content: Node, options: {
    tightLists?: boolean
  } = {}) {
    options = Object.assign({}, this.options, options)
    const state = new MarkdownSerializerState(this.nodes, this.marks, options)
    state.renderContent(content)
    return state.out
  }
}

export const defaultMarkdownSerializer = new MarkdownSerializer({
  blockquote(state, node) {
    state.wrapBlock("> ", null, node, () => state.renderContent(node))
  },
  code_block(state, node) {
    const backticks = node.textContent.match(/`{3,}/gm)
    const fence = backticks ? (backticks.sort().slice(-1)[0] + "`") : "```"

    state.write(fence + (node.attrs.params || "") + "\n")
    state.text(node.textContent, false)
    state.write("\n")
    state.write(fence)
    state.closeBlock(node)
  },
  heading(state, node) {
    state.write(state.repeat("#", node.attrs.level) + " ")
    state.renderInline(node, false)
    state.closeBlock(node)
  },
  horizontal_rule(state, node) {
    state.write(node.attrs.markup || "---")
    state.closeBlock(node)
  },
  bullet_list(state, node) {
    state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
  },
  ordered_list(state, node) {
    const start = node.attrs.order || 1
    const maxW = String(start + node.childCount - 1).length
    const space = state.repeat(" ", maxW + 2)
    state.renderList(node, space, i => {
      const nStr = String(start + i)
      return state.repeat(" ", maxW - nStr.length) + nStr + ". "
    })
  },
  list_item(state, node) {
    state.renderContent(node)
  },
  paragraph(state, node) {
    state.renderInline(node)
    state.closeBlock(node)
  },

  image(state, node) {
    state.write("![" + state.esc(node.attrs.alt || "") + "](" + node.attrs.src.replace(/[()]/g, "\\$&") +
      (node.attrs.title ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"' : "") + ")")
  },
  hard_break(state, node, parent, index) {
    for (let i = index + 1; i < parent.childCount; i++)
      if (parent.child(i).type != node.type) {
        state.write("\\\n")
        return
      }
  },
  text(state, node) {
    state.text(node.text!, !state.inAutolink)
  }
}, {
  em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
  strong: { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true },
  link: {
    open(state, mark, parent, index) {
      state.inAutolink = isPlainURL(mark, parent, index)
      return state.inAutolink ? "<" : "["
    },
    close(state, mark, parent, index) {
      const { inAutolink } = state
      state.inAutolink = undefined
      return inAutolink ? ">"
        : "](" + mark.attrs.href.replace(/[()"]/g, "\\$&") + (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") + ")"
    },
    mixable: true
  },
  code: {
    open(_state, _mark, parent, index) { return backticksFor(parent.child(index), -1) },
    close(_state, _mark, parent, index) { return backticksFor(parent.child(index - 1), 1) },
    escape: false
  }
})

function backticksFor(node: Node, side: number) {
  const ticks = /`+/g
  let m, len = 0
  m = m = ticks.exec(node.text!)
  if (node.isText) while (m) len = Math.max(len, m[0].length)
  let result = len > 0 && side > 0 ? " `" : "`"
  for (let i = 0; i < len; i++) result += "`"
  if (len > 0 && side < 0) result += " "
  return result
}

function isPlainURL(link: Mark, parent: Node, index: number) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false
  const content = parent.child(index)
  if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false
  return index == parent.childCount - 1 || !link.isInSet(parent.child(index + 1).marks)
}

export class MarkdownSerializerState {
  delim: string = ""
  out: string = ""
  closed: Node | null = null
  inAutolink: boolean | undefined = undefined
  atBlockStart: boolean = false
  inTightList: boolean = false

  constructor(
    readonly nodes: { [node: string]: (state: MarkdownSerializerState, node: Node, parent: Node, index: number) => void },
    readonly marks: { [mark: string]: MarkSerializerSpec },
    readonly options: { tightLists?: boolean, escapeExtraCharacters?: RegExp, hardBreakNodeName?: string, strict?: boolean }
  ) {
    if (typeof this.options.tightLists == "undefined")
      this.options.tightLists = false
    if (typeof this.options.hardBreakNodeName == "undefined")
      this.options.hardBreakNodeName = "hard_break"
  }

  flushClose(size: number = 2) {
    if (this.closed) {
      if (!this.atBlank()) this.out += "\n"
      if (size > 1) {
        let delimMin = this.delim
        const trim = /\s+$/.exec(delimMin)
        if (trim) delimMin = delimMin.slice(0, delimMin.length - trim[0].length)
        for (let i = 1; i < size; i++)
          this.out += delimMin + "\n"
      }
      this.closed = null
    }
  }

  getMark(name: string) {
    let info = this.marks[name]
    if (!info) {
      if (this.options.strict !== false)
        throw new Error(`Mark type \`${name}\` not supported by Markdown renderer`)
      info = blankMark
    }
    return info
  }

  wrapBlock(delim: string, firstDelim: string | null, node: Node, f: () => void) {
    const old = this.delim
    this.write(firstDelim != null ? firstDelim : delim)
    this.delim += delim
    f()
    this.delim = old
    this.closeBlock(node)
  }

  atBlank() {
    return /(^|\n)$/.test(this.out)
  }

  ensureNewLine() {
    if (!this.atBlank()) this.out += "\n"
  }

  write(content?: string) {
    this.flushClose()
    if (this.delim && this.atBlank())
      this.out += this.delim
    if (content) this.out += content
  }

  closeBlock(node: Node) {
    this.closed = node
  }

  text(text: string, escape = true) {
    const lines = text.split("\n")
    for (let i = 0; i < lines.length; i++) {
      this.write()

      if (!escape && lines[i][0] == "[" && /(^|[^\\])!$/.test(this.out))
        this.out = this.out.slice(0, this.out.length - 1) + "\\!"
      this.out += escape ? this.esc(lines[i], this.atBlockStart) : lines[i]
      if (i != lines.length - 1) this.out += "\n"
    }
  }

  render(node: Node, parent: Node, index: number) {
    if (this.nodes[node.type.name]) {
      this.nodes[node.type.name](this, node, parent, index)
    } else {
      if (this.options.strict !== false) {
        throw new Error("Token type `" + node.type.name + "` not supported by Markdown renderer")
      } else if (!node.type.isLeaf) {
        if (node.type.inlineContent) this.renderInline(node)
        else this.renderContent(node)
        if (node.isBlock) this.closeBlock(node)
      }
    }
  }

  renderContent(parent: Node) {
    parent.forEach((node, _, i) => this.render(node, parent, i))
  }

  renderInline(parent: Node, fromBlockStart = true) {
    this.atBlockStart = fromBlockStart
    const active: Mark[] = []

    let trailing = ""
    const progress = (node: Node | null, offset: number, index: number) => {
      let marks = node ? node.marks : []

      if (node && node.type.name === this.options.hardBreakNodeName)
        marks = marks.filter(m => {
          if (index + 1 == parent.childCount) return false
          const next = parent.child(index + 1)
          return m.isInSet(next.marks) && (!next.isText || /\S/.test(next.text!))
        })

      let leading = trailing
      trailing = ""
      if (node && node.isText && marks.some(mark => {
        const info = this.getMark(mark.type.name)
        return info && info.expelEnclosingWhitespace && !mark.isInSet(active)
      })) {
        const [_, lead, rest] = /^(\s*)(.*)$/m.exec(node.text!)!
        if (lead) {
          leading += lead
          node = rest ? (node as any).withText(rest) : null
          if (!node) marks = active
        }
      }
      if (node && node.isText && marks.some(mark => {
        const info = this.getMark(mark.type.name)
        return info && info.expelEnclosingWhitespace &&
          (index == parent.childCount - 1 || !mark.isInSet(parent.child(index + 1).marks))
      })) {
        const [_, rest, trail] = /^(.*?)(\s*)$/m.exec(node.text!)!
        if (trail) {
          trailing = trail
          node = rest ? (node as any).withText(rest) : null
          if (!node) marks = active
        }
      }
      const inner = marks.length ? marks[marks.length - 1] : null
      const noEsc = inner && this.getMark(inner.type.name).escape === false
      const len = marks.length - (noEsc ? 1 : 0)

      outer: for (let i = 0; i < len; i++) {
        const mark = marks[i]
        if (!this.getMark(mark.type.name).mixable) break
        for (let j = 0; j < active.length; j++) {
          const other = active[j]
          if (!this.getMark(other.type.name).mixable) break
          if (mark.eq(other)) {
            if (i > j)
              marks = marks.slice(0, j).concat(mark).concat(marks.slice(j, i)).concat(marks.slice(i + 1, len))
            else if (j > i)
              marks = marks.slice(0, i).concat(marks.slice(i + 1, j)).concat(mark).concat(marks.slice(j, len))
            continue outer
          }
        }
      }

      let keep = 0
      while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) ++keep

      while (keep < active.length)
        this.text(this.markString(active.pop()!, false, parent, index), false)

      if (leading) this.text(leading)

      if (node) {
        while (active.length < len) {
          const add = marks[active.length]
          active.push(add)
          this.text(this.markString(add, true, parent, index), false)
          this.atBlockStart = false
        }

        if (noEsc && node.isText)
          this.text(this.markString(inner!, true, parent, index) + node.text +
            this.markString(inner!, false, parent, index + 1), false)
        else
          this.render(node, parent, index)
        this.atBlockStart = false
      }

      // FIXME: If a non-text node writes something to the output for this
      // block, the end of output is also no longer at block start. But how
      // can we detect that?
      if (node?.isText && node.nodeSize > 0) {
        this.atBlockStart = false
      }
    }
    parent.forEach(progress)
    progress(null, 0, parent.childCount)
    this.atBlockStart = false
  }

  renderList(node: Node, delim: string, firstDelim: (index: number) => string) {
    if (this.closed && this.closed.type == node.type)
      this.flushClose(3)
    else if (this.inTightList)
      this.flushClose(1)

    const isTight = typeof node.attrs.tight != "undefined" ? node.attrs.tight : this.options.tightLists
    const prevTight = this.inTightList
    this.inTightList = isTight
    node.forEach((child, _, i) => {
      if (i && isTight) this.flushClose(1)
      this.wrapBlock(delim, firstDelim(i), node, () => this.render(child, node, i))
    })
    this.inTightList = prevTight
  }

  esc(str: string, startOfLine = false) {
    str = str.replace(
      /[`*\\~[]_]/g,
      (m, i) => m == "_" && i > 0 && i + 1 < str.length && str[i - 1].match(/\w/) && str[i + 1].match(/\w/) ? m : "\\" + m
    )
    if (startOfLine) str = str.replace(/^(\+[ ]|[-*>])/, "\\$&").replace(/^(\s*)(#{1,6})(\s|$)/, '$1\\$2$3').replace(/^(\s*\d+)\.\s/, "$1\\. ")
    if (this.options.escapeExtraCharacters) str = str.replace(this.options.escapeExtraCharacters, "\\$&")
    return str
  }

  quote(str: string) {
    const wrap = str.indexOf('"') == -1 ? '""' : str.indexOf("'") == -1 ? "''" : "()"
    return wrap[0] + str + wrap[1]
  }

  repeat(str: string, n: number) {
    let out = ""
    for (let i = 0; i < n; i++) out += str
    return out
  }

  markString(mark: Mark, open: boolean, parent: Node, index: number) {
    const info = this.getMark(mark.type.name)
    const value = open ? info.open : info.close
    return typeof value == "string" ? value : value(this, mark, parent, index)
  }
  getEnclosingWhitespace(text: string): { leading?: string, trailing?: string } {
    return {
      leading: (text.match(/^(\s+)/) || [undefined])[0],
      trailing: (text.match(/(\s+)$/) || [undefined])[0]
    }
  }
}
