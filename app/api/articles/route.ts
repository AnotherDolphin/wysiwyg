import { NextRequest } from "next/server"
import db from "../../db-conn"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  // if there's an id in the query string, return the article with that id
  // otherwise, return all articles
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (id) {
    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) })
    return new Response(JSON.stringify(article), { status: 200 })
  }

  const articles = await db.collection("articles").find().toArray()
  return Response.json(articles, { status: 200 })
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  const { title, content } = await request.json()

  // Get a reference to the articles collection in the database
  const articlesCollection = db.collection("articles")

  // Create a new document to insert into the collection
  const article = {
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Insert the article document into the collection
  await articlesCollection.insertOne(article)

  return new Response(`Article ${title} created with content ${content}`)
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
