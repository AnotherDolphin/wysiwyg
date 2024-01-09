import { Typography } from "@mui/material"
import { FC } from "react"

interface Article {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

async function getArticles() {
  const res = await fetch("http://localhost:3000/api/articles")
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch articles")
  }

  return res.json() as Promise<Article[]>
}

export default async function Page() {
  const data = await getArticles()

  return (
    <div className="bg-white w-content flex flex-col flex-1">
      <Typography variant="h2" component="h1"  gutterBottom className="text-[#0294a1]">
        Articles
      </Typography>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {data.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

interface ArticleCardProps {
  article: Article
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
    .replace(",", "")

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 flex flex-col gap-4">
      <h2 className="text-xl font-bold">{article.title ?? "Title"}</h2>
      <p className="text-gray-600">{displayText}</p>
      <p className="text-sm text-gray-500">Last updated: {date}</p>
    </div>
  )
}
