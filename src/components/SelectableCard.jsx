/**
 * SelectableCard, the one "question to answer" control (role 4 in
 * COMPONENT-AUDIT.md §2, FR-10 / FR-16). Every tappable option in every game
 * is one of these, so a choice always looks like a choice: a radio circle or
 * checkbox square on the left (or an icon panel), a lift on hover, and a
 * blue fill once picked. Blue = yours.
 *
 *   mode      'radio'     pick one, stays picked (Guardrails limits, Prompt round 3)
 *             'checkbox'  pick any, tap again to unpick
 *             'commit'    tapping it moves you on; shows a chevron, never
 *                         a picked state (Prompt rounds 1–2, Tool use, Token)
 *   variant   'row' (default) or 'tile' (centred, for a short grid of options)
 *   icon      Material Symbol; draws the coloured icon panel instead of the
 *             radio/checkbox control (the "thing you give the bot" look)
 *   tag       small type line above the label ("Instruction you give your bot")
 *   label     the option; detail / foot are optional smaller lines under it
 *   selected, disabled, onSelect
 *   inert     shown back on a result screen: not tappable, not faded, no chevron
 *   iconClassName  colour override for a tile's big icon
 */
export default function SelectableCard({
  mode = 'radio',
  variant = 'row',
  icon,
  tag,
  label,
  detail,
  foot,
  selected = false,
  disabled = false,
  inert = false,
  onSelect,
  labelClassName = '',
  iconClassName = '',
}) {
  const commit = mode === 'commit'
  const tile = variant === 'tile'
  const aria = commit ? {} : { role: mode === 'radio' ? 'radio' : 'checkbox', 'aria-checked': selected }

  const control = !icon && !commit && (
    <span
      className={
        'flex h-5 w-5 shrink-0 items-center justify-center border-[3px] border-neutral ' +
        (mode === 'radio' ? 'rounded-full ' : 'rounded ') +
        (selected ? 'bg-tertiary' : 'bg-surface')
      }
      aria-hidden="true"
    >
      {selected && <span className="material-symbols-rounded text-[14px] text-white">check</span>}
    </span>
  )

  const panel = icon && (
    <span
      className={
        'flex w-11 shrink-0 items-center justify-center border-r-[3px] border-neutral ' +
        (selected ? 'bg-tertiary text-white' : 'bg-accent-soft text-tertiary')
      }
      aria-hidden="true"
    >
      <span className="material-symbols-rounded text-[20px]">{selected && !commit ? 'check' : icon}</span>
    </span>
  )

  const base =
    'overflow-hidden rounded-md border-[3px] border-neutral text-left shadow-pop ' +
    (disabled ? 'opacity-40 ' : inert ? '' : 'press ') +
    (selected ? 'bg-accent-soft' : 'bg-surface')

  if (tile) {
    return (
      <button type="button" onClick={onSelect} disabled={disabled || inert} {...aria} className={base + ' flex flex-col items-center gap-1 px-2 py-4 text-center'}>
        {icon && (
          <span className={'material-symbols-rounded text-2xl ' + (iconClassName || 'text-tertiary')}>{icon}</span>
        )}
        <span className={'font-label text-sm font-bold text-text ' + labelClassName}>{label}</span>
        {detail && <span className="font-label text-[10px] text-text-muted">{detail}</span>}
      </button>
    )
  }

  return (
    <button type="button" onClick={onSelect} disabled={disabled || inert} {...aria} className={base + ' flex items-stretch'}>
      {panel}
      <span className={'flex flex-1 items-center gap-3 ' + (icon ? 'px-3 py-2.5' : 'px-3 py-2.5')}>
        {control}
        <span className="min-w-0 flex-1">
          {tag && <span className="block font-label text-[10px] text-tertiary">{tag}</span>}
          <span className={'block font-bold leading-snug text-text ' + labelClassName}>{label}</span>
          {detail && <span className="mt-0.5 block text-[12px] leading-snug text-text-muted">{detail}</span>}
          {foot && <span className="mt-1 block font-label text-[9px] text-text-muted">{foot}</span>}
        </span>
        {commit && !inert && (
          <span className="material-symbols-rounded shrink-0 text-text-muted" aria-hidden="true">
            chevron_right
          </span>
        )}
      </span>
    </button>
  )
}
