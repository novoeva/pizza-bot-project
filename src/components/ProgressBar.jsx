/**
 * ProgressBar, the game's progress strip. Sits at the very top of every game
 * screen (GameStage renders it above both columns; the single-column games
 * render it first) and shows up to two levels:
 *
 *   part / parts   which part of the game you are in ("Part 1 / 2")
 *   step / steps   how far you are inside the current part ("Customer 2 / 4")
 *
 * Each level is a labelled line of segments, one per unit, filled in marinara
 * up to where you are. Games pass only the levels they have: a one-part game
 * shows just the step line; a part with no countable steps shows just the
 * part line. (Phase 1 review, round 3.)
 */
function Line({ label, current, total }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 font-label text-[10px] text-text-muted">{label}</span>
      <span className="flex flex-1 gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={
              'h-2.5 flex-1 rounded-full border-2 border-neutral ' +
              (i < current ? 'bg-primary' : 'bg-muted')
            }
          />
        ))}
      </span>
    </div>
  )
}

export default function ProgressBar({
  part,
  parts,
  partUnit = 'Part',
  step,
  steps,
  stepUnit = 'Step',
}) {
  const showParts = parts > 1
  const showSteps = steps > 0
  if (!showParts && !showSteps) return null
  const label =
    (showParts ? `${partUnit} ${part} of ${parts}` : '') +
    (showParts && showSteps ? ', ' : '') +
    (showSteps ? `${stepUnit} ${step} of ${steps}` : '')
  return (
    <div
      className="rounded-md border-[3px] border-neutral bg-surface px-3 py-2 shadow-pop"
      role="img"
      aria-label={`Progress: ${label}`}
    >
      <p className="mb-1 font-label text-[10px] font-bold text-text-muted">Progress</p>
      <div className="flex flex-col gap-1">
        {showParts && <Line label={`${partUnit} ${part} / ${parts}`} current={part} total={parts} />}
        {showSteps && <Line label={`${stepUnit} ${step} / ${steps}`} current={step} total={steps} />}
      </div>
    </div>
  )
}
