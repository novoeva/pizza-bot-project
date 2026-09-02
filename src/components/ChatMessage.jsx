/**
 * ChatMessage, the one speech bubble (roles 1 and 2 in COMPONENT-AUDIT.md §2).
 *
 * A message is the only thing drawn as a bubble, and a bubble is always a
 * message: avatar beside a rounded bubble with one sharp corner. The side
 * carries who is talking:
 *   from="customer"  received, LEFT, person avatar, grey bubble
 *   from="bot"       your bot, RIGHT, marinara robot avatar, white bubble
 *   from="you"       you the owner typing to your bot, RIGHT, blue bubble
 *
 * `tone` tints the bot's bubble when the reply itself IS the verdict
 * ("good" = green, "bad" = muted red) and `note` puts the one-line verdict
 * under the text with its icon. `footer` is for any extra line under the note.
 */
const SIDE = {
  customer: { right: false, bubble: 'rounded-tl-sm border-neutral bg-muted', label: 'Customer' },
  bot: { right: true, bubble: 'rounded-tr-sm border-neutral bg-surface', label: 'Your bot' },
  you: { right: true, bubble: 'rounded-tr-sm border-neutral bg-accent-soft', label: 'You' },
}

const TONE = {
  good: { bubble: 'rounded-tr-sm border-success bg-success-bg', note: 'text-success', icon: 'check_circle' },
  bad: { bubble: 'rounded-tr-sm border-danger bg-danger-bg', note: 'text-danger', icon: 'error' },
}

/** Person or robot avatar. `who`: 'customer' | 'bot'. */
export function Avatar({ who = 'customer', className = '' }) {
  const bot = who === 'bot'
  return (
    <span
      className={
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-neutral ' +
        (bot ? 'bg-primary ' : 'bg-surface ') +
        className
      }
      aria-hidden="true"
    >
      <span className={'material-symbols-rounded text-[20px] ' + (bot ? 'text-white' : 'text-text-muted')}>
        {bot ? 'smart_toy' : 'person'}
      </span>
    </span>
  )
}

export default function ChatMessage({ from = 'customer', label, tone, note, noteIcon, footer, children }) {
  const side = SIDE[from] || SIDE.customer
  const t = tone ? TONE[tone] : null
  const bubble = 'rounded-2xl border-[3px] px-4 py-3 shadow-pop ' + (t ? t.bubble : side.bubble)
  const avatar = <Avatar who={from === 'bot' ? 'bot' : 'customer'} />
  const body = (
    <div className="max-w-[85%]">
      <p className={'mb-1 font-label text-[10px] text-text-muted' + (side.right ? ' text-right' : '')}>
        {label ?? side.label}
      </p>
      <div className={bubble}>
        <p className="font-bold leading-snug text-text">{children}</p>
        {note && (
          <p className={'mt-1 flex items-center gap-1 font-label text-[11px] font-bold ' + (t ? t.note : 'text-text-muted')}>
            <span className="material-symbols-rounded text-[15px]">{noteIcon ?? t?.icon ?? 'info'}</span>
            {note}
          </p>
        )}
        {footer}
      </div>
    </div>
  )
  return side.right ? (
    <div className="flex items-start justify-end gap-2">
      {body}
      {avatar}
    </div>
  ) : (
    <div className="flex items-start gap-2">
      {avatar}
      {body}
    </div>
  )
}
