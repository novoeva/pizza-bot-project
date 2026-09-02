import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import {
  customerRequest,
  round1Options,
  round1Result,
  round2Options,
  round3Categories,
  round3Result,
  round3Effects,
} from './rounds.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import Callout from '../../components/Callout.jsx'
import ChatMessage from '../../components/ChatMessage.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'

// Each pickable type gets its OWN colour + pictogram, so an "Instruction"
// (the bot's base prompt) and a "Rule" (a constraint) read as different things
// at a glance, not just different labels.
const CHOICE_STYLES = {
  Instruction: { tag: 'Instruction you give your bot', icon: 'description', panel: 'bg-accent-soft', accent: 'text-tertiary' },
  Rule: { tag: 'Rule you add to your bot', icon: 'gavel', panel: 'bg-cheese-bg', accent: 'text-cheese-dim' },
}

// A pickable INSTRUCTION/RULE the player writes into the bot. Its own visual
// family (colour-coded icon panel on the left + a type tag on the card),
// deliberately NOT a chat bubble — so a "rule you give the bot" never reads as
// a "message".
function ChoiceCard({ type, label, onClick, picked = false }) {
  const s = CHOICE_STYLES[type]
  // `picked`: the same card shown back on the result screen, inert, so the
  // player recognises what they tapped (Phase 1 review, Q1).
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={picked}
      className={
        'flex items-stretch overflow-hidden rounded-md border-[3px] border-neutral bg-surface text-left shadow-pop ' +
        (picked ? '' : 'press')
      }
    >
      <span
        className={'flex w-11 shrink-0 items-center justify-center border-r-[3px] border-neutral ' + s.panel + ' ' + s.accent}
        aria-hidden="true"
      >
        <span className="material-symbols-rounded text-[20px]">{s.icon}</span>
      </span>
      <span className="flex-1 px-3 py-3">
        <span className={'block font-label text-[10px] ' + s.accent}>{s.tag}</span>
        <span className="mt-0.5 block font-bold leading-snug text-text">{label}</span>
      </span>
    </button>
  )
}

// A round-3 option shown back on the result screen as the pill you tapped.
// The pill carries the verdict: your wrong pick is muted red, the better one
// is green, and the card around them stays neutral.
function optionPill(label, tone) {
  return (
    <span
      className={
        'inline-block rounded-md border-2 px-2 py-0.5 text-[12px] font-bold ' +
        (tone === 'bad'
          ? 'border-danger bg-danger-bg text-danger'
          : 'border-success bg-success-bg text-success')
      }
    >
      {label}
    </span>
  )
}

