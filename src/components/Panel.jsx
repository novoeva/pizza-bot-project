/**
 * Panel, a bordered box for reference material or a live tool you consult
 * (the menu, the context window, the dial, the ranking, a to-do list).
 * Never a message, never a verdict, never a choice.
 *
 * `header` picks how the title row is drawn:
 *   'inline'  (default) a small muted label row inside the padded body
 *   'label'   a grey strip across the top, separated by a 3px rule
 *   'brand'   a marinara strip: reference material you look things up in
 *   'dark'    a navy strip: "inside the bot's head" (what the bot sees / says)
 *
 * `icon` (Material Symbol) leads the title; `meta` sits on the right of the
 * title row. `compact` tightens the body padding. `shadow="card"` for the
 * few hero panels; default is the standard 4px pop.
 */
const STRIPS = {
  label: 'border-b-[3px] border-neutral bg-muted text-text-muted text-[11px]',
  brand: 'border-b-[3px] border-neutral bg-primary text-white text-[11px]',
  dark: 'bg-text text-white text-[10px]',
}

export default function Panel({
  header = 'inline',
  title,
  icon,
  meta,
  compact = false,
  shadow = 'pop',
  className = '',
  bodyClassName,
  children,
}) {
  const pad = bodyClassName ?? (compact ? 'px-3 py-2.5' : 'p-4')
  const strip = header !== 'inline' && title != null
  const hasBody = children != null && children !== false

  const titleRow = title != null && (
    <div
      className={
        strip
          ? 'flex items-center justify-between gap-2 px-3 py-1.5 font-label ' + STRIPS[header]
          : (hasBody ? 'mb-2 ' : '') + 'flex items-center justify-between gap-2 font-label text-[11px] text-text-muted'
      }
    >
      <span className="flex items-center gap-1">
        {icon && <span className="material-symbols-rounded text-[15px]">{icon}</span>}
        {title}
      </span>
      {meta && <span className="flex shrink-0 items-center gap-2">{meta}</span>}
    </div>
  )

  return (
    <div
      className={
        'overflow-hidden rounded-md border-[3px] border-neutral bg-surface ' +
        (shadow === 'card' ? 'shadow-card' : shadow === 'none' ? '' : 'shadow-pop') +
        (className ? ' ' + className : '')
      }
    >
      {strip && titleRow}
      <div className={pad}>
        {!strip && titleRow}
        {children}
      </div>
    </div>
  )
}
