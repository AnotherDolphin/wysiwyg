import db from "../db-conn"

export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  const { title, content } = await request.json()

  // Get a reference to the articles collection in the database
  const articlesCollection = db.collection("articles")

  // Create a new document to insert into the collection
  const article = { title, content }

  // Insert the article document into the collection
  await articlesCollection.insertOne(article)

  return new Response(`Article ${title} created with content ${content}`)
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
