import { useState } from 'react'
import { questions, tools } from './questions.js'
import terms from '../../content/terms.json'

/**
 * Tool use game — { termId, onComplete } interface.
 * "Don't guess, check": round 1 answers the same questions blind, with no
 * way to know — deliberately uncomfortable, and the game says so. Round 2
 * gives the player real tools to check instead of guessing.
 */
export default function ToolUseGame({ termId, onComplete }) {
  const [round, setRound] = useState(1)
  const [qIndex, setQIndex] = useState(0)
  const [guessed, setGuessed] = useState(false)
  const [wrongToolTap, setWrongToolTap] = useState(false)
  const [checked, setChecked] = useState(false)
  const [phase, setPhase] = useState('playing') // 'playing' | 'transition' | 'reveal'

  const term = terms.find((t) => t.id === termId)
  const current = questions[qIndex]
  const isLastQuestion = qIndex === questions.length - 1

  function nextQuestion() {
    if (isLastQuestion) {
      if (round === 1) {
        setPhase('transition')
      } else {
        setPhase('reveal')
      }
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

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Same questions, wildly different confidence — because round 2 wasn't guessing, it was
          checking. That's the fix on the bot's side for the exact gap that causes hallucinations:
          give it a real system to look at instead of asking it to remember.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Tool use</h2>
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

  if (phase === 'transition') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-danger-bg border border-danger px-4 py-4 text-center text-danger text-sm">
          Annoying, right? The bot feels this on every question it can't actually check.
        </p>
        <button
          type="button"
          onClick={startRound2}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Give the bot some tools →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-text-dim">
        <span>Round {round} / 2</span>
        <span>
          Question {qIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="rounded-md bg-surface px-4 py-6 text-center">
        <p className="text-lg font-medium">A customer asks: "{current.question}"</p>
      </div>

      {round === 1 ? (
        !guessed ? (
          <div className="rounded-md bg-bg-raised border border-border px-4 py-4 text-center">
            <p className="text-text-muted text-sm mb-3">There's no way to check. What do you say?</p>
            <button
              type="button"
              onClick={() => setGuessed(true)}
              className="rounded-md bg-cheese/20 border-2 border-cheese text-cheese font-semibold py-3 px-4 active:scale-[0.98] transition-transform"
            >
              Guess anyway
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-md bg-danger-bg border border-danger px-4 py-3">
              <p className="text-text">{current.guessAnswer}</p>
              <p className="text-danger text-xs mt-1">😬 that's just a guess</p>
            </div>
            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
            >
              Next question →
            </button>
          </div>
        )
      ) : !checked ? (
        <div className="flex flex-col gap-3">
          <p className="text-text-muted text-sm text-center">Tap the right tool to check.</p>
          <div className="flex flex-col gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => tapTool(tool.id)}
                className="rounded-md bg-surface border-2 border-border text-text font-medium py-3 px-4 text-left active:scale-[0.98] transition-transform"
              >
                {tool.label}
              </button>
            ))}
          </div>
          {wrongToolTap && (
            <p className="text-text-dim text-sm text-center italic">That tool doesn't have this answer — try another.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-md bg-success-bg border border-success px-4 py-3">
            <p className="text-text">{current.realAnswer}</p>
            <p className="text-success text-xs mt-1">✓ Correct answer, backed by real data.</p>
          </div>
          <button
            type="button"
            onClick={nextQuestion}
            className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
          >
            Next question →
          </button>
        </div>
      )}
    </div>
  )
}
