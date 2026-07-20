import { useState } from 'react'
import { customerRequest, round1Options, round2Categories, round3Categories } from './rounds.js'
import terms from '../../content/terms.json'

function CategoryPicker({ category, value, onPick }) {
  return (
    <div>
      <p className="text-xs text-text-dim mb-1">{category.name}</p>
      <div className="flex flex-wrap gap-2">
        {category.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(category.name, opt)}
            className={
              'rounded-md border px-3 py-2 text-sm transition-colors ' +
              (value === opt
                ? 'bg-cheese/20 border-cheese text-cheese font-semibold'
                : 'bg-surface border-border text-text-muted hover:bg-surface-hover')
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
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Same bot, same customer, same order — the only thing that changed was how specific the
          instruction got. That's the whole trick to better AI answers: refine the prompt, don't
          just retry your luck.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Prompt</h2>
          <p className="text-text">{term.definition}</p>
        </div>

        <div className="rounded-md bg-bg-raised border border-border px-4 py-4">
          <p className="text-text-muted text-sm">
            <span className="font-semibold text-info">Why you care: </span>
            {term.whyYouCare}
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          className="mt-2 rounded-md bg-tomato text-text font-semibold py-3 shadow-pop active:scale-[0.98] transition-transform"
        >
          Snap it onto your bot →
        </button>
      </div>
    )
  }

  const customerBanner = (
    <div className="rounded-md bg-bg-raised border border-border px-4 py-3 text-sm">
      <span className="text-text-dim">Customer wants: </span>
      <span className="text-text font-medium">{customerRequest}</span>
    </div>
  )

  if (phase === 'round3-result') {
    return (
      <div className="flex flex-col gap-4">
        {customerBanner}
        <div className="rounded-md bg-success-bg border border-success px-4 py-6 text-center">
          <p className="text-success font-semibold mb-2">Round 3 — fully specific prompt</p>
          <p className="text-text">
            A medium pepperoni pizza, thin crust, no onions. Exactly right. The customer is
            delighted.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          See what this means →
        </button>
      </div>
    )
  }

  if (phase === 'round3') {
    return (
      <div className="flex flex-col gap-4">
        {customerBanner}
        <p className="text-xs text-text-muted text-center">Round 3 / 3 — every fragment is now specific.</p>
        <div className="flex flex-col gap-4">
          {round3Categories.map((c) => (
            <CategoryPicker key={c.name} category={c} value={round3Picks[c.name]} onPick={pickRound3} />
          ))}
        </div>
        {round3Mismatch && (
          <p className="text-danger text-sm text-center">
            Not quite what the customer asked for — check the order above and adjust.
          </p>
        )}
        <button
          type="button"
          disabled={!round3Complete}
          onClick={submitRound3}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          Send to kitchen →
        </button>
      </div>
    )
  }

  if (phase === 'round2-result') {
    return (
      <div className="flex flex-col gap-4">
        {customerBanner}
        <div className="rounded-md bg-bg-raised border border-border px-4 py-6 text-center">
          <p className="text-text-dim text-xs mb-2">Round 2 result</p>
          <p className="text-text">
            {round2Matched
              ? `A ${round2Picks.Size.toLowerCase()} ${round2Picks.Toppings.toLowerCase()} pizza arrives — right size, right topping!`
              : `A ${round2Picks.Size.toLowerCase()} ${round2Picks.Toppings.toLowerCase()} pizza arrives — not quite what was ordered.`}
            {' '}Nobody specified the crust or the onions, so the bot guessed: thick crust, piled
            high with onions.
          </p>
        </div>
        <p className="text-text-muted text-sm text-center">
          Closer — but anything left vague still gets guessed for you.
        </p>
        <button
          type="button"
          onClick={() => setPhase('round3')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Unlock more specific fragments →
        </button>
      </div>
    )
  }

  if (phase === 'round2') {
    return (
      <div className="flex flex-col gap-4">
        {customerBanner}
        <p className="text-xs text-text-muted text-center">Round 2 / 3 — size and toppings are now specific.</p>
        <div className="flex flex-col gap-4">
          {round2Categories.map((c) => (
            <CategoryPicker key={c.name} category={c} value={round2Picks[c.name]} onPick={pickRound2} />
          ))}
        </div>
        <button
          type="button"
          disabled={!round2Complete}
          onClick={() => setPhase('round2-result')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          Send to kitchen →
        </button>
      </div>
    )
  }

  if (round1Result) {
    return (
      <div className="flex flex-col gap-4">
        {customerBanner}
        <div className="rounded-md bg-danger-bg border border-danger px-4 py-6 text-center">
          <p className="text-danger text-xs mb-2">You said: {round1Result.label}</p>
          <p className="text-text">{round1Result.result}</p>
        </div>
        <p className="text-text-muted text-sm text-center">The bot did exactly what it was told. That was the problem.</p>
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Try a more specific prompt →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {customerBanner}
      <p className="text-xs text-text-muted text-center">Round 1 / 3 — only vague instructions available.</p>
      <div className="flex flex-col gap-3">
        {round1Options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => pickRound1(opt)}
            className="rounded-md bg-surface border-2 border-border text-text font-medium py-4 px-3 text-left active:scale-[0.98] transition-transform"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
