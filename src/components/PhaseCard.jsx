/**
 * PhaseCard, the "what do I do on THIS screen" line (role 3, teaching &
 * instructions, in COMPONENT-AUDIT.md §2). Deliberately NOT a box: on a phone
 * the screen is already a stack of boxes (Phase 4 review), so the instruction
 * is plain text with a marinara eyebrow and a hairline under it. Sits at the top of the play column
 * in every phase of every game, so the current step is always where the
 * player is acting. Progress is NOT here: it lives in the ProgressBar strip
 * at the top of the screen (GameStage `progress`).
 *
 *   title     the game's name for this beat, rendered as "Game · {title}"
 *   meta      optional small text on the right of the title row, for a count
 *             that is not progress ("bad order", "3/4 added")
 *   heading   optional big term name, used only by the single-column games
 *             until Phase 4 gives them the left intro panel on every screen
 *   children  the instruction sentence(s)
 */
export default function PhaseCard({ title, meta, heading, children }) {
  return (
    <div className="border-b-2 border-dashed border-slot-empty px-1 pb-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-label text-[11px] text-primary">Game · {title}</p>
        {meta && <span className="shrink-0 font-label text-[11px] text-text-muted">{meta}</span>}
      </div>
      {heading && <h1 className="text-2xl leading-tight">{heading}</h1>}
      <div className="mt-1 text-[13px] leading-snug text-text-muted">{children}</div>
    </div>
  )
}
