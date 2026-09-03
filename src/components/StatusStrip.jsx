import { TONES } from './tones.js'

/**
 * StatusStrip, a one-line tinted status (a damage counter, a cost, a live
 * total). Same tone colours as Callout, so "problem" and "success" mean the
 * same thing here as on a verdict card.
 *
 *   tone   'problem' | 'success' | 'info'
 *   icon   optional Material Symbol before the text
 *   big    optional large figure ("12 wks") set before the label
 */
export default function StatusStrip({ tone = 'info', icon, big, children }) {
  const t = TONES[tone] || TONES.info
  return (
    <div
      className={
        'flex items-center justify-center gap-2 rounded-md border-[3px] px-3 py-2 text-center font-label text-sm font-bold shadow-pop ' +
        t.box +
        ' ' +
        (tone === 'info' ? 'text-text' : t.label)
      }
    >
      {icon && <span className="material-symbols-rounded text-[18px]">{icon}</span>}
      {big && <span className="font-display text-lg font-extrabold normal-case leading-none">{big}</span>}
      <span className={big ? 'text-[10px] leading-tight' : ''}>{children}</span>
    </div>
  )
}
