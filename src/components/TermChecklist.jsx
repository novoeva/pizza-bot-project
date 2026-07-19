import { Link } from 'react-router-dom'
import terms from '../content/terms.json'

/** All 10 terms with checkmarks — doubles as the game menu. Free order, no locks. */
export default function TermChecklist({ completedTerms = [] }) {
  const completed = new Set(completedTerms)
  const sorted = [...terms].sort((a, b) => a.order - b.order)

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((term) => {
        const done = completed.has(term.id)
        return (
          <li key={term.id}>
            <Link
              to={`/game/${term.id}`}
              className="flex items-center gap-3 rounded-md bg-surface hover:bg-surface-hover px-4 py-3 transition-colors"
            >
              <span
                className={
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ' +
                  (done ? 'bg-success text-bg' : 'bg-slot-empty text-text-dim')
                }
                aria-hidden="true"
              >
                {done ? '✓' : term.order}
              </span>
              <span className={done ? 'text-text-muted line-through decoration-2' : 'text-text font-medium'}>
                {term.name}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
