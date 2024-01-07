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

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    return ({
      forwardedRef,
      ...props
    }: {
      forwardedRef: React.RefObject<any>
      [key: string]: any
    }) => <RQ ref={forwardedRef} {...props} />
  },
  {
    ssr: false,
  }
)

const EditorPage = () => {
  // const ReactQuill = useMemo(
  //   () => dynamic(() => import("react-quill"), { ssr: false }),
  //   []
  // )
  const [value, setValue] = useState("")
  const quillRef = React.useRef()

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
  }, [quillRef])

  const handleSave = async () => {
    try {
      // Send a POST request to the API route with the article content
      await fetch("/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      })

      // Optionally, you can redirect to the next route after saving
      // history.push("/next-route");
    } catch (error) {
      console.error("Error saving article:", error)
    }
  }

  return (
    <div>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
          ],
        }}
      />
      <button onClick={handleSave}>Save</button>
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
