"use client"
import dynamic from "next/dynamic"
import { useMemo } from "react"

export default function Author() {
  const DynamicTextEditor = useMemo(() => {
    return dynamic(() => import("@/app/QuillEditor"), {
      ssr: false,
    })
  }, [])
  return (
    <div className="bg-white w-content flex flex-col flex-1">
      <DynamicTextEditor />
    </div>
  )
}
