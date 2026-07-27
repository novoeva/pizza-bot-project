import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { attacks, guardrailCategories } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

/**
 * Guardrails game, { termId, onComplete } interface.
 * "Free pizza for life": the player plays the attacker first, every trick
 * works, damage climbs. Then they switch sides, set the limits themselves,
 * and the same attacks land on their own rules instead.
 */
export default function GuardrailsGame({ termId, onComplete }) {
  const [attackIndex, setAttackIndex] = useState(0)
  const [tried, setTried] = useState(false)
  const [damage, setDamage] = useState(0)
  const [picks, setPicks] = useState({})
  const [phase, setPhase] = useState('attack') // 'attack' | 'configure' | 'defend' | 'reveal'

  useGameScroll(`${phase}:${attackIndex}`)

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

  const customerBubble = (whoLabel) => (
    <div className="flex flex-col gap-1">
      <p className="flex items-center gap-1 font-label text-[11px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">person</span>
        {whoLabel}
      </p>
      <div className="rounded-md rounded-tl-none border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
        <p className="font-bold leading-snug">{current.customer}</p>
      </div>
    </div>
  )

  const botBubble = (text, tone) => (
    <div className="flex flex-col items-end gap-1">
      <p className="flex items-center gap-1 font-label text-[11px] text-text-muted">
        <span className="material-symbols-rounded text-[15px]">smart_toy</span>
        Pizza bot
      </p>
      <div
        className={
          'rounded-md rounded-tr-none border-[3px] px-4 py-3 shadow-pop ' +
          (tone === 'held' ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg')
        }
      >
        <p className="leading-snug text-text">{text}</p>
        {tone === 'held' ? (
          <p className="mt-1 flex items-center gap-1 font-label text-[11px] font-bold text-success">
            <span className="material-symbols-rounded text-[15px]">shield</span>
            Blocked by your guardrail, no damage.
          </p>
        ) : (
          <div>
            <p className="flex items-center gap-1 font-label text-[11px] font-bold text-danger">
              <span className="material-symbols-rounded text-[15px]">bolt</span>
              It worked. -${current.damage}
            </p>
            {current.scaleNote && (
              <p className="mt-1 flex items-start gap-1 font-label text-[11px] text-danger">
                <span className="material-symbols-rounded text-[15px]">groups</span>
                {current.scaleNote}
              </p>
            )}
          </div>
        )}
      </div>
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

  if (phase === 'defend') {
    return (
      <div className="flex flex-col gap-3">
        {instruction(
          `Round 2, your guardrails, under attack · ${attackIndex + 1} / ${attacks.length}`,
        )}

        <p className="rounded-md border-[3px] border-success bg-success-bg px-3 py-2 text-center font-label text-sm font-bold text-success shadow-pop">
          Damage: $0
        </p>

        {customerBubble('Same customer, same trick')}

        {!tried ? (
          <GameActions>
            <GameActionButton variant="soft" onClick={() => setTried(true)}>
              See how your bot answers
            </GameActionButton>
          </GameActions>
        ) : (
          <div className="flex flex-col gap-3">
            {botBubble(current.guardedReply, 'held')}
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={nextDefend}>
                {isLastAttack ? 'See the final damage' : 'Next attack'}
              </GameActionButton>
            </GameActions>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'configure') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · Free pizza for life</p>
          <h1 className="text-2xl leading-tight">Guardrails</h1>
          <div className="mt-2 rounded-md border-2 border-neutral bg-muted px-3 py-2">
            <p className="font-label text-[10px] text-text-muted">How to play</p>
            <p className="mt-0.5 text-[13px] leading-snug text-text">
              Now switch sides. Set the limits so the same tricks can't break your bot again.
            </p>
          </div>
        </div>
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
        <GameActions>
          <GameActionButton variant="primary" icon="shield" disabled={!allPicked} onClick={startDefend}>
            Set guardrails
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {attackIndex === 0 ? (
        <GameIntro term={term} />
      ) : (
        instruction(
          `Round 1, no guardrails, you're the attacker · ${attackIndex + 1} / ${attacks.length}`,
        )
      )}

      <p className="rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2 text-center font-label text-sm font-bold text-danger shadow-pop">
        Damage: ${damage}
      </p>

      {customerBubble('You, playing the customer')}

      {!tried ? (
        <GameActions>
          <GameActionButton variant="primary" icon="send" onClick={tryAttack}>
            Send it to the bot
          </GameActionButton>
        </GameActions>
      ) : (
        <div className="flex flex-col gap-3">
          {botBubble(current.noGuardrailReply, 'caved')}
          <GameActions>
            <GameActionButton variant="accent" icon="arrow_forward" onClick={nextAttack}>
              {isLastAttack ? 'Okay, that has to stop' : 'Try another trick'}
            </GameActionButton>
          </GameActions>
        </div>
      )}
    </div>
  )
}
