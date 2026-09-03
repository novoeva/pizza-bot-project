/**
 * Callout, the one shape for "here is the verdict / consequence" (roles 6 and
 * 7 in COMPONENT-AUDIT.md §2) and for asides (info).
 *
 * One shape everywhere: rounded-lg, 3px border in the tone colour, tint
 * background, 4px pop shadow, eyebrow + icon in the tone colour, 15px body.
 * The only thing that changes between uses is `tone`:
 *   problem  it went wrong / it hurts  (muted brick red)
 *   success  it went right             (green, the ONLY green on a screen)
 *   info     an aside: "Real talk", "The fix", "In the real world" (neutral)
 *
 * `compact` is for feedback that lands in place under a choice (less padding,
 * 13px body). `align="center"` for the few centred result cards.
 * `icon={null}` suppresses the icon; a string picks a Material Symbol.
 */
const TONES = {
  problem: { box: 'border-danger bg-danger-bg', label: 'text-danger', icon: 'warning' },
  success: { box: 'border-success bg-success-bg', label: 'text-success', icon: 'check_circle' },
  info: { box: 'border-neutral bg-surface', label: 'text-text-muted', icon: 'info' },
}

export default function Callout({
  tone = 'info',
  title,
  icon,
  compact = false,
  align = 'left',
  className = '',
  children,
}) {
  const t = TONES[tone] || TONES.info
  const glyph = icon === undefined ? t.icon : icon
  return (
    <div
      className={
        'rounded-lg border-[3px] shadow-pop ' +
        (compact ? 'p-3 ' : 'p-4 ') +
        (align === 'center' ? 'text-center ' : 'text-left ') +
        t.box +
        (className ? ' ' + className : '')
      }
    >
      {title && (
        <p
          className={
            (children ? 'mb-1 ' : '') +
            'flex items-start gap-1 font-label text-[11px] font-bold leading-snug ' +
            (align === 'center' ? 'justify-center ' : '') +
            t.label
          }
        >
          {glyph && <span className="material-symbols-rounded mt-px shrink-0 text-[15px]">{glyph}</span>}
          <span>{title}</span>
        </p>
      )}
      {children && (
        <div className={(compact ? 'text-[13px]' : 'text-[15px]') + ' leading-snug text-text'}>
          {children}
        </div>
      )}
    </div>
  )
}
