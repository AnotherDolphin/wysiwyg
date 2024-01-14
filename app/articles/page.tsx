import { Typography } from "@mui/material"
import Link from "next/link"
import { FC } from "react"
import revalidateArticles from "../utils/server-actions"
import { LibraryBooks } from "@mui/icons-material"

export interface IArticle {
  _id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: string
  references: {
    index: number
    link: string
  }[]
}

export interface IArticleWithHistory extends IArticle {
  history: {
    _id: string
    articleId: string
    updateTime: Date
    userEmail: string
  }[]
}

async function getArticles() {
  const { signal } = new AbortController()
  const res = await fetch("http://localhost:3000/api/articles", {
    signal,
  })

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch articles")
  }

  return res.json() as Promise<IArticle[]>
}

export default async function Page() {
  revalidateArticles()
  const data = await getArticles()
  // console.log(data);

  return (
    <div className="w-content flex flex-col flex-1">
      <Typography
        variant="h2"
        component="h1"
        className="text-[#0294a1] p-2 my-4 flex items-center gap-2"
      >
        <LibraryBooks className=" text-6xl " />
        Articles
      </Typography>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: IArticle
}

const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  // Find the first <p> tag in article.content
  const firstParagraphMatch = article.content?.match(/<p>(.*?)<\/p>/)
  const firstParagraph = firstParagraphMatch ? firstParagraphMatch[1] : ""

  // Get the first 100 characters of the first paragraph
  const previewText = firstParagraph.slice(0, 100)

  // Add an ellipsis if the text was truncated
  const displayText =
    firstParagraph.length > 100 ? `${previewText}...` : previewText

  // Format the last update time
  const date = new Date(article.updatedAt)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    })
    // .replace(",", "")

  return (
    <Link
      href={`/articles/${article._id}`}
      className="bg-white shadow-md rounded-lg p-4 m-2 flex flex-col gap-4
      hover:bg-gray-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105
      "
    >
      {/* <div className=""> */}
      <h2 className="text-xl font-bold">{article.title ?? "Title"}</h2>
      <p className="text-gray-600 flex-1">{displayText}</p>
      <p className="text-xs text-gray-400 self-end">updated: {date}</p>
      {/* </div> */}
    </Link>
  )
}
