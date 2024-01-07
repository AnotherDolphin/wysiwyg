import Image from "next/image"
import EditorPage from "./QuillEditor"
import DrawerNav from "./components/drawer"

export default function Home() {
  return (
      <div className="bg-white w-content flex flex-col flex-1">
        <h1>Your Page Title</h1>
        <EditorPage />
      </div>
  )
}
