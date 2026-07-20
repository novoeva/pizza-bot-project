import { useState } from 'react'
import { attacks, guardrailCategories } from './content.js'
import terms from '../../content/terms.json'

/**
 * Guardrails game — { termId, onComplete } interface.
 * "Free pizza for life": the player plays the attacker first — every trick
 * works, damage climbs. Then they switch sides, set the limits themselves,
 * and the same attacks land on their own rules instead.
 */
export default function GuardrailsGame({ termId, onComplete }) {
  const [attackIndex, setAttackIndex] = useState(0)
  const [tried, setTried] = useState(false)
  const [damage, setDamage] = useState(0)
  const [picks, setPicks] = useState({})
  const [phase, setPhase] = useState('attack') // 'attack' | 'configure' | 'defend' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const current = attacks[attackIndex]
  const isLastAttack = attackIndex === attacks.length - 1
  const allPicked = guardrailCategories.every((c) => picks[c.id])

  function tryAttack() {
    setTried(true)
    setDamage((d) => d + current.damage)
  }

  function nextAttack() {
    if (isLastAttack) {
      setPhase('configure')
      return
    }
    setAttackIndex((i) => i + 1)
    setTried(false)
  }

  function pickCategory(id, value) {
    setPicks((p) => ({ ...p, [id]: value }))
  }

  function startDefend() {
    setAttackIndex(0)
    setTried(false)
    setPhase('defend')
  }

  function nextDefend() {
    if (isLastAttack) {
      setPhase('reveal')
      return
    }
    setAttackIndex((i) => i + 1)
    setTried(false)
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Same attacks, same bot — the only thing that changed was whether limits were set in
          advance. You've now personally exploited every hole, so you know exactly what each rule
          protects against.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Guardrails</h2>
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

  if (phase === 'defend') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-text-dim">
          <span>Round 2 — your guardrails, under attack</span>
          <span>
            {attackIndex + 1} / {attacks.length}
          </span>
        </div>

        <p className="rounded-md bg-success-bg border border-success px-3 py-2 text-center text-success text-sm font-medium">
          Damage: $0
        </p>

        <div className="rounded-md bg-surface px-4 py-6 text-center">
          <p className="text-lg font-medium">{current.line}</p>
        </div>

        {!tried ? (
          <button
            type="button"
            onClick={() => setTried(true)}
            className="rounded-md bg-cheese/20 border-2 border-cheese text-cheese font-semibold py-3 active:scale-[0.98] transition-transform"
          >
            Try it again
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md bg-success-bg border border-success px-4 py-3">
              <p className="text-text">{current.guardedReply}</p>
              <p className="text-success text-xs mt-1">🛡️ Blocked by your guardrail — no damage.</p>
            </div>
            <button
              type="button"
              onClick={nextDefend}
              className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
            >
              {isLastAttack ? 'See the final damage →' : 'Next attack →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'configure') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">
          Switch sides — set the guardrails, informed by exactly what just went wrong.
        </p>
        <div className="flex flex-col gap-4">
          {guardrailCategories.map((c) => (
            <div key={c.id}>
              <p className="text-xs text-text-dim mb-1">{c.name}</p>
              <div className="flex flex-col gap-2">
                {c.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pickCategory(c.id, opt)}
                    className={
                      'rounded-md border px-3 py-2 text-sm text-left transition-colors ' +
                      (picks[c.id] === opt
                        ? 'bg-cheese/20 border-cheese text-cheese font-semibold'
                        : 'bg-surface border-border text-text-muted hover:bg-surface-hover')
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={!allPicked}
          onClick={startDefend}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform disabled:opacity-40"
        >
          Set guardrails →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-text-dim">
        <span>Round 1 — no guardrails, you're the attacker</span>
        <span>
          {attackIndex + 1} / {attacks.length}
        </span>
      </div>

      <p className="rounded-md bg-danger-bg border border-danger px-3 py-2 text-center text-danger text-sm font-medium">
        Damage: ${damage}
      </p>

      <div className="rounded-md bg-surface px-4 py-6 text-center">
        <p className="text-lg font-medium">{current.line}</p>
      </div>

      {!tried ? (
        <button
          type="button"
          onClick={tryAttack}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Send it →
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-md bg-danger-bg border border-danger px-4 py-3">
            <p className="text-text">{current.noGuardrailReply}</p>
            <p className="text-danger text-xs mt-1">💥 It worked. -${current.damage}</p>
          </div>
          <button
            type="button"
            onClick={nextAttack}
            className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
          >
            {isLastAttack ? 'Okay, that has to stop →' : 'Try another trick →'}
          </button>
        </div>
      )}
    </div>
  )
}
