import GameActions, { GameActionButton } from './GameActions.jsx'

/**
 * TermReveal, the one end-of-game screen (step 3 of the framework, FR-13).
 * Every game ends the same way, so the recap looks the same in every game:
 *
 *   1. the success mark and "Snapped onto your bot · <part>"
 *   2. "You just learned the term <name>" (from data, never typed by hand)
 *   3. an optional one-line score from the game
 *   4. "What it means": the definition, the payoff kept back until now
 *   5. "What matters": 3–4 check lines (term.keyPoints), not a paragraph
 *   6. "Don't": 1–2 cross lines (term.dont), optional
 *   7. an optional aside the game passes in (a Callout), e.g. "Real talk"
 *   8. the pinned "Snap it onto your bot" action
 *
 * Content lives in content/terms.json (definition, keyPoints, dont).
 */
function Card({ label, children }) {
  return (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
      <p className="font-label text-[11px] text-text-muted">{label}</p>
      {children}
    </div>
  )
}

function Lines({ items, icon, tone }) {
  return (
    <ul className="mt-2 flex flex-col gap-2 text-[14px] leading-snug text-text">
      {items.map((line) => (
        <li key={line} className="flex items-start gap-2">
          <span className={'material-symbols-rounded fill mt-px shrink-0 text-[18px] ' + tone} aria-hidden="true">
            {icon}
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TermReveal({ term, score, aside, onComplete }) {
  return (
    <div className="flex flex-col gap-3 text-center">
      <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
        <span className="material-symbols-rounded fill text-5xl text-white">check</span>
      </div>
      <p className="font-label text-[11px] text-primary">Snapped onto your bot · {term.botPart}</p>
      <h2 className="text-2xl">You just learned the term {term.name}</h2>
      {score && <p className="font-label text-xs text-text-muted">{score}</p>}

      <Card label="What it means">
        <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
      </Card>

      {term.keyPoints?.length > 0 && (
        <Card label="What matters">
          <Lines items={term.keyPoints} icon="check_circle" tone="text-success" />
        </Card>
      )}

      {term.dont?.length > 0 && (
        <Card label="Don't">
          <Lines items={term.dont} icon="cancel" tone="text-danger" />
        </Card>
      )}

      {aside}

      <GameActions>
        <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
          Snap it onto your bot
        </GameActionButton>
      </GameActions>
    </div>
  )
}
