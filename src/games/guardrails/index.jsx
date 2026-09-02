import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { attacks, guardrailCategories } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
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

  // Left column: constant orientation (what guardrails are + Your role).
  const stage = (main) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} />
  )

  // Per-phase instruction, at the top of the right column so it's always the
  // current step. The term name/role live on the left, so this stays slim.
  const instruction = (part, sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <div className="flex items-center justify-between">
        <p className="font-label text-[11px] text-primary">Game · Free pizza for life</p>
        <span className="font-label text-[11px] text-text-muted">Part {part} of 2</span>
      </div>
      <p className="mt-1 text-[13px] leading-snug text-text-muted">{sub}</p>
    </div>
  )

  // Message archetype — a received message: avatar beside a rounded bubble with
  // a tail. Matches the shared look across games (see prompt).
  const customerBubble = (whoLabel) => (
    <div className="flex items-start gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-neutral bg-surface">
        <span className="material-symbols-rounded text-[20px] text-text-muted">person</span>
      </span>
      <div className="max-w-[85%]">
        <p className="mb-1 font-label text-[10px] text-text-muted">{whoLabel}</p>
        <div className="rounded-2xl rounded-tl-sm border-[3px] border-neutral bg-muted px-4 py-3 shadow-pop">
          <p className="font-bold leading-snug text-text">{current.customer}</p>
        </div>
      </div>
    </div>
  )

  // Bot's reply — a sent message: right-aligned, robot avatar. Keeps the
  // held (green) / caved (red) tone so the outcome still reads at a glance.
  const botBubble = (text, tone) => (
    <div className="flex items-start justify-end gap-2">
      <div className="max-w-[85%]">
        <p className="mb-1 text-right font-label text-[10px] text-text-muted">Pizza bot</p>
        <div
          className={
            'rounded-2xl rounded-tr-sm border-[3px] px-4 py-3 shadow-pop ' +
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-neutral bg-primary">
        <span className="material-symbols-rounded text-[20px] text-white">smart_toy</span>
      </span>
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

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-4 text-left shadow-pop">
          <p className="flex items-center gap-1 font-label text-[11px] text-text-muted">
            <span className="material-symbols-rounded text-[15px]">info</span>
            In the real world
          </p>
          <p className="mt-1 text-[15px] leading-snug">
            Picking safe options like this is only the start. A real bot needs much stronger
            guardrails, enforced in code and tested against attackers, not just written as
            instructions a clever customer can talk it out of.
          </p>
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
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(
          2,
          `Your guardrails, under attack · ${attackIndex + 1} / ${attacks.length}`,
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
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(2, "Now switch sides. Set the limits so the same tricks can't break your bot again.")}
        <div className="flex flex-col gap-4">
          {guardrailCategories.map((c, i) => (
            <div key={c.id}>
              <p className="mb-1 font-label text-[11px] text-text-muted">
                <span className="text-tertiary">Limit {i + 1} · </span>
                {c.name}
              </p>
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

  return stage(
    <div className="flex flex-col gap-3">
      {instruction(
        1,
        `Your bot has no guardrails yet. Watch pushy customers talk it into anything · ${attackIndex + 1} / ${attacks.length}`,
      )}

      <p className="flex items-center justify-center gap-2 rounded-md border-[3px] border-danger bg-danger-bg px-3 py-2 text-center font-label text-sm font-bold text-danger shadow-pop">
        <span className="material-symbols-rounded text-[18px]">gpp_bad</span>
        No guardrails · Damage ${damage}
      </p>

      {customerBubble('Customer')}

      {!tried ? (
        <GameActions>
          <GameActionButton variant="primary" icon="visibility" onClick={tryAttack}>
            See what your bot does with no guardrails
          </GameActionButton>
        </GameActions>
      ) : (
        <div className="flex flex-col gap-3">
          {botBubble(current.noGuardrailReply, 'caved')}
          <GameActions>
            <GameActionButton variant="accent" icon="arrow_forward" onClick={nextAttack}>
              {isLastAttack ? 'Okay, that has to stop' : 'See the next customer'}
            </GameActionButton>
          </GameActions>
        </div>
      )}
    </div>
  )
}
