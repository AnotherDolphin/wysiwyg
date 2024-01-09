"use client"

import "quill/dist/quill.snow.css"

import React, {
  useState,
  useMemo,
  forwardRef,
  useEffect,
  MutableRefObject,
} from "react"
import dynamic from "next/dynamic"
import { ReactQuillProps } from "react-quill"
import ReactQuill, { Quill } from "react-quill"
import { TextField } from "@mui/material"
import { StringMap } from "quill"
import LinkBlot from "./utils/link-bolt"
import MenuBook from "@mui/icons-material/MenuBook"

let Inline = Quill.import("blots/inline")
class SuperBlot extends Inline {}
SuperBlot.blotName = "super"
SuperBlot.tagName = "sup"
Quill.register("formats/super", SuperBlot)
Quill.register("formats/link", LinkBlot)

type SpecificQuillProps = {
  [K in keyof ReactQuillProps]: ReactQuillProps[K]
}

interface QuillEditorProps extends SpecificQuillProps {
  forwardedRef: MutableRefObject<any>
}

const DynamicRQ = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    return ({ forwardedRef, ...props }: QuillEditorProps) => (
      <RQ ref={forwardedRef} {...props} />
    )
  },
  {
    ssr: false,
  }
)

const modules: StringMap = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "cite"], // Include the 'cite' button
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      // ["clean"],
    ],
    handlers: {
      cite: () => console.log("cite"), // Assign the handler for the 'cite' button
    },
  },
}

const EditorPage = () => {
  const [value, setValue] = useState("")
  const quillRef = React.useRef<ReactQuill>()
  const [title, setTitle] = useState("")
  const [footnotes, setFootnotes] = useState<{ index: number; link: string }[]>(
    []
  )

  useEffect(() => {
    const init = (quill: Object) => {
      console.log(quill)
    }
    const check = () => {
      if (quillRef.current) {
        init(quillRef.current)
        return
      }
      setTimeout(check, 200)
    }
    check()
    modules.toolbar.handlers.cite = handleCite
  }, [quillRef])

  const handleSave = async () => {
    try {
      // Send a POST request to the API route with the article content
      await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value, title }),
      })

      // Optionally, you can redirect to the next route after saving
      // history.push("/next-route");
    } catch (error) {
      console.error("Error saving article:", error)
    }
  }

  const onChange = (value: string) => {
    setValue(value)
  }

  console.log(value)

  const handleCite = () => {
    // Logic to insert footnote/citation marker and text at the cursor position
    const cursorPosition = quillRef?.current?.getEditor()?.getLength() || 0 // Get cursor position

    const footnoteLink = prompt("Enter footnote source link:")
    if (!footnoteLink) return
    const sourceIndex = footnotes.length + 1 // Generate source index
    const updatedFootnotes = [
      ...footnotes,
      { index: sourceIndex, link: footnoteLink },
    ]
    setFootnotes(updatedFootnotes)

    let editor = quillRef.current?.getEditor()

    editor?.insertText(cursorPosition - 1, `[${sourceIndex.toString()}]`) // Insert the marker and text

    editor?.formatText(cursorPosition - 1, 3, "super", true)
    editor?.formatText(cursorPosition - 1, 3, "link", {
      href: `#footnote-${sourceIndex}`,
    })

    editor?.insertText(cursorPosition + 2, " ")
    editor?.formatText(cursorPosition + 2, 1, "super", false)
    editor?.formatText(cursorPosition + 2, 1, "link", false)
  }
  modules.toolbar.handlers.cite = handleCite

  return (
    <div className="flex flex-col flex-1">
      <TextField
        type="text"
        name="title"
        id="title"
        label="Title"
        style={{ color: "white" }}
        onChange={(e) => setTitle(e.target.value)}
        sx={{
          "& .MuiInputBase-root": {
            color: "#111",
            fontSize: "2rem",
            // fontWeight: "semibold",
            padding: "0.5rem",
          },
          // larger label
          "& .MuiInputLabel-root": {
            fontSize: "2rem",
          },
          "& label.Mui-focused": {
            color: "green",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "green",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "none",
            },
            "&:hover fieldset": {
              borderColor: "yellow",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
            },
          },
        }}
        // className="text-2xl font-bold border-0 active:border-0 focus:border-0"
      />

      <DynamicRQ
        forwardedRef={quillRef}
        className="flex flex-col flex-1"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={["super", "link"]}
      />
      <button onClick={handleSave}>Save</button>
      <div className="flex flex-col my-2 p-2">
        <div className="flex items-center gap-2">
          <MenuBook /> <h1 className="text-lg">References</h1>
        </div>
        {footnotes.map((footnote) => (
          <div id={`footnote-${footnote.index}`}>
            [{footnote.index}]{" "}
            <a className="text-blue-700" href={footnote.link}>
              {" "}
              {footnote.link}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// const QuillEditor = forwardRef(
//   (
//     props: {
//       value: string
//       setValue: (value: string) => void
//     },
//     ref
//   ) => {
//     const ReactQuill = useMemo(
//       () => dynamic(() => import("react-quill"), { ssr: false }),
//       []
//     )
//     const { value, setValue } = props
//     const handleCite = () => {
//       // Logic to insert footnote/citation marker and text at the cursor position
//       const cursorPosition = quillRef?.getEditor()?.getLength() || 0 // Get cursor position
//       quillRef
//         ?.getEditor()
//         ?.insertText(cursorPosition, "[^1] Your footnote text here") // Insert the marker and text
//     }

//     return (
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={setValue}
//         ref={ref}
//         modules={{
//           toolbar: {
//             container: [
//               [{ header: [1, 2, false] }],
//               ["bold", "italic", "underline", "strike", "blockquote", "cite"], // Include the 'cite' button
//               [
//                 { list: "ordered" },
//                 { list: "bullet" },
//                 { indent: "-1" },
//                 { indent: "+1" },
//               ],
//               ["link", "image"],
//               ["clean"],
//             ],
//             handlers: {
//               cite: handleCite, // Assign the handler for the 'cite' button
//             },
//           },
//         }}
//       />
//     )
//   }
// )

export default EditorPage
