import { Quill } from "react-quill"

let Inline = Quill.import("blots/inline")

class LinkBlot extends Inline {
  static create(value: any) {
    let node = super.create()
    // Sanitize url value if desired
    node.setAttribute("href", value)
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute("target", "_blank")
    return node
  }

  static formats(node: any) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute("href")
  }
}
LinkBlot.blotName = "link"
LinkBlot.tagName = "a"

Quill.register(LinkBlot)

export default LinkBlot
