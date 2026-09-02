import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { attacks, guardrailCategories } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'

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

  // Progress: part 1 attacks / part 2 your limits, and the customer (or limit)
  // you are on inside it.
  const progress =
    phase === 'configure'
      ? { part: 2, parts: 2, step: Object.keys(picks).length, steps: guardrailCategories.length }
      : { part: phase === 'defend' ? 2 : 1, parts: 2, step: attackIndex + 1, steps: attacks.length }

  // Left column: constant orientation (what guardrails are + Your role).
  const stage = (main) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} progress={progress} />
  )

  // Per-phase instruction, at the top of the right column so it's always the
  // current step. The term name/role live on the left, so this stays slim.
  const instruction = (part, sub) => (
    <PhaseCard title={`Free pizza for life · Part ${part}`}>{sub}</PhaseCard>
  )

  // The customer's trick as a received MESSAGE.
  const customerBubble = (whoLabel) => (
    <ChatMessage from="customer" label={whoLabel}>
      {current.customer}
    </ChatMessage>
  )

  // Bot's reply as a plain sent MESSAGE; the verdict is the Callout right
  // under it (held = success, caved = problem) and says who it worked for.
  const botBubble = (text, tone) =>
    tone === 'held' ? (
      <>
        <ChatMessage from="bot">{text}</ChatMessage>
        <Callout tone="success" title="Blocked by your guardrail. You lost nothing." icon="shield" compact />
      </>
    ) : (
      <>
        <ChatMessage from="bot">{text}</ChatMessage>
        <Callout
          tone="problem"
          title={`It worked for the customer. You lost $${current.damage}.`}
          icon="bolt"
          compact
        >
          {current.scaleNote ?? 'Your bot gave away exactly what they asked for.'}
        </Callout>
      </>
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

        <Callout tone="info" title="In the real world">
          Picking safe options like this is only the start. A real bot needs much stronger
          guardrails, enforced in code and tested against attackers, not just written as
          instructions a clever customer can talk it out of.
        </Callout>

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
        {instruction(2, 'Your guardrails, under attack.')}

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
            <ChoiceGroup key={c.id} mode="radio" label={`Limit ${i + 1} · ${c.name}`}>
              {c.options.map((opt) => (
                <SelectableCard
                  key={opt}
                  mode="radio"
                  label={opt}
                  selected={picks[c.id] === opt}
                  onSelect={() => pickCategory(c.id, opt)}
                />
              ))}
            </ChoiceGroup>
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
      {instruction(1, 'Your bot has no guardrails yet. Watch pushy customers talk it into anything.')}

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
