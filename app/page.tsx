import Image from "next/image"
import QuillEditor from "./QuillEditor"
import DrawerNav from "./components/drawer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-red-200 items-center justify-between p-24">
      <div className="bg-blue-200 w-full">
        <h1>Your Page Title</h1>
        <QuillEditor />
      </div>
    </main>
  )
}
