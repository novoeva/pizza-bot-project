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

  const instruction = (sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · Free pizza for life</p>
      <h1 className="text-2xl leading-tight">Guardrails</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">{sub}</p>
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
        <h2 className="text-2xl">You just learned the term Guardrails</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Same attacks, same bot — the only thing that changed was whether limits were set in
            advance. You've now personally exploited every hole, so you know exactly what each rule
            protects against.
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

  if (phase === 'defend') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(`Round 2 — your guardrails, under attack · ${attackIndex + 1} / ${attacks.length}`)}

        <p className="rounded-md border-[3px] border-success bg-success-bg px-3 py-2 text-center font-label text-sm font-bold text-success shadow-pop">
          Damage: $0
        </p>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-5 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">{current.line}</p>
        </div>

        {!tried ? (
          <button
            type="button"
            onClick={() => setTried(true)}
            className="press rounded-md border-[3px] border-cheese-dim bg-cheese-bg py-3 font-label font-bold text-cheese-dim shadow-pop"
          >
            Try it again
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md border-[3px] border-success bg-success-bg px-4 py-3 shadow-pop">
              <p className="text-text">{current.guardedReply}</p>
              <p className="mt-1 flex items-center gap-1 font-label text-[11px] font-bold text-success">
                <span className="material-symbols-rounded text-[15px]">shield</span>
                Blocked by your guardrail — no damage.
              </p>
            </div>
            <button
              type="button"
              onClick={nextDefend}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              {isLastAttack ? 'See the final damage' : 'Next attack'}
            </button>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'configure') {
    return (
      <div className="flex flex-col gap-3">
        {instruction('Switch sides — set the guardrails, informed by exactly what just went wrong.')}
        <div className="flex flex-col gap-4">
          {guardrailCategories.map((c) => (
            <div key={c.id}>
              <p className="mb-1 font-label text-[11px] text-text-muted">{c.name}</p>
              <div className="flex flex-col gap-2">
                {c.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pickCategory(c.id, opt)}
                    className={
                      'press rounded-md border-[3px] px-3 py-2 text-left text-sm font-bold shadow-pop ' +
                      (picks[c.id] === opt
                        ? 'border-neutral bg-accent-soft text-tertiary'
                        : 'border-neutral bg-surface text-text-muted')
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
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop disabled:opacity-40"
        >
          <span className="material-symbols-rounded">shield</span>
          Set guardrails
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {instruction(`Round 1 — no guardrails, you're the attacker · ${attackIndex + 1} / ${attacks.length}`)}

      <p className="rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2 text-center font-label text-sm font-bold text-danger shadow-pop">
        Damage: ${damage}
      </p>

      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-5 text-center shadow-pop">
        <p className="text-lg font-extrabold leading-snug">{current.line}</p>
      </div>

      {!tried ? (
        <button
          type="button"
          onClick={tryAttack}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Send it
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-md border-[3px] border-danger bg-danger-bg px-4 py-3 shadow-pop">
            <p className="text-text">{current.noGuardrailReply}</p>
            <p className="mt-1 flex items-center gap-1 font-label text-[11px] font-bold text-danger">
              <span className="material-symbols-rounded text-[15px]">bolt</span>
              It worked. -${current.damage}
            </p>
          </div>
          <button
            type="button"
            onClick={nextAttack}
            className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-tertiary py-3 font-label font-bold text-white shadow-pop"
          >
            <span className="material-symbols-rounded">arrow_forward</span>
            {isLastAttack ? 'Okay, that has to stop' : 'Try another trick'}
          </button>
        </div>
      )}
    </div>
  )
}
