/**
 * PhaseCard, the "what do I do on THIS screen" card (role 3, teaching &
 * instructions, in COMPONENT-AUDIT.md §2). Sits at the top of the play column
 * in every phase of every game, so the current step is always where the
 * player is acting.
 *
 *   title     the game's name for this beat, rendered as "Game · {title}"
 *   progress  where you are: { current, total, unit } draws a pizza with
 *             `total` slices, `current` of them done (ProgressPie); a plain
 *             string is shown as text, for counts that are not rounds
 *   heading   optional big term name, used only by the single-column games
 *             until Phase 4 gives them the left intro panel on every screen
 *   children  the instruction sentence(s)
 */
import ProgressPie from './ProgressPie.jsx'

export default function PhaseCard({ title, progress, heading, children }) {
  // An object ({ current, total, unit }) is real progress through the game
  // and is drawn as a pizza. A string is a plain count ("2/4 added") and is
  // shown as text.
  const pie = progress && typeof progress === 'object'
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <div className="flex items-center justify-between gap-2">
        <p className="font-label text-[11px] text-primary">Game · {title}</p>
        {pie ? (
          <ProgressPie {...progress} />
        ) : (
          progress && <span className="shrink-0 font-label text-[11px] text-text-muted">{progress}</span>
        )}
      </div>
      {heading && <h1 className="text-2xl leading-tight">{heading}</h1>}
      <div className="mt-1 text-[13px] leading-snug text-text-muted">{children}</div>
    </div>
  )
}
