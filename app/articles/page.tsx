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
      <h1>Articles</h1>
      <ul>
        {data.map((article) => (
          <li key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
