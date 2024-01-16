import EditorPage from "@/app/QuillEditor"
// import EditorPage from "./QuillEditor"
// import DrawerNav from "./components/drawer"

async function getArticle(id: string) {
  const { signal } = new AbortController()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?id=${id}`, {
    signal,
  })
  const json = await res.json()
  return json
}

export default async function Author({ params }: { params: { id: string } }) {
  const { id } = params
  const article = await getArticle(id)
  return (
    <div className="bg-white w-content flex flex-col flex-1">
      <EditorPage article={article} />
    </div>
  )
}
