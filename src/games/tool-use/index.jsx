import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { questions, tools } from './questions.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'

/**
 * Tool use game, { termId, onComplete } interface.
 * "Don't guess, check": round 1 answers the same questions blind, with no
 * way to know, deliberately uncomfortable, and the game says so. Round 2
 * gives the player real tools to check instead of guessing.
 */
export default function ToolUseGame({ termId, onComplete }) {
  const [round, setRound] = useState(1)
  const [qIndex, setQIndex] = useState(0)
  const [guessed, setGuessed] = useState(false)
  const [wrongToolTap, setWrongToolTap] = useState(false)
  const [checked, setChecked] = useState(false)
  const [phase, setPhase] = useState('playing') // 'playing' | 'transition' | 'reveal'

  useGameScroll(`${phase}:${round}:${qIndex}`)

  const term = terms.find((t) => t.id === termId)
  const current = questions[qIndex]
  const isLastQuestion = qIndex === questions.length - 1

  function nextQuestion() {
    if (isLastQuestion) {
      setPhase(round === 1 ? 'transition' : 'reveal')
      return
    }
    setQIndex((i) => i + 1)
    setGuessed(false)
    setChecked(false)
    setWrongToolTap(false)
  }

  function startRound2() {
    setRound(2)
    setQIndex(0)
    setGuessed(false)
    setChecked(false)
    setWrongToolTap(false)
    setPhase('playing')
  }

  function tapTool(toolId) {
    if (checked) return
    if (toolId === current.correctTool) {
      setChecked(true)
      setWrongToolTap(false)
    } else {
      setWrongToolTap(true)
    }
  }

  // Progress: the round (guess / check) and the question inside it.
  const progress = {
    part: round,
    parts: 2,
    step: phase === 'transition' ? questions.length : qIndex + 1,
    steps: questions.length,
  }

  // Left column: constant orientation (what tool use is + Your role).
  const stage = (main) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} progress={progress} />
  )

  // Per-phase instruction at the top of the right column.
  const instruction = (sub) => (
    <PhaseCard title={`Guess or check · Round ${round}`}>
      {sub}
    </PhaseCard>
  )

  // The customer's question as a received MESSAGE; the bot's reply as a sent
  // one whose tint is the verdict: 'good' (backed by data) / 'bad' (a guess).
  const customerBubble = (text) => <ChatMessage from="customer">{text}</ChatMessage>
  const botBubble = (text, tone, note) => (
    <>
      <ChatMessage from="bot">{text}</ChatMessage>
      <Callout tone={tone === 'good' ? 'success' : 'problem'} title={note} compact />
    </>
  )

  // Choice archetype — a tool the player hands the bot to check with.
  const toolCard = (tool) => (
    <button
      key={tool.id}
      type="button"
      onClick={() => tapTool(tool.id)}
      className="press flex items-stretch overflow-hidden rounded-md border-[3px] border-neutral bg-surface text-left shadow-pop"
    >
      <span
        className="flex w-11 shrink-0 items-center justify-center border-r-[3px] border-neutral bg-accent-soft text-tertiary"
        aria-hidden="true"
      >
        <span className="material-symbols-rounded text-[20px]">build</span>
      </span>
      <span className="flex-1 px-3 py-3">
        <span className="block font-label text-[10px] text-tertiary">Tool your bot can check</span>
        <span className="mt-0.5 block font-bold leading-snug text-text">{tool.label}</span>
      </span>
    </button>
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
        <h2 className="text-2xl">You just learned the term Tool use</h2>

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

  if (phase === 'transition') {
    return stage(
      <div className="flex flex-col gap-3">
        <Callout tone="problem" title="Guessing every time" icon="error">
          Annoying, right? Your bot feels this on every question it can&rsquo;t actually check.
          Time to give it real tools.
        </Callout>
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={startRound2}>
            Give the bot some tools
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  return stage(
    <div className="flex flex-col gap-3">
      {instruction(
        round === 1
          ? 'Answer blind — your bot has no real data, all it can do is guess.'
          : 'Now your bot has tools. Check the answer instead of guessing.',
      )}

      {customerBubble(current.question)}

      {round === 1 ? (
        !guessed ? (
          <div className="rounded-md border-[3px] border-neutral bg-surface px-4 py-4 text-center shadow-pop">
            <p className="mb-3 font-label text-[11px] text-text-muted">
              There&rsquo;s no way to check. All your bot can do is guess.
            </p>
            <GameActions>
              <GameActionButton variant="soft" onClick={() => setGuessed(true)}>
                Guess anyway
              </GameActionButton>
            </GameActions>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {botBubble(current.guessAnswer, 'bad', "That's just a guess")}
            <GameActions>
              <GameActionButton variant="accent" icon="arrow_forward" onClick={nextQuestion}>
                Next question
              </GameActionButton>
            </GameActions>
          </div>
        )
      ) : !checked ? (
        <div className="flex flex-col gap-2">
          <p className="font-label text-[11px] text-text-muted">
            Tap the right tool for your bot to check:
          </p>
          <div className="flex flex-col gap-2">{tools.map((tool) => toolCard(tool))}</div>
          {wrongToolTap && (
            <p className="font-label text-[11px] italic text-text-muted">
              That tool doesn&rsquo;t have this answer, try another.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {botBubble(current.realAnswer, 'good', 'Correct, backed by real data')}
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={nextQuestion}>
              Next question
            </GameActionButton>
          </GameActions>
        </div>
      )}
    </div>
  )
}
