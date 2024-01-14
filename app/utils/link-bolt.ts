import { Quill } from "react-quill"

let Inline = Quill.import("blots/inline")
let Embed = Quill.import("blots/embed")

interface Params {
  href: string
  id: string
  refurl: string
}

class LinkBlot extends Inline {
  static create(value: Params) {
    let node = super.create() as HTMLElement
    node.contentEditable = "false"
    node.id = value.id

    // Sanitize url value if desired
    node.setAttribute("href", value.href)
    node.setAttribute("refurl", value.refurl)
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

  attach() {
    super.attach();
    if (!this.mounted) {
      this.mounted = true;
      this.scroll.domNode.dispatchEvent(new CustomEvent('blot-mounted', {
      bubbles: true,
      detail: this
    }))
    }
  }
  
  detach() {
    // console.log("detached");
    this.mounted = false;
    this.scroll.domNode.dispatchEvent(new CustomEvent('blot-unmounted', {
      bubbles: true,
      detail: this
    }))
    super.detach()
  }

  static formats(node: HTMLElement) {
    // console.log('formats', node);
    
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return {
      href: node.getAttribute("href"),
      id: node.id,
      refurl: node.getAttribute("refurl"),
    }
  }

  onDOMRemove() {
    console.log("removed")
  }

  onDelete() {
    console.log("deleted")
  }

  // deleteAt(index: number, length: number) {
  //   console.log("deleteAt", index, length)
  // }
}
LinkBlot.blotName = "ref-link"
LinkBlot.tagName = "a"

export default LinkBlot
