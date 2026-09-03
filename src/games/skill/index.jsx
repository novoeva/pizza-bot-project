import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { complaint, improvisedReplies, playbookSteps } from './content.js'
import terms from '../../content/terms.json'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import PartTile from '../../components/PartTile.jsx'
import SlotList from '../../components/SlotList.jsx'
import { useFirstTimeHint } from '../../lib/useFirstTimeHint.js'

// Fixed shuffle so the buttons don't appear in a suggestive top-to-bottom order.
const shuffledSteps = [playbookSteps[2], playbookSteps[0], playbookSteps[3], playbookSteps[1]]

/**
 * Skill game, { termId, onComplete } interface.
 * "The complaint department": round 1 shows the same complaint getting three
 * wildly different improvised responses. Round 2, the player builds the
 * playbook step by step, then the same complaint gets identical, calm
 * handling every time.
 */
export default function SkillGame({ termId, onComplete }) {
  const [replyIndex, setReplyIndex] = useState(0)
  const [builtSteps, setBuiltSteps] = useState([])
  const [phase, setPhase] = useState('round1') // 'round1' | 'build' | 'round2' | 'reveal'

  useGameScroll(phase, replyIndex)

  const term = terms.find((t) => t.id === termId)
  const isLastReply = replyIndex === improvisedReplies.length - 1

  const hint = useFirstTimeHint(phase === 'build')

  function tapStep(id) {
    if (builtSteps.includes(id)) return
    const next = [...builtSteps, id]
    setBuiltSteps(next)
    if (next.length === playbookSteps.length) {
      setPhase('round2')
    }
  }
  function removeStep(index) {
    setBuiltSteps((b) => b.filter((_, i) => i !== index))
  }

  // Round 2 uses the player's own order: the point is consistency, not a "right" sequence.
  const builtPlaybook = builtSteps.map((id) => playbookSteps.find((s) => s.id === id))

  // Progress: 1 no process (three customers) · 2 build the playbook (four
  // steps) · 3 with the playbook.
  const progress =
    phase === 'build'
      ? { part: 2, parts: 3, step: builtSteps.length, steps: playbookSteps.length }
      : phase === 'round2'
        ? { part: 3, parts: 3 }
        : { part: 1, parts: 3, step: replyIndex + 1, steps: improvisedReplies.length }

  // Left column: constant orientation (what a skill is + Your role).
  const stage = (main) => (
    <GameStage term={term} main={main} progress={progress} />
  )

  const instruction = (part, sub) => (
    <PhaseCard title={`The complaint department · Part ${part}`}>{sub}</PhaseCard>
  )

  // The complaint as a received MESSAGE; the bot's reply as a sent one whose
  // tint is the verdict: 'good' (on-script) / 'bad' (improvised).
  const customerBubble = (text) => <ChatMessage from="customer">{text}</ChatMessage>
  const botBubble = (key, text, tone, note) => (
    <ChatMessage key={key} from="bot" label={`Your bot · ${note}`}>
      {text}
    </ChatMessage>
  )

  // The playbook is a SlotList (a part of your bot, amber); the steps on the
  // shelf are PartTiles you drag (or tap) into it. Order = the order you
  // handle a complaint.
  const playbookItems = builtPlaybook.map((s) => ({ id: s.id, label: s.label }))
  const firstFree = shuffledSteps.findIndex((s) => !builtSteps.includes(s.id))

  if (phase === 'reveal') {
    return (
      <TermReveal term={term} onComplete={onComplete} />
    )
  }

  if (phase === 'round2') {
    const script = builtPlaybook.map((s) => s.scripted).join(' ')
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(3, 'Same complaint, three times — now handled by your playbook, identically.')}
        <SlotList title="Your playbook" capacity={playbookSteps.length} items={playbookItems} />
        {customerBubble(complaint)}
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => botBubble(i, script, 'good', `Customer ${i + 1}`))}
        </div>
        <Callout tone="success" title="Same answer, three times" compact>
          Your playbook, not the bot's mood, decided what happened.
        </Callout>
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
            See what this means
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'build') {
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(2, 'Build the playbook. Drag or tap the steps into it in the order you would handle a complaint.')}
        <SlotList
          title="Your playbook"
          capacity={playbookSteps.length}
          items={playbookItems}
          accepts={playbookSteps.map((s) => s.id)}
          onDrop={tapStep}
          onRemove={removeStep}
          emptyTapLabel="tap a step to add it…"
          pulse={hint}
        />
        <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
          <span className="material-symbols-rounded text-[15px]">handyman</span>
          Steps · drag into the playbook
        </p>
        <div className="flex flex-col gap-2">
          {shuffledSteps.map((step, i) => (
            <PartTile
              key={step.id}
              id={step.id}
              label={step.label}
              used={builtSteps.includes(step.id)}
              usedLabel="in the playbook"
              onAdd={() => tapStep(step.id)}
              wiggle={hint && i === firstFree}
            />
          ))}
        </div>
      </div>
    )
  }

  return stage(
    <div className="flex flex-col gap-3">
      {instruction(
        1,
        'No set process yet. Same complaint, but your bot improvises a different answer every time.',
      )}
      {customerBubble(complaint)}
      <div className="flex flex-col gap-2">
        {improvisedReplies
          .slice(0, replyIndex + 1)
          .map((reply, i) => botBubble(i, reply, 'bad', `Customer ${i + 1}`))}
      </div>
      <Callout
        tone="problem"
        title={
          replyIndex === 0
            ? 'One customer, one improvised answer'
            : `${replyIndex + 1} customers, ${replyIndex + 1} different answers`
        }
        compact
      >
        No process, so the bot improvises every time.
      </Callout>
      {!isLastReply ? (
        <GameActions>
          <GameActionButton
            variant="accent"
            icon="arrow_forward"
            onClick={() => setReplyIndex((i) => i + 1)}
          >
            Next customer
          </GameActionButton>
        </GameActions>
      ) : (
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('build')}>
            Build a playbook
          </GameActionButton>
        </GameActions>
      )}
    </div>
  )
}
