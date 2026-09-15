import { Link } from 'react-router-dom'
import { sortedTerms, termCount } from '../lib/terms.js'

/**
 * TermRecap, the finish of the promise (PIZZA-40 / FR-38): once every term is
 * done, the Workshop gets one small celebratory card that says "these are the
 * N you learned today" and lists them by name, in teaching order. Not a new
 * screen; it sits above the checklist, and points at the Progress screen for
 * the diploma. The list and the count come from terms.json.
 */
export default function TermRecap({ className = '' }) {
  const total = termCount
  return (
    <section
      className={
        'rounded-lg border-[3px] border-neutral bg-success-bg p-4 shadow-pop ' + className
      }
    >
      <p className="font-label text-[11px] text-text-muted">All {total} wired in</p>
      <h3 className="mt-0.5 text-lg leading-tight">
        These are the {total} AI terms you learned today
      </h3>
      <ol className="mt-3 flex flex-wrap gap-1.5">
        {sortedTerms.map((term, i) => (
          <li
            key={term.id}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-neutral bg-surface px-2.5 py-0.5 font-label text-[11px] text-text"
          >
            <span className="material-symbols-rounded fill text-[14px] text-success" aria-hidden="true">
              check
            </span>
            <span className="text-text-muted">{i + 1}</span>
            {term.name}
          </li>
        ))}
      </ol>
      <Link
        to="/progress"
        className="press mt-4 inline-flex items-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-4 py-2 font-label text-sm text-white shadow-pop"
      >
        <span className="material-symbols-rounded fill" aria-hidden="true">
          workspace_premium
        </span>
        Get your diploma
      </Link>
    </section>
  )
}
