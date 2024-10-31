/* eslint-disable @typescript-eslint/no-explicit-any */
export default function crelt(elt: any, next: any, ...rest: any[]) {

  if (typeof elt == "string") elt = document.createElement(elt)
  let i = 1
  if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
    for (const name in next) if (Object.prototype.hasOwnProperty.call(next, name)) {
      const value = next[name]
      if (typeof value == "string") elt.setAttribute(name, value)
      else if (value != null) elt[name] = value
    }
    i++
  }
  for (; i < arguments.length; i++) add(elt, rest)
  return elt
}

function add(elt: any, child: any) {
  if (typeof child == "string") {
    elt.appendChild(document.createTextNode(child))
  } else if (child == null) { /* empty */ } else if (child.nodeType != null) {
    elt.appendChild(child)
  } else if (Array.isArray(child)) {
    for (let i = 0; i < child.length; i++) add(elt, child[i])
  } else {
    throw new RangeError("Unsupported child node: " + child)
  }
}
