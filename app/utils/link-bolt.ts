import { Quill } from "react-quill"

let Inline = Quill.import("blots/inline")

interface Params {
  href: string
}

class LinkBlot extends Inline {
  static create(value: Params) {
    let node = super.create() as HTMLElement 
    console.log("value", value)
    node.contentEditable = "false"

    // Sanitize url value if desired
    node.setAttribute("href", value.href)
    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    // node.setAttribute("target", "_blank")
    node.classList.add("footnote-link")
    
    // delete node
    // node.addEventListener("click", () => {
    //   console.log("clicked")
    //   node.remove()
    // })

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

export default LinkBlot
