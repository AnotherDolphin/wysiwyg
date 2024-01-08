import {Quill} from "react-quill"

let Inline = Quill.import("blots/inline")
let Parchment = Quill.import("parchment")



class SupertextBlot extends Inline {}
SupertextBlot.blotName = "super"
SupertextBlot.tagName = "sup"
// SupertextBlot.scope = Parchment.Scope.INLINE


export { SupertextBlot }
