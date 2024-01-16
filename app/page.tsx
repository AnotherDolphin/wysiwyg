import Image from "next/image"
import EditorPage from "./QuillEditor"
import DrawerNav from "./components/drawer"
import Link from "next/link"
import { Edit, LibraryBooks } from "@mui/icons-material"

export default function Home() {
  return (
    <div className="bg- w-content flex flex-col flex-1">
      <div className="flex flex-col md:flex-row flex-1 p-[8%] gap-[10vh]">
        <Link
          href="/articles/author"
          className="rounded-3xl shadow-xl bg-cyan-600 flex-1 flex flex-col cursor-pointer
        hover:bg-cyan-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <Edit className="text-white text-9xl m-auto" />
          <h2 className="text-white text-2xl md:text-4xl m-auto">
            Write & Publish
          </h2>
          <p className="text-gray-200 text-md md:text-lg m-auto">
            Edit the Web Inform the world
          </p>
        </Link>
        <Link
          href="/articles"
          className="rounded-3xl shadow-xl bg-cyan-600 flex-1 flex flex-col cursor-pointer
        hover:bg-cyan-700 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          <LibraryBooks className="text-white text-9xl m-auto" />
          <h2 className="text-white text-2xl md:text-4xl m-auto">
            Read & Edit
          </h2>
          <p className="text-gray-200 text-md md:text-lg m-auto">
            Read the Web Inform yourself
          </p>
        </Link>
      </div>
      <div className="self-center p-10 text-cyan-600">
        <Link href={"/guide"}>User guide</Link>
      </div>
    </div>
  )
}

// const HeroButton = {}
