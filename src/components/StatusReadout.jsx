import { Link } from 'react-router-dom'

/**
 * The workshop's status readout, the humor engine and the call to action,
 * spoken by the bot itself. Red while the bot is broken; flips to green
 * "System online" once every part is installed. Tapping it (while unfinished)
 * jumps straight to the next unbuilt game.
 */
export default function StatusReadout({ line, powered = false, firstMissingId }) {
  if (!line) return null

  const tappable = !powered && !!firstMissingId
  const inner = (
    <>
      <span
        className={
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-neutral ' +
          (powered ? 'bg-success' : 'bg-primary')
        }
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <rect x="5" y="7" width="22" height="18" rx="6" fill="#fff" />
          <circle
            cx="12.5"
            cy="16"
            r="2.6"
            fill={powered ? 'var(--color-success)' : 'var(--color-primary)'}
          />
          <circle
            cx="19.5"
            cy="16"
            r="2.6"
            fill={powered ? 'var(--color-success)' : 'var(--color-primary)'}
          />
          <line x1="16" y1="7" x2="16" y2="3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="2.5" r="2" fill="#fff" />
        </svg>
      </span>

      <span className="flex-1">
        <span className="mb-0.5 flex items-center gap-2">
          <span className="font-label text-[11px] text-text-muted">
            {powered ? 'System online' : 'Status readout'}
          </span>
          <span
            className={
              'inline-block h-2 w-2 rounded-full ' + (powered ? 'bg-success' : 'bg-primary')
            }
          />
        </span>
        <span className="block font-display text-[15px] font-bold leading-snug text-text">
          {line}
        </span>
        {tappable && (
          <span className="mt-1.5 inline-flex items-center gap-1 font-label text-[11px] text-primary">
            Fix it now
            <span className="material-symbols-rounded text-[15px]">chevron_right</span>
          </span>
        )}
      </span>
    </>
  )

  const cls =
    'flex w-full items-start gap-3 rounded-lg border-[3px] border-neutral bg-surface px-4 py-4 text-left shadow-card'

  return tappable ? (
    <Link to={`/game/${firstMissingId}`} className={cls + ' press'}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}
