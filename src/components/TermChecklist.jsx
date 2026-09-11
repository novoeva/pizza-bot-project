import { Link } from 'react-router-dom'
import terms from '../content/terms.json'

/**
 * All terms, doubles as the game menu. Free order, no locks, but the list
 * leads: cards are numbered 1..N, done ones get a tick, and the first card
 * not yet done carries a "Start here" / "Next up" sticker (Nina 2.3: people
 * did not know where to begin, so number it and point at the first one).
 */
export default function TermChecklist({ completedTerms = [] }) {
  const completed = new Set(completedTerms)
  const sorted = [...terms].sort((a, b) => a.order - b.order)
  const next = sorted.find((t) => !completed.has(t.id))
  const stickerText = completed.size === 0 ? 'Start here' : 'Next up'

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((term, i) => {
        const done = completed.has(term.id)
        const isNext = next?.id === term.id
        return (
          <li key={term.id}>
            {/* The sticker is positioned against this wrapper, not the <li>, so
                anything rendered above the card inside the <li> stays uncovered. */}
            <div className={isNext ? 'relative pt-4' : undefined}>
            {isNext && (
              <span
                className="absolute left-3 top-0 z-10 inline-flex -rotate-2 items-center gap-1 rounded-md border-[3px] border-neutral bg-primary px-2.5 py-1 font-label text-[11px] text-white shadow-pop"
                aria-hidden="true"
              >
                <span className="material-symbols-rounded text-base">arrow_downward</span>
                {stickerText}
              </span>
            )}
            <Link
              to={`/game/${term.id}`}
              aria-label={`${i + 1}. ${term.name}${done ? ', done' : isNext ? `, ${stickerText.toLowerCase()}` : ''}`}
              className={
                'press flex items-center gap-3 rounded-md border-[3px] p-4 ' +
                (done
                  ? 'border-neutral bg-muted opacity-75'
                  : isNext
                    ? 'border-primary bg-surface shadow-card'
                    : 'border-neutral bg-surface shadow-pop')
              }
            >
              <span
                className={
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral font-label text-base font-bold ' +
                  (done ? 'bg-success text-white' : isNext ? 'bg-primary text-white' : 'bg-accent-soft text-text')
                }
                aria-hidden="true"
              >
                {done ? (
                  <span className="material-symbols-rounded fill">check</span>
                ) : (
                  i + 1
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={
                    'block font-label text-[15px] font-semibold ' +
                    (done ? 'text-text-muted' : 'text-text')
                  }
                >
                  {term.name}
                </span>
                {/* The reason to tap this card, not a label for the bot part:
                    one sentence saying what goes wrong (or what you get) if you
                    don't know the term. Wraps to two lines at phone width. */}
                <span className="mt-0.5 block text-[13px] leading-snug text-text-muted">
                  {term.whyYouCare}
                </span>
              </span>

              <span className="material-symbols-rounded text-text-muted">
                {done ? 'chevron_right' : 'play_arrow'}
              </span>
            </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
