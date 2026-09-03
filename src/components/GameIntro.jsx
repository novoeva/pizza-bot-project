/**
 * Standard game intro card, shared across all games: step 1 of the game
 * framework, "explain what we're teaching BEFORE playing" (FR-9).
 *
 * Shows, in a fixed order so every game opens the same way:
 *   1. the term name
 *   2. the definition (term.definition), labelled "What it is". Phase 4 decision:
 *      say it up front, apply it during the game, repeat it at the end
 *      (TermReveal). The old "teaser" line (term.about) is no longer shown.
 *   3. "Your role" (term.role): who you are and what you're doing in THIS
 *      game. The identity is constant (you're the owner setting up your bot);
 *      only the part changes. Blue, because blue = yours.
 *   4. optionally "How to play" (term.howToPlay), when a game has one
 *      mechanic for the whole game. Multi-phase games pass `showHowTo={false}`
 *      and put the current step's instruction in a PhaseCard at the top of
 *      the play column instead.
 *
 * All text lives in content/terms.json. The card sits in GameStage's left
 * column on every screen of every game, so the definition never leaves view.
 */
export default function GameIntro({ term, showHowTo = true }) {
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Term · {term.name}</p>
      <h1 className="text-2xl leading-tight">{term.name}</h1>
      <div className="mt-2">
        <p className="font-label text-[10px] text-text-muted">What it is</p>
        <p className="mt-0.5 text-[13px] leading-snug text-text">{term.definition}</p>
      </div>
      {term.role && (
        <div className="mt-3 rounded-md bg-accent-soft px-3 py-2">
          <p className="font-label text-[10px] text-tertiary">Your role</p>
          <p className="mt-0.5 text-[13px] font-bold leading-snug text-text">{term.role}</p>
        </div>
      )}
      {showHowTo && (
        <div className="mt-3">
          <p className="font-label text-[10px] text-text-muted">How to play</p>
          <p className="mt-0.5 text-[13px] leading-snug text-text">{term.howToPlay}</p>
        </div>
      )}
    </div>
  )
}
