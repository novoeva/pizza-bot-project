/**
 * PhaseCard, the "what do I do on THIS screen" card (role 3, teaching &
 * instructions, in COMPONENT-AUDIT.md §2). Sits at the top of the play column
 * in every phase of every game, so the current step is always where the
 * player is acting.
 *
 *   title     the game's name for this beat, rendered as "Game · {title}"
 *   progress  where you are: { current, total, unit } renders "Round 2 / 3";
 *             a plain string is shown as-is (for the odd two-level case)
 *   heading   optional big term name, used only by the single-column games
 *             until Phase 4 gives them the left intro panel on every screen
 *   children  the instruction sentence(s)
 */
function formatProgress(progress) {
  if (!progress) return null
  if (typeof progress === 'string') return progress
  const { current, total, unit } = progress
  return (unit ? unit + ' ' : '') + current + ' / ' + total
}

export default function PhaseCard({ title, progress, heading, children }) {
  const note = formatProgress(progress)
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <div className="flex items-center justify-between gap-2">
        <p className="font-label text-[11px] text-primary">Game · {title}</p>
        {note && <span className="shrink-0 font-label text-[11px] text-text-muted">{note}</span>}
      </div>
      {heading && <h1 className="text-2xl leading-tight">{heading}</h1>}
      <div className="mt-1 text-[13px] leading-snug text-text-muted">{children}</div>
    </div>
  )
}