function CategoryPicker({ index, category, value, onPick }) {
  return (
    <div>
      <p className="mb-1 font-label text-[11px] text-text-muted">
        {index != null && <span className="text-tertiary">Part {index} · </span>}
        {category.name}
      </p>
      <div className="flex flex-wrap gap-2">
        {category.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(category.name, opt)}
            className={
              'press rounded-md border-[3px] px-3 py-2 text-sm font-bold ' +
              (value === opt
                ? 'border-neutral bg-accent-soft text-tertiary shadow-pop'
                : 'border-neutral bg-surface text-text-muted shadow-pop')
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Prompt game, { termId, onComplete } interface.
 * "You build the bot": the customer stays vague every round; the player writes
 * the bot's instructions. Round 1's bare instruction lets the bot invent an
 * order, round 2 adds the rule that turns "invent" into "ask", round 3
 * assembles the full instructions and the same vague customer is handled well.
 */
export default function PromptGame({ termId, onComplete }) {
  const [phase, setPhase] = useState('round1')
  const [round1Pick, setRound1Pick] = useState(null)
  const [round2Pick, setRound2Pick] = useState(null)
  const [round3Picks, setRound3Picks] = useState({})

  useGameScroll(phase)

  const term = terms.find((t) => t.id === termId)

  function pickRound3(name, value) {
    setRound3Picks((p) => ({ ...p, [name]: value }))
  }

  const round3Complete = round3Categories.every((c) => round3Picks[c.name])

  // The customer's request as a received MESSAGE; the bot's reply as a sent one.
  const customerBanner = <ChatMessage from="customer">{customerRequest}</ChatMessage>
  const botReplyBubble = (text) => <ChatMessage from="bot">{text}</ChatMessage>

  // Progress: the round you are in, and inside round 3 how many of its parts
  // you have picked.
  const roundNo = phase.startsWith('round3') ? 3 : phase.startsWith('round2') ? 2 : 1
  const progress =
    roundNo === 3
      ? { part: 3, parts: 3, step: Object.keys(round3Picks).length, steps: round3Categories.length }
      : { part: roundNo, parts: 3 }

  // Left column: constant orientation (what a prompt is + Your role).
  const stage = (main) => (
    <GameStage context={<GameIntro term={term} showHowTo={false} />} main={main} progress={progress} />
  )

  // Per-phase instruction, at the top of the right column so it's always the
  // current step. The term name/role live on the left, so this stays slim.
  const instruction = (round, sub) => (
    <PhaseCard title={`You build the bot · Round ${round}`}>{sub}</PhaseCard>
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
        <h2 className="text-2xl">You just learned the term Prompt</h2>

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

  if (phase === 'round3-result') {
    const wrongRows = round3Categories.filter((c) => round3Picks[c.name] !== c.correct)
    const allRight = wrongRows.length === 0
    return stage(
      <div className="flex flex-col gap-3">
        {customerBanner}
        {allRight ? (
          <Callout tone="success" title="Round 3, full instructions">
            {round3Result}
          </Callout>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-center font-label text-[11px] font-bold text-danger">
              Your bot runs, but a few of these choices will cause problems
            </p>
            {/* Each wrong pick is a PROBLEM (muted red), never green: the better
                option is plain text with an arrow, so it reads as advice, not as
                "you got it right". (FR-11) */}
            {wrongRows.map((c) => (
              <Callout key={c.name} tone="info" compact title={c.name} icon={null}>
                {/* Neutral card; the pills carry the verdict: your pick red,
                    the better option green. */}
                <span className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-label text-[10px] text-text-muted">You picked</span>
                    {optionPill(round3Picks[c.name], 'bad')}
                    <span>it {round3Effects[round3Picks[c.name]]}.</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="font-label text-[10px] text-text-muted">Better</span>
                    {optionPill(c.correct, 'good')}
                    <span>it {round3Effects[c.correct]}.</span>
                  </span>
                </span>
              </Callout>
            ))}
          </div>
        )}
        <GameActions>
          {!allRight && (
            <GameActionButton variant="neutral" icon="tune" onClick={() => setPhase('round3')}>
              Adjust my bot
            </GameActionButton>
          )}
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
            See what this means
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round3') {
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(
          3,
          `Now put it all together. Your bot’s instructions come in ${round3Categories.length} parts — pick the best option in each, and together they’re the complete prompt your bot runs on.`,
        )}
        <div className="flex flex-col gap-4">
          {round3Categories.map((c, i) => (
            <CategoryPicker
              key={c.name}
              index={i + 1}
              category={c}
              value={round3Picks[c.name]}
              onPick={pickRound3}
            />
          ))}
        </div>
        <GameActions>
          <GameActionButton
            variant="primary"
            icon="send"
            disabled={!round3Complete}
            onClick={() => setPhase('round3-result')}
          >
            Switch this bot on
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  if (phase === 'round2-result') {
    return stage(
      <div className="flex flex-col gap-3">
        {customerBanner}
        {/* The rule you tapped, exactly as you tapped it, then the verdict. */}
        <ChoiceCard type="Rule" label={round2Pick.label} picked />
        <Callout
          tone={round2Pick.correct ? 'success' : 'problem'}
          title={round2Pick.correct ? 'One rule, different bot' : 'Worse'}
        >
          {round2Pick.result}
        </Callout>
        {round2Pick.correct ? (
          <>
            <p className="text-center font-label text-[11px] text-text-muted">
              One sentence changed the behavior, not the customer.
            </p>
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('round3')}>
                Write the bot’s full instructions
              </GameActionButton>
            </GameActions>
          </>
        ) : (
          <GameActions>
            <GameActionButton
              variant="primary"
              icon="refresh"
              onClick={() => {
                setRound2Pick(null)
                setPhase('round2')
              }}
            >
              Try another rule
            </GameActionButton>
          </GameActions>
        )}
      </div>
    )
  }

  if (phase === 'round2') {
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(2, 'Your bot invents things. Add one rule to stop it — tap one.')}
        {customerBanner}
        <div className="flex flex-col gap-2">
          {round2Options.map((opt) => (
            <ChoiceCard
              key={opt.label}
              type="Rule"
              label={opt.label}
              onClick={() => {
                setRound2Pick(opt)
                setPhase('round2-result')
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'round1-result') {
    return stage(
      <div className="flex flex-col gap-3">
        {instruction(1, 'Here’s what your bot actually does with that instruction.')}
        {customerBanner}
        {round1Pick && botReplyBubble(round1Pick.reply)}
        <Callout tone="problem" title="The problem">{round1Result}</Callout>
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('round2')}>
            Add a rule to your bot
          </GameActionButton>
        </GameActions>
      </div>
    )
  }

  return stage(
    <div className="flex flex-col gap-3">
      {instruction(1, 'Which instruction do you give your bot? Tap one.')}
      {customerBanner}
      <div className="flex flex-col gap-2">
        {round1Options.map((opt) => (
          <ChoiceCard
            key={opt.label}
            type="Instruction"
            label={opt.label}
            onClick={() => {
              setRound1Pick(opt)
              setPhase('round1-result')
            }}
          />
        ))}
      </div>
    </div>
  )
}
