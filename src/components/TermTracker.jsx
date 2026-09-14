import { Link } from 'react-router-dom'
import { sortedTerms, termCount, firstIncomplete } from '../lib/terms.js'

/**
 * TermTracker, the count-as-a-promise in one row (PIZZA-40 / FR-38): one
 * small numbered dot per term, so the whole total is visible at once on every
 * width (Nina: a numbered column hides the total; a row shows it), plus one
 * line saying how far you are and which term is next.
 *
 *   done      green dot with a tick
 *   next      red dot (the same red as the "Start here" sticker)
 *   to do     white dot with its number
 *
 * The dots are a picture; the sentence under them carries the same facts for
 * screen readers, and "next: <term>" is a link into that game. Everything is
 * read from terms.json through lib/terms.js, so adding a term adds a dot.
 */
export default function TermTracker({ completedTerms = [], className = '' }) {
  const done = new Set(completedTerms)
  const next = firstIncomplete(completedTerms)
  const total = termCount
  const count = done.size
  const powered = count >= total

  return (
    <div className={'flex flex-col items-center gap-2 ' + className}>
      <ol className="flex flex-wrap justify-center gap-1.5" aria-hidden="true">
        {sortedTerms.map((term, i) => {
          const isDone = done.has(term.id)
          const isNext = next?.id === term.id
          return (
            <li
              key={term.id}
              title={term.name}
              className={
                'flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral font-label text-[10px] font-bold ' +
                (isDone
                  ? 'bg-success text-white'
                  : isNext
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text')
              }
            >
              {isDone ? (
                <span className="material-symbols-rounded fill text-[14px]">check</span>
              ) : (
                i + 1
              )}
            </li>
          )
        })}
      </ol>
      <p className="text-center font-label text-[11px] text-text-muted">
        {powered ? (
          <>
            All {total} done · your bot is online
          </>
        ) : (
          <>
            {count} of {total} done · next:{' '}
            <Link to={`/game/${next.id}`} className="text-primary underline underline-offset-2">
              {next.name}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
