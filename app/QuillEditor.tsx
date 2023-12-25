"use client"

import "quill/dist/quill.snow.css"

import React, { useState, useMemo } from "react"
import dynamic from "next/dynamic"

const QuillEditor = () => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  )
  const [value, setValue] = useState("")

  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  )
}

export default QuillEditor
