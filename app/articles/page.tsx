import { Typography } from "@mui/material"
import Link from "next/link"
import { FC } from "react"
import revalidateArticles from "../utils/server-actions"
import { LibraryBooks } from "@mui/icons-material"
import cheerio, { load } from 'cheerio';

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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
      signal,
    })

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch articles")
    }

    const data = await res.json()

    return data as IArticle[]
  } catch (error) {
    console.error(error)
    // Handle the error here
  }
}

export default async function Page() {
  if (!process.env.NEXT_PUBLIC_API_URL) return <div>API URL not found</div>
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
        {data?.map((article) => (
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

  const stripTags = (html: string) => {
    const $ = load(html);
    return $.text();
  };

  const previewText = firstParagraph.slice(0, 100)
  const title = article.title ? article.title : "Untitled"

  const displayText =
    firstParagraph.length > 150 ? `${previewText}...` : previewText

  const displayTitle =
    title.length > 50
      ? `${title.slice(0, 50)}...`
      : title

  // Format the last update time
  const date = new Date(article.updatedAt).toLocaleDateString("en-GB", {
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
      <h2
        className="text-xl font-bold"
        dangerouslySetInnerHTML={{ __html: stripTags(displayTitle) }}
      ></h2>
      <p
        className="text-gray-600 flex-1"
        dangerouslySetInnerHTML={{ __html: stripTags(displayText) }}
      ></p>
      <p className="text-xs text-gray-400 self-end">updated: {date}</p>
      {/* </div> */}
    </Link>
  )
}
