import { MongoClient } from "mongodb";

// Connection URL and database name
const url = process.env.MONGODB_URI!;
const dbName = "wysiwyg";

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the MongoDB server
await client.connect();

// Get a reference to the database
const db = client.db(dbName);

// Export the database connection for use in other modules
export default db;