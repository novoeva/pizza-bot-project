import { useState } from 'react'
import { menu, rounds } from './content.js'
import terms from '../../content/terms.json'

/**
 * Hallucination game — { termId, onComplete } interface.
 * "Spot the fake": the bot answers with the exact same confidence whether it
 * knows the answer or invented it (a BOT CONFIDENCE bar pinned at 100% for
 * every claim). The player checks each claim against the real menu and taps
 * Trust it / Made up — teaching that confidence isn't the same as correctness.
 */
export default function HallucinationGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([]) // ('correct' | 'wrong')[]
  const [pick, setPick] = useState(null) // null | 'trust' | 'fake'
  const [done, setDone] = useState(false)

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
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned Hallucination</h2>
        <p className="font-label text-xs text-text-muted">
          You caught {score} of {rounds.length} made-up answers.
        </p>

        <div className="mt-1 rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
          <p className="mt-3 text-[15px] leading-snug text-text-muted">
            <span className="font-semibold text-tertiary">Why you care: </span>
            {term.whyYouCare}
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="press mt-2 flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-5 py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Snap it onto your bot
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Instruction */}
      <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
        <p className="font-label text-[11px] text-primary">Game · Reality-check filter</p>
        <h1 className="text-2xl leading-tight">Hallucination</h1>
        <p className="mt-1 text-[13px] leading-snug text-text-muted">
          The bot sounds equally sure whether it knows the answer or invented it. Check each claim
          against the real menu and catch the fakes.
        </p>
      </div>

      {/* Reference menu */}
      <div className="overflow-hidden rounded-md border-[3px] border-neutral bg-surface">
        <div className="flex items-center gap-1.5 border-b-[3px] border-neutral bg-muted px-3 py-1.5 font-label text-[11px] text-text-muted">
          <span className="material-symbols-rounded text-[15px]">menu_book</span>
          Today's real menu
        </div>
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
      </div>

      {/* Round tracker */}
      <div className="flex justify-center gap-1.5">
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
                    ? 'bg-primary'
                    : i === index
                      ? 'bg-accent'
                      : 'bg-transparent')
              }
            />
          )
        })}
      </div>

      {/* The claim — fixed height so it never resizes */}
      <div className="flex h-[150px] flex-col overflow-hidden rounded-md border-[3px] border-neutral bg-surface shadow-card">
        <div className="flex items-center justify-between bg-text px-3 py-1.5 font-label text-[10px] text-white">
          <span>Bot says</span>
          <span className="flex items-center gap-2">
            Bot confidence 100%
            <span className="h-2 w-14 overflow-hidden rounded-full bg-white/25">
              <span className="block h-full w-full bg-success" />
            </span>
          </span>
        </div>
        <div className="flex flex-1 items-center gap-3 px-4">
          <BotAvatar />
          <p className="text-[1.05rem] font-extrabold leading-snug">&ldquo;{round.say}&rdquo;</p>
        </div>
      </div>

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

      {/* Feedback + advance */}
      {pick && (
        <>
          <Feedback correct={results[index] === 'correct'} round={round} />
          <button
            type="button"
            onClick={next}
            className="press flex w-full items-center justify-center rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
          >
            {isLast ? 'See result' : 'Next question'}
          </button>
        </>
      )}
    </div>
  )
}

function Feedback({ correct, round }) {
  return (
    <div
      className={
        'rounded-md border-[3px] border-neutral p-3 shadow-pop ' +
        (correct ? 'bg-success-bg' : 'bg-danger-bg')
      }
    >
      <p
        className={
          'flex items-center gap-1.5 font-label text-sm font-bold ' +
          (correct ? 'text-success' : 'text-danger')
        }
      >
        <span className="material-symbols-rounded text-[18px]">
          {correct ? 'check_circle' : 'cancel'}
        </span>
        {correct ? 'Caught it' : 'Fooled you'}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-text">
        {correct ? round.whyRight : round.whyWrong}
      </p>
    </div>
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
