/**
 * ProgressBar, the game's progress: one slim line labelled "Progress", split
 * into one segment per part of the game. Lives under the intro card. Parts you have finished are solid
 * marinara; the part you are in fills up as you go through its steps; parts
 * ahead are empty. No numbers (Phase 1 review, round 4: one bar, nothing to
 * read). The count is kept for screen readers.
 *
 *   part / parts   which part of the game you are in
 *   step / steps   how far inside the current part (optional; a part with
 *                  nothing to count shows as filled while you are in it)
 */
export default function ProgressBar({ part = 1, parts = 1, step, steps }) {
  const label =
    (parts > 1 ? `part ${part} of ${parts}` : '') +
    (steps ? `${parts > 1 ? ', ' : ''}step ${step} of ${steps}` : '')
  const fillFor = (i) => {
    if (i < part - 1) return 100
    if (i > part - 1) return 0
    return steps ? Math.round((step / steps) * 100) : 100
  }
  return (
    <div
      className="flex items-center gap-2 px-1"
      role="img"
      aria-label={`Progress: ${label}`}
    >
      <span className="shrink-0 font-label text-[9px] font-bold text-text-muted">Progress</span>
      <span className="flex flex-1 gap-1" aria-hidden="true">
        {Array.from({ length: parts }).map((_, i) => (
          <span
            key={i}
            className="h-2 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-muted"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${fillFor(i)}%` }}
            />
          </span>
        ))}
      </span>
    </div>
  )
}
