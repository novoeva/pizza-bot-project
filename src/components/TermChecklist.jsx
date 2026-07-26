import { Link } from 'react-router-dom'
import terms from '../content/terms.json'

/** Material icon per term, shown in the to-do badge. */
const TERM_ICON = {
  token: 'graphic_eq',
  'context-window': 'history',
  hallucination: 'blur_on',
  prompt: 'edit_note',
  agent: 'directions_run',
  'tool-use': 'build',
  skill: 'school',
  memory: 'database',
  mcp: 'cable',
  guardrails: 'shield',
  temperature: 'thermostat',
}

/** All terms, doubles as the game menu. Free order, no locks. */
export default function TermChecklist({ completedTerms = [] }) {
  const completed = new Set(completedTerms)
  const sorted = [...terms].sort((a, b) => a.order - b.order)

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((term) => {
        const done = completed.has(term.id)
        return (
          <li key={term.id}>
            <Link
              to={`/game/${term.id}`}
              className={
                'press flex items-center gap-3 rounded-md border-[3px] border-neutral p-4 ' +
                (done ? 'bg-muted opacity-75' : 'bg-surface shadow-pop')
              }
            >
              <span
                className={
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-neutral ' +
                  (done ? 'bg-primary' : 'bg-accent-soft')
                }
                aria-hidden="true"
              >
                <span
                  className={
                    'material-symbols-rounded ' + (done ? 'fill text-white' : 'text-tertiary')
                  }
                >
                  {done ? 'check_circle' : TERM_ICON[term.id] || 'extension'}
                </span>
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
                <span className="mt-0.5 block text-[13px] text-text-muted">{term.botPart}</span>
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
