
import Image from "next/image";
import QuillEditor from "./QuillEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Your Page Title</h1>
        <QuillEditor />
      </div>
    </main>
  );
}
