import db from "../../db-conn"
import bcrypt from "bcrypt"

export interface IUser {
  email: string
  password: string
}

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Get a reference to the users collection in the database
  const usersCollection = db.collection("users")

  // check if user already exists
  const existingUser = await usersCollection.findOne({ email })
  if (existingUser) {
    return new Response(`User ${email} already exists`, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Create a new document to insert into the collection
  const user = { email, password: hashedPassword }

  // Insert the user document into the collection
  try {
    await usersCollection.insertOne(user)
  } catch (e) {
    return new Response(`Error: ${e}`, { status: 400 })
  }

  return Response.json({ message: `User ${email} created` }, { status: 200 })
}
