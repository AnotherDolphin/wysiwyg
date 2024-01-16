import { NextRequest } from "next/server"
import db from "../../db-conn"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken" // Make sure to install jsonwebtoken package
import { IUser } from "../register/route"

export async function GET(req: NextRequest) {
  // if there's an id in the query string, return the article with that id
  // otherwise, return all articles
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const article = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(id) })

    // get article history
    const history = await db
      .collection("history")
      .find({ articleId: id })
      .toArray()
    return new Response(
      JSON.stringify({
        ...article,
        history,
      }),
      { status: 200 }
    )
  }

  const articles = await db.collection("articles").find().toArray()

  return Response.json(articles, { status: 200 })
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) return new Response(`Unauthorized`, { status: 401 })
  const token = authHeader.replace("Bearer ", "")
  const { email } = jwt.verify(token, "secret") as IUser
  const data = await request.json()
  const articleHTML = data.content

  // create title from the first h1 element in the article
  const title = articleHTML.match(/<h1>(.*)<\/h1>/)?.[1] ?? "Untitled"
  const truncatedTitle = title.length > 50 ? title.slice(0, 50) + "..." : title

  // Get a reference to the articles collection in the database
  const articlesCollection = db.collection("articles")

  // Create a new document to insert into the collection
  const article = {
    ...data,
    title: truncatedTitle,
    // refrences: data.references,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: email,
  }

  
  
  // Insert the article document into the collection
  await articlesCollection.insertOne(article)
  console.log("posted article", article);

  return new Response(`Article ${data.title} created`, {
    status: 201,
  })
}

export async function PUT(request: Request) {
  // todo: handle reference updates
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) return new Response(`Unauthorized`, { status: 401 })
  const token = authHeader.replace("Bearer ", "")
  const { email } = jwt.verify(token, "secret") as IUser
  const { id, content, references } = await request.json()

  const title = content.match(/<h1>(.*)<\/h1>/)?.[1] ?? "Untitled"
  const truncatedTitle = title.length > 50 ? title.slice(0, 50) + "..." : title

  if (!id) return new Response(`Article id is required`, { status: 400 })
  if (!content)
    return new Response(`Article content is required`, { status: 400 })

  const article = await db
    .collection("articles")
    .findOne({ _id: new ObjectId(id) })
  if (!article) {
    return new Response("Article not found", { status: 404 })
  }

  const date = new Date().toISOString()

  const updatedArticle = {
    ...article,
    references,
    title: truncatedTitle,
    content,
    updatedAt: date,
  }

  await db
    .collection("articles")
    .replaceOne({ _id: new ObjectId(id) }, updatedArticle)

  // Add entry to the history collection
  const historyEntry = {
    articleId: id,
    userEmail: email,
    updateTime: date,
  }

  await db.collection("history").insertOne(historyEntry)

  return new Response(`Article ${id} updated with content ${content}`, {
    status: 200,
  })
}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
