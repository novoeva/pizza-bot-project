import { useState } from 'react'
import { customerMessage, tempSteps, scenarios } from './content.js'
import terms from '../../content/terms.json'

const TIER_CLASSES = {
  cold: { bar: 'bg-success', box: 'bg-success-bg border-success text-success', pill: 'bg-success/20 text-success' },
  warm: { bar: 'bg-cheese', box: 'bg-cheese/10 border-cheese text-cheese', pill: 'bg-cheese/20 text-cheese' },
  hot: { bar: 'bg-danger', box: 'bg-danger-bg border-danger text-danger', pill: 'bg-danger/20 text-danger' },
}

const VERDICT_CLASSES = {
  good: 'bg-success-bg border-success text-success',
  warn: 'bg-cheese/10 border-cheese text-cheese',
  bad: 'bg-danger-bg border-danger text-danger',
}

const VERDICT_LABEL = {
  good: '✅ Right call',
  warn: '⚠️ Close, but not quite',
  bad: '❌ Wrong call',
}

const BUCKETS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

/**
 * Token game — { termId, onComplete } interface.
 * "Dial it in": the bot always picks its next token from a ranked list of
 * probabilities — temperature controls how bold that pick is. Round 1 lets
 * the player feel the mechanism (drag the dial, watch the probabilities and
 * the reply shift). Round 2 turns it into a decision: pick the right
 * temperature for two real bot messages and see the consequence.
 */
export default function TokenGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('explore') // 'explore' | 'apply' | 'summary' | 'reveal'
  const [stepIndex, setStepIndex] = useState(2)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [scenarioPick, setScenarioPick] = useState(null)
  const [results, setResults] = useState([])

  const term = terms.find((t) => t.id === termId)
  const step = tempSteps[stepIndex]
  const tierClasses = TIER_CLASSES[step.tier]

  function handleScenarioPick(bucketId) {
    if (scenarioPick) return
    setScenarioPick(bucketId)
  }

  function handleScenarioNext() {
    const scenario = scenarios[scenarioIndex]
    const nextResults = [
      ...results,
      { id: scenario.id, pick: scenarioPick, correct: scenarioPick === scenario.correct },
    ]
    setResults(nextResults)

    if (scenarioIndex === scenarios.length - 1) {
      setPhase('summary')
      return
    }
    setScenarioIndex((i) => i + 1)
    setScenarioPick(null)
  }

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Every token the bot writes — yours too, every time you chat with Claude or ChatGPT — gets
          picked the same way: rank the possible next tokens, then choose one. Temperature is the
          knob for how bold that choice gets. Low is a promise to say the same right thing every
          time. High trades that promise for personality.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">Token</h2>
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

  if (phase === 'summary') {
    const correctCount = results.filter((r) => r.correct).length
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-text-muted text-sm">
          {correctCount} / {scenarios.length} dialed in correctly
        </p>

        <div className="flex flex-col gap-3">
          {scenarios.map((scenario, i) => {
            const result = results[i]
            const outcome = scenario.outcomes[result.pick]
            return (
              <div
                key={scenario.id}
                className={'rounded-md border px-4 py-3 ' + VERDICT_CLASSES[outcome.verdict]}
              >
                <p className="text-xs mb-1 opacity-80">{scenario.title}</p>
                <p className="text-sm font-semibold">{VERDICT_LABEL[outcome.verdict]}</p>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setPhase('reveal')}
          className="rounded-md bg-surface hover:bg-surface-hover text-text font-medium py-3 active:scale-[0.98] transition-transform"
        >
          See what this means →
        </button>
      </div>
    )
  }

  if (phase === 'apply') {
    const scenario = scenarios[scenarioIndex]
    const outcome = scenarioPick ? scenario.outcomes[scenarioPick] : null

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-text-dim">
          <span>
            Message {scenarioIndex + 1} / {scenarios.length}
          </span>
        </div>

        <div className="rounded-md bg-surface px-4 py-4">
          <p className="text-xs text-text-dim mb-1">{scenario.title}</p>
          <p className="text-text text-sm">{scenario.prompt}</p>
        </div>

        {!scenarioPick ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted text-center">Set the temperature for this one:</p>
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleScenarioPick(b.id)}
                className="rounded-md bg-surface border-2 border-border text-text font-medium py-4 px-3 active:scale-[0.98] transition-transform"
              >
                {b.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className={'rounded-md border px-4 py-3 ' + VERDICT_CLASSES[outcome.verdict]}>
              <p className="text-sm font-semibold mb-1">{VERDICT_LABEL[outcome.verdict]}</p>
              <p className="text-sm opacity-90">{outcome.text}</p>
            </div>
            <button
              type="button"
              onClick={handleScenarioNext}
              className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
            >
              {scenarioIndex === scenarios.length - 1 ? 'See how you did →' : 'Next message →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-text-muted text-center">
        Try all five settings — watch how sure the bot is about its next word, and how much the
        reply changes.
      </p>

      <div className="rounded-md bg-bg-raised border border-border px-4 py-3 text-sm">
        <span className="text-text-dim">Customer asks: </span>
        <span className="text-text font-medium">"{customerMessage}"</span>
      </div>

      <div className="rounded-md bg-surface px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-text-muted uppercase tracking-wide">Temperature</span>
          <span className="text-lg font-display font-bold text-cheese">{step.value}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {tempSteps.map((s, i) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStepIndex(i)}
              className={
                'rounded-md py-2 text-[11px] font-semibold border-2 transition-colors ' +
                (i === stepIndex
                  ? TIER_CLASSES[s.tier].pill + ' border-transparent'
                  : 'bg-bg-raised border-border text-text-dim')
              }
            >
              {s.value}
            </button>
          ))}
        </div>

        <p className={'rounded-md border px-3 py-2 text-xs ' + tierClasses.box}>{step.desc}</p>
      </div>

      <div className="rounded-md bg-surface px-4 py-4">
        <p className="text-xs text-text-muted mb-3">{step.subtitle}</p>
        <div className="flex flex-col gap-2">
          {step.tokens.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-24 shrink-0 font-mono text-xs bg-bg-raised rounded px-1.5 py-1 text-center text-text-muted">
                {t.word}
              </div>
              <div className="flex-1 h-4 rounded-full bg-slot-empty overflow-hidden">
                <div
                  className={'h-full transition-all duration-300 ' + tierClasses.bar}
                  style={{ width: `${t.pct}%` }}
                />
              </div>
              <div className="w-9 shrink-0 text-right text-xs text-text-dim">{t.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-bg-raised border border-border px-4 py-3">
        <p className="text-xs text-text-dim mb-1">Bot's reply</p>
        <p className="text-sm text-text leading-relaxed">{step.reply}</p>
        <p className={'inline-block mt-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ' + tierClasses.pill}>
          {step.tag}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPhase('apply')}
        className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
      >
        Try it on a real message →
      </button>
    </div>
  )
}
