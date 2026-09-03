/**
 * ChoiceGroup wraps a set of SelectableCards and owns the "what do I do here"
 * microcopy, so no game can forget it: a label (what the question is), a hint
 * ("Pick one" / "Pick any" / "Tap one"), and the grid.
 *
 *   label    the question or category ("Limit 1 · Max discount…")
 *   hint     defaults by mode: radio → "Pick one", checkbox → "Pick any",
 *            commit → "Tap one"
 *   columns  1 (default), 2 or 4
 */
const HINT = { radio: 'Pick one', checkbox: 'Pick any', commit: 'Tap one' }

export default function ChoiceGroup({ label, mode = 'radio', hint, columns = 1, children }) {
  const cols = columns === 4 ? 'grid-cols-4' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
  return (
    <div role={mode === 'radio' ? 'radiogroup' : 'group'} aria-label={label}>
      {(label || hint !== null) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2 px-1">
          {label ? <p className="font-label text-[11px] text-text-muted">{label}</p> : <span />}
          <p className="shrink-0 font-label text-[10px] font-bold text-tertiary">{hint ?? HINT[mode]}</p>
        </div>
      )}
      <div className={'grid gap-2 ' + cols}>{children}</div>
    </div>
  )
}
