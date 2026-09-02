import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { menu, rounds } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import Panel from '../../components/Panel.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'

/**
 * Hallucination game, { termId, onComplete } interface.
 * "Spot the fake": the bot answers with the exact same confidence whether it
 * knows the answer or invented it (a BOT CONFIDENCE bar pinned at 100% for
 * every claim). The player checks each claim against the real menu and taps
 * Trust it / Made up, teaching that confidence isn't the same as correctness.
 */
export default function HallucinationGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([]) // ('correct' | 'wrong')[]
  const [pick, setPick] = useState(null) // null | 'trust' | 'fake'
  const [done, setDone] = useState(false)

  // `pick` as the in-page `within` key: choosing Trust/Made up appends the
  // feedback + Next button below the choices, so reveal it instead of leaving
  // it stranded below the fold on taller (desktop/web) viewports.
  useGameScroll(`${index}:${done}`, pick || '')

  const round = rounds[index]
  const isLast = index === rounds.length - 1

  function choose(choice) {
    if (pick) return
    const trusted = choice === 'trust' // "trust" = claims it's real
    const correct = trusted === round.real
    setPick(choice)
    setResults((r) => [...r, correct ? 'correct' : 'wrong'])
  }

  function next() {
    if (isLast) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setPick(null)
  }

  if (done) {
    const score = results.filter((r) => r === 'correct').length
    return (
      <TermReveal term={term} score={`You caught ${score} of ${rounds.length} made-up answers.`} onComplete={onComplete} />
    )
  }

  // Left column: read-once orientation only — what the term is and how to play.
  const context = <GameIntro term={term} showHowTo={false} />

  // Right column: everything you actually play with, together — the reference
  // menu you check claims against, the claim progress, the claim itself, the
  // choices, and the feedback that lands in place once you pick.
  const main = (
    <>
      <PhaseCard title="Spot the fake">
        Check each answer against the real menu and catch the ones your bot made up.
      </PhaseCard>

      {/* Reference menu — a game tool (you check every claim against it), so it
          sits WITH the game, not off in the orientation column. */}
      <Panel header="brand" title="Today's real menu" icon="menu_book" shadow="none" bodyClassName="">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2">
          {menu.map(([name, price]) => (
            <li
              key={name}
              className="flex justify-between gap-2 border-b border-dotted border-slot-empty pb-0.5 text-[13px]"
            >
              <span className="font-bold">{name}</span>
              <span className="text-text-muted">{price}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Score so far: one dot per claim, green caught / red fooled. (Progress
          itself is the strip at the top of the screen.) */}
      <div className="flex items-center justify-between px-1">
        <p className="font-label text-[11px] text-text-muted">Your score so far</p>
        <div className="flex gap-1.5">
          {rounds.map((_, i) => {
            const r = results[i]
            return (
              <span
                key={i}
                className={
                  'h-2.5 w-2.5 rounded-full border-2 border-neutral ' +
                  (r === 'correct'
                    ? 'bg-success'
                    : r === 'wrong'
                      ? 'bg-danger'
                      : i === index
                        ? 'bg-accent'
                        : 'bg-transparent')
                }
              />
            )
          })}
        </div>
      </div>

      {/* The claim, fixed height so it never resizes */}
      <Panel
        header="label"
        title="Bot says"
        icon="smart_toy"
        shadow="card"
        className="flex h-[150px] flex-col"
        bodyClassName="flex flex-1 items-center gap-3 px-4"
        meta={
          <>
            Bot confidence 100%
            <span className="h-2 w-14 overflow-hidden rounded-full border border-neutral bg-surface">
              <span className="block h-full w-full bg-success" />
            </span>
          </>
        }
      >
        <BotAvatar />
        <p className="text-[1.05rem] font-extrabold leading-snug">&ldquo;{round.say}&rdquo;</p>
      </Panel>

      {/* Choices */}
      <div className={'flex gap-2 ' + (pick ? 'pointer-events-none opacity-50' : '')}>
        <button
          type="button"
          onClick={() => choose('trust')}
          className="press flex flex-1 items-center justify-center gap-1.5 rounded-md border-[3px] border-neutral bg-tertiary py-3 font-label text-sm font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded text-[18px]">check</span>
          Trust it
        </button>
        <button
          type="button"
          onClick={() => choose('fake')}
          className="press flex flex-1 items-center justify-center gap-1.5 rounded-md border-[3px] border-neutral bg-primary py-3 font-label text-sm font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded text-[18px]">flag</span>
          Made up
        </button>
      </div>

      {/* Feedback lands here, in place */}
      {pick && (
        <Callout
          tone={results[index] === 'correct' ? 'success' : 'problem'}
          title={results[index] === 'correct' ? 'Caught it' : 'Fooled you'}
          icon={results[index] === 'correct' ? 'check_circle' : 'cancel'}
          compact
        >
          {results[index] === 'correct' ? round.whyRight : round.whyWrong}
        </Callout>
      )}
    </>
  )

  return (
    <>
      <GameStage
        context={context}
        main={main}
        progress={{ part: 1, parts: 1, step: index + 1, steps: rounds.length }}
      />
      {pick && (
        <GameActions>
          <GameActionButton variant="primary" onClick={next}>
            {isLast ? 'See result' : 'Next question'}
          </GameActionButton>
        </GameActions>
      )}
    </>
  )
}

function BotAvatar() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-[3px] border-neutral bg-primary">
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <rect x="5" y="7" width="22" height="18" rx="6" fill="#fff" />
        <circle cx="12.5" cy="16" r="2.6" fill="var(--color-primary)" />
        <circle cx="19.5" cy="16" r="2.6" fill="var(--color-primary)" />
        <line x1="16" y1="7" x2="16" y2="3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="2.5" r="2" fill="#fff" />
      </svg>
    </span>
  )
}
