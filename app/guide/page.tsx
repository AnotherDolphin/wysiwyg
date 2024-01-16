import Link from "next/link"
import React from "react"

const GuidePage = () => {
  return (
    <div className="w-content flex flex-col gap-6 py-10">
      <h1 className="text-3xl font-bold ">User Guide</h1>
      <h2 className="text-2xl font-bold mb-2">Get Started</h2>
      <ol className="pl-4 flex flex-col gap-2">
        <li>
          1.{" "}
          <Link className="text-cyan-600" href={"/auth/register"}>
            Register
          </Link>{" "}
          an account
        </li>
        <li>
          2.{" "}
          <Link className="text-cyan-600" href={"/auth/login"}>
            Login
          </Link>{" "}
          to your account
        </li>
        <li>
          3. Start{" "}
          <Link className="text-cyan-600" href={"/articles/author"}>
            authoring
          </Link>
          , reading, or editing{" "}
          <Link className="text-cyan-600" href={"/articles"}>
            articles
          </Link>
        </li>
      </ol>
      <h2 className="text-2xl font-bold mb-2">Features</h2>

      <h2 className="text-xl font-semibold mb-2">Full Authentication Module</h2>
      <p>Users can register, login, and logout</p>

      <h2 className="text-xl font-semibold mb-2">Article Viewing</h2>
      <p>Site visitors can read all saved articles</p>

      <h2 className="text-xl font-semibold mb-2">Article Authoring</h2>
      <p>Authenticated Users can create new articles and publish them</p>

      <h2 className="text-xl font-semibold mb-2">Article Editing</h2>
      <p>Authenticated Users can edit any article on the site</p>

      <h2 className="text-xl font-semibold mb-2">Edit History</h2>
      <p>
        Edit timelines are saved and can be accessed by clicking the history
        button on any article
      </p>

      <h2 className="text-xl font-semibold mb-2">Article References</h2>
      <p>
        Articles can have references to other articles. The custom `[C]` button
        in the editors formats a new reference superscript and adds it to the
        references section at the bottom of the article. The reference is also
        added to the article's references list.
      </p>
    </div>
  )
}

export default GuidePage
