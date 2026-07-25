/**
 * Standard game intro card, shared across all games.
 *
 * Shows three things in a fixed order so every game opens the same way:
 *   1. the term name
 *   2. a one-line orientation (term.about): what the term is about, framed
 *      to spark curiosity WITHOUT giving away the answer (the full definition
 *      stays the payoff, shown after play)
 *   3. a clearly labeled "How to play" instruction (term.howToPlay)
 *
 * Both `about` and `howToPlay` live in content/terms.json, so intros are
 * data-driven and consistent instead of hand-written per game.
 */
export default function GameIntro({ term }) {
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Term · {term.name}</p>
      <h1 className="text-2xl leading-tight">{term.name}</h1>
      <p className="mt-1 text-[13px] leading-snug text-text">{term.about}</p>
      <div className="mt-2 rounded-md border-2 border-neutral bg-muted px-3 py-2">
        <p className="font-label text-[10px] text-text-muted">How to play</p>
        <p className="mt-0.5 text-[13px] leading-snug text-text">{term.howToPlay}</p>
      </div>
    </div>
  )
}
