import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import {
  customerRequest,
  round1Options,
  round1Result,
  round2Options,
  round3Categories,
  round3Result,
  round3Effects,
} from './rounds.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

function CategoryPicker({ category, value, onPick }) {
  return (
    <div>
      <p className="mb-1 font-label text-[11px] text-text-muted">{category.name}</p>
      <div className="flex flex-wrap gap-2">
        {category.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(category.name, opt)}
            className={
              'press rounded-md border-[3px] px-3 py-2 text-sm font-bold ' +
              (value === opt
                ? 'border-neutral bg-accent-soft text-tertiary shadow-pop'
                : 'border-neutral bg-surface text-text-muted shadow-pop')
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Prompt game, { termId, onComplete } interface.
 * "You build the bot": the customer stays vague every round; the player writes
 * the bot's instructions. Round 1's bare instruction lets the bot invent an
 * order, round 2 adds the rule that turns "invent" into "ask", round 3
 * assembles the full instructions and the same vague customer is handled well.
 */
export default function PromptGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('round1')
  const [round2Pick, setRound2Pick] = useState(null)
  const [round3Picks, setRound3Picks] = useState({})

  useGameScroll(phase)

  const term = terms.find((t) => t.id === termId)

  function pickRound3(name, value) {
    setRound3Picks((p) => ({ ...p, [name]: value }))
  }

  const round3Complete = round3Categories.every((c) => round3Picks[c.name])

  const customerBanner = (
    <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 text-sm shadow-pop">
      <span className="font-label text-[11px] text-text-muted">Customer says </span>
      <span className="font-bold text-text">{customerRequest}</span>
    </div>
  )

  const instruction = (round, sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · You build the bot</p>
      <h1 className="text-2xl leading-tight">Prompt</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">
        Round {round} / 3, {sub}
      </p>
    </div>
  )

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term Prompt</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">Why you care</p>
          <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
        </div>

        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={onComplete}>
            Snap it onto your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round3-result') {
    const wrongRows = round3Categories.filter((c) => round3Picks[c.name] !== c.correct)
    const allRight = wrongRows.length === 0
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        {allRight ? (
          <div className="rounded-lg border-[3px] border-neutral bg-success-bg p-4 text-center shadow-card">
            <p className="mb-2 font-label text-[11px] font-bold text-success">
              Round 3, full instructions
            </p>
            <p className="text-[15px] leading-snug text-text">{round3Result}</p>
          </div>
        ) : (
          <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 shadow-card">
            <p className="mb-3 text-center font-label text-[11px] font-bold text-primary">
              Your bot runs, but a few of these choices will cause problems
            </p>
            <div className="flex flex-col gap-3">
              {wrongRows.map((c) => (
                <div key={c.name} className="rounded-md border-2 border-neutral bg-muted px-3 py-2 text-left">
                  <p className="font-label text-[10px] text-text-muted">{c.name}</p>
                  <p className="mt-0.5 text-[14px] leading-snug text-text">
                    You picked <span className="font-bold">“{round3Picks[c.name]}”</span>, it{' '}
                    {round3Effects[round3Picks[c.name]]}.
                  </p>
                  <p className="mt-1 text-[14px] leading-snug text-success">
                    Better: <span className="font-bold">“{c.correct}”</span>, it{' '}
                    {round3Effects[c.correct]}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <GameActions>
          {!allRight && (
            <GameActionButton variant="neutral" icon="tune" onClick={() => setPhase('round3')}>
              Adjust my bot
            </GameActionButton>
          )}
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
            See what this means
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round3') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(3, 'assemble your bot’s full instructions.')}
        {customerBanner}
        <div className="flex flex-col gap-4">
          {round3Categories.map((c) => (
            <CategoryPicker
              key={c.name}
              category={c}
              value={round3Picks[c.name]}
              onPick={pickRound3}
            />
          ))}
        </div>
        <GameActions>
          <GameActionButton
            variant="primary"
            icon="send"
            disabled={!round3Complete}
            onClick={() => setPhase('round3-result')}
          >
            Switch this bot on
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round2-result') {
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        <div
          className={
            'rounded-lg border-[3px] border-neutral p-4 text-center shadow-card ' +
            (round2Pick.correct ? 'bg-success-bg' : 'bg-danger-bg')
          }
        >
          <p
            className={
              'mb-2 font-label text-[11px] font-bold ' +
              (round2Pick.correct ? 'text-success' : 'text-danger')
            }
          >
            You added: {round2Pick.label}
          </p>
          <p className="text-[15px] leading-snug text-text">{round2Pick.result}</p>
        </div>
        {round2Pick.correct ? (
          <>
            <p className="text-center font-label text-[11px] text-text-muted">
              One sentence changed the behavior, not the customer.
            </p>
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('round3')}>
                Write the bot’s full instructions
              </GameActionButton>
            </GameActions>
          </>
        ) : (
          <GameActions>
            <GameActionButton
              variant="primary"
              icon="refresh"
              onClick={() => {
                setRound2Pick(null)
                setPhase('round2')
              }}
            >
              Try another rule
            </GameActionButton>
          </GameActions>
        )}
      </div>
    )
  }

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(2, 'your bot invents things. Add one rule to stop it.')}
        {customerBanner}
        <div className="flex flex-col gap-2">
          {round2Options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                setRound2Pick(opt)
                setPhase('round2-result')
              }}
              className="press rounded-md border-[3px] border-neutral bg-surface px-3 py-4 text-left font-bold text-text shadow-pop"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'round1-result') {
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        <div className="rounded-lg border-[3px] border-neutral bg-danger-bg p-4 text-center shadow-card">
          <p className="mb-2 font-label text-[11px] font-bold text-danger">
            Your bot's instructions were missing too much
          </p>
          <p className="text-[15px] leading-snug text-text">{round1Result}</p>
        </div>
        <p className="text-center font-label text-[11px] text-text-muted">
          You never told it what to do when the order is incomplete, so it decided for you.
        </p>
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('round2')}>
            Add a rule to your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <GameIntro term={term} />
      {customerBanner}
      <p className="font-label text-[11px] text-text-muted">
        Pick the instruction you’ll give your bot:
      </p>
      <div className="flex flex-col gap-2">
        {round1Options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setPhase('round1-result')}
            className="press rounded-md border-[3px] border-neutral bg-surface px-3 py-4 text-left font-bold text-text shadow-pop"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
