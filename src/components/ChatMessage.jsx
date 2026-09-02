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
 * The bubble holds the words that were said and nothing else, and it is
 * never tinted (Phase 1 review, rounds 1 and 2): whether the reply was good
 * or bad is said by a Callout under the bubble, not by the bubble.
 *
 * `size="sm"` is the compact transcript row (context window). `label={null}`
 * hides the name line.
 */
const SIDE = {
  customer: { right: false, corner: 'rounded-tl-sm', fill: 'border-neutral bg-muted', label: 'Customer' },
  bot: { right: true, corner: 'rounded-tr-sm', fill: 'border-neutral bg-surface', label: 'Your bot' },
  you: { right: true, corner: 'rounded-tr-sm', fill: 'border-neutral bg-accent-soft', label: 'You' },
}

/** Person or robot avatar. `who`: 'customer' | 'bot'. */
export function Avatar({ who = 'customer', size = 'md', className = '' }) {
  const bot = who === 'bot'
  const sm = size === 'sm'
  return (
    <span
      className={
        'flex shrink-0 items-center justify-center rounded-full border-neutral ' +
        (sm ? 'h-7 w-7 border-2 ' : 'h-9 w-9 border-[3px] ') +
        (bot ? 'bg-primary ' : 'bg-surface ') +
        className
      }
      aria-hidden="true"
    >
      <span
        className={
          'material-symbols-rounded ' + (sm ? 'text-[16px] ' : 'text-[20px] ') + (bot ? 'text-white' : 'text-text-muted')
        }
      >
        {bot ? 'smart_toy' : 'person'}
      </span>
    </span>
  )
}

export default function ChatMessage({ from = 'customer', label, size = 'md', className = '', children }) {
  const side = SIDE[from] || SIDE.customer
  const sm = size === 'sm'
  const bubble =
    'rounded-2xl ' +
    side.corner +
    (sm ? ' border-2 px-3 py-1.5 ' : ' border-[3px] px-4 py-3 shadow-pop ') +
    side.fill
  const avatar = <Avatar who={from === 'bot' ? 'bot' : 'customer'} size={size} />
  const body = (
    <div className="max-w-[85%]">
      {label !== null && (
        <p className={'mb-1 font-label text-[10px] text-text-muted' + (side.right ? ' text-right' : '')}>
          {label ?? side.label}
        </p>
      )}
      <div className={bubble}>
        <p className={(sm ? 'text-[13px] ' : 'font-bold ') + 'leading-snug text-text'}>{children}</p>
      </div>
    </div>
  )
  const row = 'flex items-start gap-2 ' + className
  return side.right ? (
    <div className={row + ' justify-end'}>
      {body}
      {avatar}
    </div>
  ) : (
    <div className={row}>
      {avatar}
      {body}
    </div>
  )
}
