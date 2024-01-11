"use client"

import "quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"

import React, {
  useState,
  useMemo,
  forwardRef,
  useEffect,
  MutableRefObject,
  useRef,
} from "react"
import dynamic from "next/dynamic"
import { ReactQuillProps } from "react-quill"
import ReactQuill, { Quill } from "react-quill"
import { Button, TextField } from "@mui/material"
import { StringMap } from "quill"
import LinkBlot from "./utils/link-bolt"
import MenuBook from "@mui/icons-material/MenuBook"
import Footnotes from "./components/article/footnotes"
import { Article } from "./articles/page"

let Inline = Quill.import("blots/inline")
class SuperBlot extends Inline {}
SuperBlot.blotName = "ref-super"
SuperBlot.tagName = "sup"
Quill.register("formats/ref-super", SuperBlot)
Quill.register("formats/ref-link", LinkBlot)

const defaultQuillFormats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "cite",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "super",
  "header",
  "align",
]

type SpecificQuillProps = {
  [K in keyof ReactQuillProps]: ReactQuillProps[K]
}

interface QuillEditorProps extends SpecificQuillProps {
  forwardedRef: MutableRefObject<any>
}

const DynamicRQ = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    return ({ forwardedRef, ...props }: QuillEditorProps) => {
      return <RQ ref={forwardedRef} {...props} />
    }
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
      window.innerWidth < 768
        ? [{ align: [] }]
        : [
            { align: "" },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
          ], // ["clean"],
    ],
    handlers: {
      cite: () => console.log("cite"), // Assign the handler for the 'cite' button
    },
  },
}

const EditorPage = ({ article }: { article?: Article }) => {
  const [readOnly, setReadOnly] = useState(article ? true : false)
  const [value, setValue] = useState(article?.content ?? "")
  const quillRef = useRef<ReactQuill>()
  const [title, setTitle] = useState("")
  const [footnotes, setFootnotes] = useState<{ index: number; link: string }[]>(
    []
  )
  const footnotesRef = useRef(footnotes)
  footnotesRef.current = footnotes

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
      const token = localStorage.getItem("token")
      await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    console.log(value)
    setValue(value)
  }

  const handleDeleteFootnote = (index: number) => {
    setFootnotes((prevFootnotes) => {
      const updatedFootnotes = prevFootnotes.filter((_, i) => i !== index)

      // Get the Quill editor instance
      const editor = quillRef.current?.getEditor()

      // Get the contents of the editor
      const contents = editor?.getContents()

      // Find the superscript text
      // const superscriptId = `supertext-${index + 1}`
      const superscriptDelta = contents?.ops?.find((op) =>
        op.insert?.includes(`[${index + 1}]`)
      )

      // If the superscript text was found, remove it
      if (superscriptDelta) {
        const superscriptIndex = contents?.ops?.indexOf(superscriptDelta)
        editor?.deleteText(superscriptIndex ?? 0, 3) // Delete the superscript text
      }

      return updatedFootnotes
    })
  }

  const handleCite = () => {
    const cursorPosition = quillRef?.current?.getEditor()?.getLength() || 0 // Get cursor position

    const footnoteLink = prompt("Enter footnote source link:")
    if (!footnoteLink) return
    const sourceIndex = footnotesRef.current.length + 1 // Generate source index
    const updatedFootnotes = [
      ...footnotesRef.current,
      { index: sourceIndex, link: footnoteLink },
    ]
    setFootnotes(updatedFootnotes)

    let editor = quillRef.current?.getEditor()

    editor?.insertText(cursorPosition - 1, `[${sourceIndex.toString()}]`) // Insert the marker and text

    editor?.formatText(cursorPosition - 1, 3, "ref-super", true)
    editor?.formatText(cursorPosition - 1, 3, "ref-link", {
      href: `#footnote-${sourceIndex}`,
      id: `supertext-${sourceIndex}`,
    })

    editor?.insertText(cursorPosition + 2, " ")
    editor?.formatText(cursorPosition + 2, 1, "ref-super", false)
    editor?.formatText(cursorPosition + 2, 1, "ref-link", false)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex w-full items-center justify-end mb-2">
        <Button
          className={`transition-colors ${
            readOnly ? "bg-cyan-600 text-white" : "text-cyan-600"
          }`}
          onClick={() => setReadOnly(true)}
        >
          Read
        </Button>
        <Button
          className={`transition-colors ${
            readOnly ? "text-cyan-600" : "bg-cyan-600 text-white"
          }`}
          onClick={() => setReadOnly(false)}
        >
          Edit
        </Button>
      </div>
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
        key={readOnly ? "readOnly" : "editable"}
        forwardedRef={quillRef}
        className="flex flex-col flex-1"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={[...defaultQuillFormats, "ref-super", "ref-link"]}
        readOnly={readOnly}
        theme={readOnly ? "bubble" : "snow"}
      />
      <button onClick={handleSave}>Save</button>
      <Footnotes footnotes={footnotes} onDelete={handleDeleteFootnote} />{" "}
    </div>
  )
}

export default EditorPage
