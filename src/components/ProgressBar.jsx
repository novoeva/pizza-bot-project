/**
 * ProgressBar, the game's progress as a labelled, segmented line: one segment
 * per step, the first `current` of them marinara, the rest grey. Sits at the
 * top of the PhaseCard so it is the first thing on the play column (Phase 1
 * review, round 2: "call it Progress, a line divided into the parts").
 * The count is kept for screen readers.
 */
export default function ProgressBar({ current, total, unit }) {
  const label = `${unit ? unit + ' ' : ''}${current} of ${total}`
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Progress: ${label}`}>
      <span className="font-label text-[10px] text-text-muted">Progress</span>
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
      <span className="font-label text-[10px] text-text-muted" aria-hidden="true">
        {current}/{total}
      </span>
    </div>
  )
}
