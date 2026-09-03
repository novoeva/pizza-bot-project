import { useEffect, useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { order, chatbotReply, actions, systems, fired, validateSequence } from './script.js'
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
import Panel from '../../components/Panel.jsx'

/**
 * Agent game, { termId, onComplete } interface.
 *
 * "From chat to agent." One idea: a chatbot only talks, an agent acts.
 *   1. Chat: the plain chatbot answers Marco with nice words; the real systems
 *      (Payment / Kitchen / Delivery) stay asleep. Nothing happened.
 *   2. Build: the player turns it into an agent by handing it real actions in a
 *      sensible order (check stock → charge → kitchen → driver).
 *   3. Run: each action fires and lights up its external system. Order matters:
 *      a bad sequence (driver before the kitchen cooked) fails and sends the
 *      player back to fix it. That dependency is why an agent has to act, not
 *      just talk.
 *
 * Layout + visual archetypes (see the pizza-bot-gamestage-layout and
 * pizza-bot-visual-archetypes memories): constant orientation lives LEFT via
 * GameStage; the current step's instruction sits at the top of the right
 * column; the customer's order reads as a chat MESSAGE (bubble + avatar), the
 * chatbot's empty reply as a bot MESSAGE, the actions you hand the bot as
 * colour-coded CHOICE cards, and the systems/fired feed as tinted RESULT cards.
 */
export default function AgentGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('chat') // 'chat' | 'build' | 'snag' | 'run' | 'reveal'
  const [seq, setSeq] = useState([]) // ordered action ids
  const [snag, setSnag] = useState(null) // { msg, lit }
  const [runIdx, setRunIdx] = useState(0) // how many actions have fired

  useGameScroll(phase)

  const full = seq.length === actions.length

  // During the run the agent fires one action at a time, ~750ms apart.
  useEffect(() => {
    if (phase !== 'run' || runIdx >= seq.length) return
    const t = setTimeout(() => setRunIdx((i) => i + 1), runIdx === 0 ? 650 : 750)
    return () => clearTimeout(t)
  }, [phase, runIdx, seq.length])

  const hint = useFirstTimeHint(phase === 'build')

  function add(id) {
    if (seq.length < actions.length && !seq.includes(id)) setSeq([...seq, id])
  }
  function removeAt(i) {
    setSeq(seq.filter((_, idx) => idx !== i))
  }
  function runAgent() {
    const bad = validateSequence(seq)
    if (bad) {
      setSnag(bad)
      setPhase('snag')
      return
    }
    setRunIdx(0)
    setPhase('run')
  }

  // Progress: 1 the chatbot · 2 build the agent (actions added) · 3 run it
  // (actions fired).
  const progress =
    phase === 'chat'
      ? { part: 1, parts: 3 }
      : phase === 'run'
        ? { part: 3, parts: 3, step: Math.min(runIdx, seq.length), steps: seq.length }
        : { part: 2, parts: 3, step: seq.length, steps: actions.length }

  // Left column: constant orientation (what an agent is + Your role).
  const stage = (main) => (
    <GameStage term={term} main={main} progress={progress} />
  )

  // Per-phase instruction, at the top of the right column so it's always the
  // current step. The term name / role live on the left, so this stays slim.
  const instruction = (title, body, note) => (
    <PhaseCard title={title} meta={note}>
      {body}
    </PhaseCard>
  )

  // The customer's order as a received MESSAGE, the chatbot's reply as a sent
  // one. A different visual family from the action cards, so "the job" never
  // reads as "a thing you give the bot".
  const customerBubble = (
    <ChatMessage from="customer" label={`Customer · ${order.customer}`}>
      {order.text}
    </ChatMessage>
  )
  const botReply = (text) => (
    <ChatMessage from="bot" label="Your chatbot">
      {text}
    </ChatMessage>
  )

  // ---- Reveal (standard payoff card) ----
  if (phase === 'reveal') {
    return (
      <TermReveal term={term} onComplete={onComplete} />
    )
  }

  // ---- Step 1: the plain chatbot (all talk, nothing fires) ----
  if (phase === 'chat') {
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(
          'From chat to agent',
          'Marco messages your shop. Here’s what a plain chatbot does with that order.',
        )}
        {customerBubble}
        {botReply(chatbotReply)}
        <SystemsPanel lit={new Set()} />
        <Callout tone="problem" title="The problem">
          It talked. Nothing actually happened — every system is still asleep, and no pizza is
          coming.
        </Callout>
        <GameActions>
          <GameActionButton variant="primary" icon="build" onClick={() => setPhase('build')}>
            Turn it into an agent
          </GameActionButton>
        </GameActions>
      </div>,
    )
  }

  // ---- Snag: bad order, funny real-world failure ----
  if (phase === 'snag') {
    const litSet = new Set(snag.lit ? [snag.lit] : [])
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(
          'Ran it · uh oh',
          'An agent acts in the real world, so the order matters. Fix the sequence and run it again.',
          'bad order',
        )}
        {customerBubble}
        <Callout tone="problem" title="What went wrong">{snag.msg}</Callout>
        <SystemsPanel lit={litSet} />
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_back" onClick={() => setPhase('build')}>
            Fix the order
          </GameActionButton>
        </GameActions>
      </div>,
    )
  }

  // ---- Run: fire each action, light up each system ----
  if (phase === 'run') {
    const done = runIdx >= seq.length
    const litSet = new Set(seq.slice(0, runIdx))
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(
          'Running the agent',
          'Each action fires for real and wakes up its system. Watch them light up.',
          `${Math.min(runIdx, seq.length)}/${seq.length}`,
        )}
        {customerBubble}
        <SystemsPanel lit={litSet} />
        <Panel compact title="Real actions fired" icon="wifi_tethering">
          <div className="flex flex-col gap-1.5">
            {seq.slice(0, runIdx).map((id) => (
              <div
                key={id}
                className="flex items-center gap-2 rounded-md border-2 border-success bg-success-bg px-2.5 py-1.5 text-[13px] font-bold text-success"
              >
                <span className="material-symbols-rounded text-[16px]">{fired[id].icon}</span>
                {fired[id].name}: {fired[id].result}
              </div>
            ))}
            {!runIdx && <p className="text-[13px] italic text-text-muted">…starting…</p>}
          </div>
        </Panel>
        {!done && (
          <div className="flex animate-pulse items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-3 py-2.5 text-[13px] font-bold text-cheese-dim shadow-pop">
            <span className="material-symbols-rounded text-[20px]">
              {actions.find((a) => a.id === seq[runIdx]).icon}
            </span>
            Firing: {actions.find((a) => a.id === seq[runIdx]).label}…
          </div>
        )}
        {done && (
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
              See what it just did
            </GameActionButton>
          </GameActions>
        )}
      </div>,
    )
  }

  // ---- Step 2: build the agent (pick real actions, in order) ----
  //
  // Left column stays the constant orientation (term + Your role), like every
  // other phase. The right column holds this step's instruction and the job,
  // then puts the two compact working panels — the to-do list you're filling
  // and the actions you pick from — SIDE BY SIDE, so the whole step fits one
  // wide-screen viewport without scrolling. Below `lg` the inner grid collapses
  // to a single stacked column, so the phone keeps the plain vertical flow.

  // The to-do list the player is assembling: a SlotList (a part of your bot).
  const toDoList = (
    <SlotList
      title="The agent’s to-do list"
      icon="checklist"
      capacity={actions.length}
      items={seq.map((id) => actions.find((a) => a.id === id))}
      accepts={actions.map((a) => a.id)}
      onDrop={add}
      onRemove={removeAt}
      onClear={() => setSeq([])}
      emptyLabel="drag an action here…"
      emptyTapLabel="tap an action to add it…"
      pulse={hint}
    />
  )

  // The parts palette: each action is a PartTile you drag (or tap) into the
  // list. Amber on the shelf and in the bot; it changes place, not colour.
  const firstFree = actions.findIndex((a) => !seq.includes(a.id))
  const actionPalette = (
    <div className="flex flex-col gap-2">
      {actions.map((action, i) => (
        <PartTile
          key={action.id}
          id={action.id}
          icon={action.icon}
          label={action.label}
          used={seq.includes(action.id)}
          usedLabel="on the list"
          onAdd={() => add(action.id)}
          wiggle={hint && i === firstFree}
        />
      ))}
    </div>
  )

  const main = (
    <div className="flex flex-col gap-3">
      {instruction(
        'Build the agent',
        'A chatbot only talks. Hand your bot the real actions to take, in the order that makes sense: drag or tap them onto the list.',
        `${seq.length}/${actions.length}`,
      )}
      {customerBubble}
      {/* The two working panels, side by side on desktop, stacked on mobile. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <p className="pl-1 font-label text-[10px] text-text-muted">Your agent so far</p>
          {toDoList}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-1 pl-1 font-label text-[10px] text-text-muted">
            <span className="material-symbols-rounded text-[15px]">handyman</span>
            Actions it can take
          </p>
          {actionPalette}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <GameStage wide term={term} main={main} progress={progress} />
      <GameActions>
        <GameActionButton variant="primary" icon="play_arrow" iconFill disabled={!full} onClick={runAgent}>
          Run the agent
        </GameActionButton>
      </GameActions>
    </>
  )
}

// ---- The three external systems, asleep until their action fires ----
function SystemsPanel({ lit }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {systems.map((sys) => {
        const on = lit.has(sys.id)
        return (
          <div
            key={sys.id}
            className={
              'flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-md border-[3px] px-1.5 py-2 text-center shadow-pop ' +
              (on ? 'border-success bg-success-bg' : 'border-neutral bg-text')
            }
          >
            <span
              className={
                'material-symbols-rounded text-[20px] ' + (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {sys.icon}
            </span>
            <span
              className={
                'font-label text-[8.5px] uppercase leading-none ' +
                (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {sys.name}
            </span>
            <span
              className={
                'text-[10px] font-bold leading-tight ' + (on ? 'text-success' : 'text-slot-empty')
              }
            >
              {on ? fired[sys.id].result : 'asleep'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
