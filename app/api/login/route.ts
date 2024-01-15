import db from "../../db-conn"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Get a reference to the users collection in the database
  const usersCollection = db.collection("users")

  // check if user already exists
  const existingUser = await usersCollection.findOne({ email })
  if (!existingUser) {
    return new Response(`User ${email} does not exist`, { status: 400 })
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.password)
  if (!passwordMatches) {
    return new Response(`Invalid password`, { status: 400 })
  }

  const token = jwt.sign({ email }, "secret")

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=86400`
    }
  })
}

// get the user's email from the token
export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader) return new Response(`Unauthorized`, { status: 401 })
  const token = authHeader.replace("Bearer ", "")

  const { email } = jwt.verify(token, "secret") as { email: string }

  return new Response(JSON.stringify({ email }), { status: 200 })
}