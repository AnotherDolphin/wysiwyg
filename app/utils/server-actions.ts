"use server"

import { revalidatePath } from "next/cache"

// legacy after AbortController is added
export default async function revalidateArticles() {
  revalidatePath("/articles")
  revalidatePath("/articles/[id]", "page")
}
