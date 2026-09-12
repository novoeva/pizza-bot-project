import { termCount, termPosition } from '../lib/terms.js'

/**
 * Standard game intro card, shared across all games: step 1 of the game
 * framework, "explain what we're teaching BEFORE playing" (FR-9).
 *
 * Shows, in a fixed order so every game opens the same way:
 *   0. "Term N of M", the same count the landing page promised (Nina 2.4)
 *   1. the term name
 *   2. the definition (term.definition), labelled "What it is". Phase 4
 *      decision: say it up front, apply it during the game, repeat it at the
 *      end (TermReveal, in other words).
 *   3. "Why you care" (term.whyYouCare): the one-sentence reason to learn it,
 *      the same sentence as on the Workshop card (Nina 3.1: the reason must be
 *      on screen before the game starts). Plain white inset: teaching text.
 *   4. "Your role" (term.role): "You're the owner. This game shows you ..."
 *      Blue, because blue = yours.
 *
 * Each screen's own instruction lives in a PhaseCard at the top of the play
 * column, never here. GameStage renders this card in the left column on
 * every screen of every game, so the definition never leaves view.
 */
export default function GameIntro({ term }) {
  // 2.4 (Nina): carry the same number through the whole flow. The landing
  // page promises N terms, the Workshop lists 1..N, so each game says which
  // one of the N you are on.
  const position = termPosition(term.id)
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">
        Term {position} of {termCount}
      </p>
      <h1 className="text-2xl leading-tight">{term.name}</h1>
      <div className="mt-2">
        <p className="font-label text-[10px] text-text-muted">What it is</p>
        <p className="mt-0.5 text-[13px] leading-snug text-text">{term.definition}</p>
      </div>
      {/* 3.1 (Nina): say why the owner should care BEFORE the game starts.
          Same sentence as on the Workshop card, so the promise there is kept
          here. White inset with a marinara label (role 3, teaching text):
          amber is reserved for "a part of your bot" (COMPONENT-AUDIT §2 D5). */}
      {term.whyYouCare && (
        <div className="mt-3 rounded-md border-2 border-neutral bg-surface px-3 py-2">
          <p className="font-label text-[10px] text-primary">Why you care</p>
          <p className="mt-0.5 text-[13px] font-bold leading-snug text-text">{term.whyYouCare}</p>
        </div>
      )}
      {term.role && (
        <div className="mt-3 rounded-md bg-accent-soft px-3 py-2">
          <p className="font-label text-[10px] text-tertiary">Your role</p>
          <p className="mt-0.5 text-[13px] font-bold leading-snug text-text">{term.role}</p>
        </div>
      )}
    </div>
  )
}
