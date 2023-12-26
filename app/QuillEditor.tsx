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

  const handleSave = async () => {
    try {
      // Send a POST request to the API route with the article content
      await fetch("/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      });

      // Optionally, you can redirect to the next route after saving
      // history.push("/next-route");
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} modules={
        {
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
        }
      } />
            <button onClick={handleSave}>Save</button>

    </div>
  )
}

export default QuillEditor
