import { useState } from 'react'
import { customerRequest, round1Options, round2Categories, round3Categories } from './rounds.js'
import terms from '../../content/terms.json'

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
 * Prompt game — { termId, onComplete } interface.
 * "Say what you mean": round 1 offers only vague fragments and the bot
 * obeys literally into an absurd pizza. Rounds 2–3 unlock specific
 * fragments (size, toppings, constraints) and the order converges.
 */
export default function PromptGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('round1')
  const [round1Result, setRound1Result] = useState(null)
  const [round2Picks, setRound2Picks] = useState({})
  const [round3Picks, setRound3Picks] = useState({})
  const [round3Mismatch, setRound3Mismatch] = useState(false)

  const term = terms.find((t) => t.id === termId)

  function pickRound1(option) {
    setRound1Result(option)
  }

  function pickRound2(name, value) {
    setRound2Picks((p) => ({ ...p, [name]: value }))
  }

  function pickRound3(name, value) {
    setRound3Mismatch(false)
    setRound3Picks((p) => ({ ...p, [name]: value }))
  }

  const round2Complete = round2Categories.every((c) => round2Picks[c.name])
  const round2Matched = round2Categories.every((c) => round2Picks[c.name] === c.correct)
  const round3Complete = round3Categories.every((c) => round3Picks[c.name])
  const round3Matched = round3Categories.every((c) => round3Picks[c.name] === c.correct)

  function submitRound3() {
    if (!round3Matched) {
      setRound3Mismatch(true)
      return
    }
    setPhase('round3-result')
  }

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

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Same bot, same customer, same order — the only thing that changed was how specific the
            instruction got. That's the whole trick to better AI answers: refine the prompt, don't
            just retry your luck.
          </p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
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

  const customerBanner = (
    <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-3 text-sm shadow-pop">
      <span className="font-label text-[11px] text-text-muted">Customer wants </span>
      <span className="font-bold text-text">{customerRequest}</span>
    </div>
  )

  const instruction = (round, sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · Say what you mean</p>
      <h1 className="text-2xl leading-tight">Prompt</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">
        Round {round} / 3 — {sub}
      </p>
    </div>
  )

  if (phase === 'round3-result') {
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        <div className="rounded-lg border-[3px] border-neutral bg-success-bg p-4 text-center shadow-card">
          <p className="mb-2 font-label text-[11px] font-bold text-success">
            Round 3 — fully specific prompt
          </p>
          <p className="text-[15px] leading-snug text-text">
            A medium pepperoni pizza, thin crust, no onions. Exactly right. The customer is
            delighted.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          See what this means
        </button>
      </div>
    )
  }

  if (phase === 'round3') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(3, 'every fragment is now specific.')}
        {customerBanner}
        <div className="flex flex-col gap-4">
          {round3Categories.map((c) => (
            <CategoryPicker key={c.name} category={c} value={round3Picks[c.name]} onPick={pickRound3} />
          ))}
        </div>
        {round3Mismatch && (
          <p className="rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2 text-center text-sm font-bold text-danger">
            Not quite what the customer asked for — check the order above and adjust.
          </p>
        )}
        <button
          type="button"
          disabled={!round3Complete}
          onClick={submitRound3}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop disabled:opacity-40"
        >
          <span className="material-symbols-rounded">send</span>
          Send to kitchen
        </button>
      </div>
    )
  }

  if (phase === 'round2-result') {
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-center shadow-card">
          <p className="mb-2 font-label text-[11px] text-text-muted">Round 2 result</p>
          <p className="text-[15px] leading-snug text-text">
            {round2Matched
              ? `A ${round2Picks.Size.toLowerCase()} ${round2Picks.Toppings.toLowerCase()} pizza arrives — right size, right topping!`
              : `A ${round2Picks.Size.toLowerCase()} ${round2Picks.Toppings.toLowerCase()} pizza arrives — not quite what was ordered.`}
            {' '}Nobody specified the crust or the onions, so the bot guessed: thick crust, piled
            high with onions.
          </p>
        </div>
        <p className="text-center font-label text-[11px] text-text-muted">
          Closer — but anything left vague still gets guessed for you.
        </p>
        <button
          type="button"
          onClick={() => setPhase('round3')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Unlock more specific fragments
        </button>
      </div>
    )
  }

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(2, 'size and toppings are now specific.')}
        {customerBanner}
        <div className="flex flex-col gap-4">
          {round2Categories.map((c) => (
            <CategoryPicker key={c.name} category={c} value={round2Picks[c.name]} onPick={pickRound2} />
          ))}
        </div>
        <button
          type="button"
          disabled={!round2Complete}
          onClick={() => setPhase('round2-result')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop disabled:opacity-40"
        >
          <span className="material-symbols-rounded">send</span>
          Send to kitchen
        </button>
      </div>
    )
  }

  if (round1Result) {
    return (
      <div className="flex flex-col gap-3">
        {customerBanner}
        <div className="rounded-lg border-[3px] border-neutral bg-danger-bg p-4 text-center shadow-card">
          <p className="mb-2 font-label text-[11px] font-bold text-danger">
            You said: {round1Result.label}
          </p>
          <p className="text-[15px] leading-snug text-text">{round1Result.result}</p>
        </div>
        <p className="text-center font-label text-[11px] text-text-muted">
          The bot did exactly what it was told. That was the problem.
        </p>
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Try a more specific prompt
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {instruction(1, 'only vague instructions available.')}
      {customerBanner}
      <div className="flex flex-col gap-2">
        {round1Options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => pickRound1(opt)}
            className="press rounded-md border-[3px] border-neutral bg-surface px-3 py-4 text-left font-bold text-text shadow-pop"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
