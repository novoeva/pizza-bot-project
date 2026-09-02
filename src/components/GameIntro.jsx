/**
 * Standard game intro card, shared across all games.
 *
 * Shows, in a fixed order so every game opens the same way:
 *   1. the term name
 *   2. a one-line orientation (term.about): what the term is about, framed
 *      to spark curiosity WITHOUT giving away the answer (the full definition
 *      stays the payoff, shown after play)
 *   3. "Your role" (term.role): who you are and what you're doing in THIS game.
 *      The identity is constant across games (you're the owner setting up your
 *      bot); only the part changes. Highlighted, because it's the main thing
 *      the orientation column should answer. Optional — games that haven't been
 *      given a role yet simply omit the block.
 *   4. a clearly labeled "How to play" instruction (term.howToPlay): the bare
 *      mechanic, secondary to the role.
 *
 * `about`, `role` and `howToPlay` all live in content/terms.json, so intros are
 * data-driven and consistent instead of hand-written per game.
 *
 * `showHowTo`: multi-phase games where the mechanic changes per phase (e.g. a
 * slider first, then a multiple-choice) pass `false`, keep only the constant
 * orientation here on the left, and render the CURRENT step's instruction at
 * the top of the active column instead — so the instruction is always accurate
 * and its change is noticed where the player is actually acting.
 */
export default function GameIntro({ term, showHowTo = true }) {
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Term · {term.name}</p>
      <h1 className="text-2xl leading-tight">{term.name}</h1>
      <p className="mt-1 text-[13px] leading-snug text-text">{term.about}</p>
      {term.role && (
        <div className="mt-2 rounded-md border-2 border-neutral bg-accent-soft px-3 py-2">
          <p className="font-label text-[10px] text-tertiary">Your role</p>
          <p className="mt-0.5 text-[13px] font-bold leading-snug text-text">{term.role}</p>
        </div>
      )}
      {showHowTo && (
        <div className="mt-2 rounded-md border-2 border-neutral bg-surface px-3 py-2">
          <p className="font-label text-[10px] text-text-muted">How to play</p>
          <p className="mt-0.5 text-[13px] leading-snug text-text">{term.howToPlay}</p>
        </div>
      )}
    </div>
  )
}
