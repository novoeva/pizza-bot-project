import { Link } from 'react-router-dom'
import terms from '../content/terms.json'

/**
 * All terms, doubles as the game menu. Free order, no locks. Sorted by
 * `order` from terms.json, which is also the numbering on the flow board.
 * At `lg`+ the list lives in the narrow bento side column, so the cards
 * tighten up there (padding, badge, type) via responsive classes.
 */
export default function TermChecklist({ completedTerms = [] }) {
  const completed = new Set(completedTerms)
  const sorted = [...terms].sort((a, b) => a.order - b.order)

  return (
    <ul className="flex flex-col gap-3 lg:gap-2">
      {sorted.map((term) => {
        const done = completed.has(term.id)
        return (
          <li key={term.id}>
            <Link
              to={`/game/${term.id}`}
              className={
                'press flex items-center gap-3 rounded-md border-[3px] border-neutral p-4 lg:p-2.5 ' +
                (done ? 'bg-muted opacity-75' : 'bg-surface shadow-pop')
              }
            >
              <span
                className={
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral lg:h-8 lg:w-8 ' +
                  (done ? 'bg-primary' : 'bg-accent-soft')
                }
                aria-hidden="true"
              >
                {done ? (
                  <span className="material-symbols-rounded fill text-white">check_circle</span>
                ) : (
                  <span className="font-label text-[15px] font-bold text-tertiary lg:text-[13px]">
                    {term.order}
                  </span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={
                    'block font-label text-[15px] font-semibold lg:text-[14px] ' +
                    (done ? 'text-text-muted' : 'text-text')
                  }
                >
                  {term.name}
                </span>
                {/* The reason to tap this card, not a label for the bot part:
                    one sentence saying what goes wrong (or what you get) if you
                    don't know the term. Wraps to two lines at phone width. */}
                <span className="mt-0.5 block text-[13px] leading-snug text-text-muted lg:text-[12px]">
                  {term.whyYouCare}
                </span>
              </span>

              <span className="material-symbols-rounded text-text-muted">
                {done ? 'chevron_right' : 'play_arrow'}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
