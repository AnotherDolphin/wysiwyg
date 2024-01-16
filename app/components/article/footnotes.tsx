import { Book } from "@mui/icons-material"
import { Delete } from "@mui/icons-material"
import { Tooltip } from "@mui/material"

interface Footnote {
  index: number
  link: string
}
interface FootnotesProps {
  footnotes: Footnote[]
  onDelete?: (index: number) => void
}

const Footnotes = ({ footnotes, onDelete }: FootnotesProps) => (
  <div className="flex flex-col my-2 p-2">
    <div className="flex items-center gap-2">
      <Book /> <h1 className="text-lg">References</h1>
    </div>
    <div className="h-4"></div>
    {footnotes &&
      footnotes.length > 0 &&
      footnotes.map((footnote) => (
        <div
          id={`footnote-${footnote.index}`}
          key={footnote.index}
          className="flex items-center gap-2"
        >
          <p>[{footnote.index}] </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700"
            href={footnote.link}
          >
            {footnote.link}
          </a>
          <div className="w-4"></div>
          {onDelete && (
            <Tooltip title="Delete Reference">
              <Delete
                className="text-gray-400 cursor-pointer hover:text-red-500 transition duration-200 ease-in-out"
                onClick={() => onDelete(footnote.index)}
              />
            </Tooltip>
          )}
        </div>
      ))}
  </div>
)

export default Footnotes
