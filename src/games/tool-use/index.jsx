import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { questions, tools } from './questions.js'
import terms from '../../content/terms.json'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'

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
    step: phase === 'transition' ? questions.length : qIndex + ((round === 1 ? guessed : checked) ? 1 : 0),
    steps: questions.length,
  }

  // Left column: constant orientation (what tool use is + Your role).
  const stage = (main) => (
    <GameStage term={term} main={main} progress={progress} />
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

  // A tool the player hands the bot to check with: a commit choice.
  const toolCard = (tool) => (
    <SelectableCard
      key={tool.id}
      mode="commit"
      icon="build"
      tag="Tool your bot can check"
      label={tool.label}
      onSelect={() => tapTool(tool.id)}
    />
  )

  if (phase === 'reveal') {
    return (
      <TermReveal term={term} onComplete={onComplete} />
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
          <ChoiceGroup mode="commit" label="Which tool has the answer?">
            {tools.map((tool) => toolCard(tool))}
          </ChoiceGroup>
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
