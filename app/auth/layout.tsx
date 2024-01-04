// next layoutout
//
import type { Metadata } from "next"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "Wikiwyg",
  description:
    "Author, Edit, and Publish your informational content with ease. Wikiwyg is a WYSIWYG editor for the web.",
}

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <div
        className={`w-[clamp(300px,80vw,1200px)] flex flex-col items-center m-auto p-10 gap-4`}
      >
        {/* <div className="flex"> */}
          <img src="/icon.png" className="rounded-lg" width={120}/>
          <div className="text-center mt-4">
            <h1 className="text-4xl font-bold">WikiWyg</h1>
            <h3 className="text-lg">Edit the Web Inform the world</h3>
          </div>
        {/* </div> */}
        {children}
      </div>
    </html>
  )
}
