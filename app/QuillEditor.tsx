"use client"

import "quill/dist/quill.snow.css"
import "react-quill/dist/quill.bubble.css"
import { revalidatePath } from "next/cache"

import React, {
  useState,
  useMemo,
  forwardRef,
  useEffect,
  MutableRefObject,
  useRef,
  useCallback,
} from "react"
import dynamic from "next/dynamic"
import { usePathname, useRouter } from "next/navigation"
import { ReactQuillProps } from "react-quill"
import ReactQuill, { Quill } from "react-quill"
import { Button, Icon, TextField } from "@mui/material"
import { StringMap } from "quill"
import { LinkBlot, SuperBlot } from "./utils/link-bolt"
import { MenuBook, Edit, Publish, History, Book } from "@mui/icons-material"
import Footnotes from "./components/article/footnotes"
import { IArticle, IArticleWithHistory } from "./articles/page"
import revalidateArticles from "./utils/server-actions"
import HistoryButton from "./components/history-button"
import { toast } from "react-toastify"

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
      cite: () => {}, // Assign the handler for the 'cite' button
    },
  },
}

const EditorPage = ({ article }: { article?: IArticleWithHistory }) => {
  console.log(article)

  const router = useRouter()
  // router.replace('/',)
  // const router.
  const [readOnly, setReadOnly] = useState(true)
  const [value, setValue] = useState(article ? article.content : "")
  const quillRef = useRef<ReactQuill>()
  const [footnotes, setFootnotes] = useState<{ index: number; link: string }[]>(
    article?.references ?? []
  )
  const footnotesRef = useRef(footnotes)
  footnotesRef.current = footnotes

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token && !readOnly) {
      toast.error("Account is required to become an editor", {
        className: "bg-cyan-700",
        toastId: "login",
        style: { color: "white" },
      })
      router.push("/auth/login")
    }
  }, [readOnly])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (!article && value == "") setReadOnly(false)
    if (article) setFootnotes(article.references)
    const check = () => {
      if (quillRef.current) {
        const editorEl = quillRef.current.getEditor().root
        quillRef.current
          .getEditor()
          .on("text-change", function (x, __, source) {
            if (source !== "user") return
            editorEl
              .querySelectorAll(`[href="undefined"], [id="undefined"]`)
              ?.forEach((el) => {
                el.remove()
              })
          })

        // handle superscript deletion to remove the footnote
        editorEl.addEventListener("blot-unmounted", (e: CustomEventInit) => {
          const index = parseInt(e.detail.attributes.domNode.id.split("-")[1])
          handleDeleteSuperscript(index)
        })

        editorEl.addEventListener("blot-mounted", (e: CustomEventInit) => {
          const refNode = e.detail.attributes.domNode

          const index = parseInt(refNode.id.split("-")[1])
          const footnoteLink = refNode.href
          const refUrl = refNode.getAttribute("refurl")
          if (!index && !footnoteLink) return

          const updatedFootnotes = [
            ...footnotesRef.current,
            { index, link: refUrl },
          ].sort((a, b) => a.index - b.index)
          setFootnotes(updatedFootnotes)
        })
        modules.toolbar.handlers.cite = handleCite.bind(quillRef.current)
        return clearTimeout(timeoutId)
      }
      modules.toolbar.handlers.cite = handleCite.bind(quillRef)
      timeoutId = setTimeout(check, 200)
    }
    check()
    return () => clearTimeout(timeoutId)
  }, [quillRef, readOnly, quillRef.current, readOnly])

  const handleSave = async () => {
    try {
      // Send a POST request to the API route with the article content
      const token = localStorage.getItem("token")
      console.log(footnotesRef.current, footnotes)
      await fetch("/api/articles", {
        method: article ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...(article && { id: article._id }),
          content: value,

          references: footnotesRef.current.map((footnote) => {
            return {
              index: footnote.index,
              link: footnote.link,
            }
          }),
        }),
      })

      // Invalidate the cache
      revalidateArticles()
      // go back to the articles page
      router.push("/articles")

      // Optionally, you can redirect to the next route after saving
      // history.push("/next-route");
    } catch (error) {
      console.error("Error saving article:", error)
    }
  }

  const onChange = (value: string) => {
    setValue(value)
  }

  const handleDeleteSuperscript = (index: number) => {
    setFootnotes((prevFootnotes) =>
      prevFootnotes.filter((x) => x.index !== index)
    )
  }

  const handleDeleteFootnote = (index: number) => {
    setFootnotes((prevFootnotes) => {
      const updatedFootnotes = prevFootnotes.filter((x) => x.index !== index)
      const editor = quillRef.current?.getEditor()
      editor?.root?.querySelector(`#supertext-${index}`)?.remove()
      return updatedFootnotes
    })
  }

  const handleCite = () => {
    const lastPosition = quillRef?.current?.getEditor()?.getLength() || 0 // Get cursor position
    const selection = quillRef?.current?.getEditor()?.getSelection()?.index // Get cursor position

    const cursorPosition = selection ? selection + 1 : lastPosition

    const footnoteLink = prompt("Enter footnote source link:")
    if (!footnoteLink) return
    const sourceIndex =
      footnotesRef.current.reduce((max, footnote) => {
        return footnote.index > max ? footnote.index : max
      }, 0) + 1
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
      refurl: footnoteLink,
    })

    editor?.insertText(cursorPosition + 2, " ")
    editor?.formatText(cursorPosition + 2, 1, "ref-super", false)
    editor?.formatText(cursorPosition + 2, 1, "ref-link", false)
  }

  return (
    <div>
      <div className="flex flex-col flex-1 min-h-[80vh]">
        <div className="flex w-full items-center justify-end bg-gray-100 outline-slate-600">
          <div className="bg-gray-200 rounded-t-lg overflow-hidden border border-gray-300 border-b-0 flex flex-nowrap">
            <Button
              className={`rounded-none px-4 ${
                readOnly ? "bg-white text-black" : "text-gray-500"
              }`}
              style={{ textTransform: "none" }}
              variant="text"
              onClick={() => setReadOnly(true)}
              startIcon={<MenuBook />}
            >
              {article ? "Read" : "Preview"}
            </Button>
            <Button
              className={`rounded-none px-4 ${
                readOnly ? "text-gray-500" : "bg-white text-black"
              }`}
              style={{ textTransform: "none" }}
              onClick={() => setReadOnly(false)}
              startIcon={<Edit />}
            >
              {article ? "Edit" : "Write"}
            </Button>
          </div>
          <div className="flex-1"></div>
          {article && <HistoryButton {...article} />}{" "}
          <div className="flex-1 md:flex-none md:w-8"></div>
          <Button
            onClick={handleSave}
            variant="outlined"
            className="bg-cyan-600 text-white hover:bg-cyan-700 hover:translate-y-1 transition duration-200 ease-in-out"
            startIcon={<Publish />}
            style={{ textTransform: "none" }}
          >
            {article ? "Save" : "Publish"}
          </Button>
        </div>
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
      </div>
      <Footnotes
        footnotes={footnotes}
        onDelete={readOnly ? undefined : handleDeleteFootnote}
      />
    </div>
  )
}

export default EditorPage
