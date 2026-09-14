import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import {
  sliderContext,
  candidates,
  TEMP_MIN,
  TEMP_MAX,
  zones,
  taskRounds,
} from './content.js'
import terms from '../../content/terms.json'
import GameStage from '../../components/GameStage.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'
import Panel from '../../components/Panel.jsx'

/**
 * Temperature game, { termId, onComplete } interface.
 * Reuses the Token game's picture, the model choosing the next word from a
 * ranked list, and adds the one dial that reshapes that list.
 *   1. "Slide it", drag the temperature and watch the candidate words go from
 *      "always the safe one" (low) to "anything can win" (high). Rolling the
 *      dice samples one word so the randomness is concrete, and doubles as the
 *      obvious call-to-action that unlocks the next beat.
 *   2. "Pick the setting", match a real bot job to the right temperature.
 */
export default function TemperatureGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('play') // 'play' | 'match' | 'reveal'

  // ---------- Beat 1: slide it ----------
  const [temp, setTemp] = useState(1.0)
  const [sampled, setSampled] = useState(null)
  const [rolls, setRolls] = useState(0)

  // ---------- Beat 2: pick the setting ----------
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  useGameScroll(`${phase}:${roundIndex}`)

  // ---------- Beat 1: slide it ----------
  if (phase === 'play') {
    const ranked = reshape(candidates, temp)
    const lead = leadReadout(ranked)
    const zone = zones.find((z) => temp <= z.max)
    const interacted = rolls > 0

    function roll() {
      setSampled(sampleWord(ranked))
      setRolls((r) => r + 1)
    }

    const main = (
      <>
        {/* This beat's own instruction, at the top of the active column so it's
            always the current step (the constant orientation stays on the left). */}
        <PhaseCard title="Feel the dial">
          Drag the temperature from low to high and watch the odds shift, then roll to see which word your bot picks.
        </PhaseCard>

        {/* The sentence the bot is about to finish */}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{sliderContext}{' '}
            {sampled ? (
              <span className="text-tertiary">{sampled}</span>
            ) : (
              <span className="text-tertiary">___</span>
            )}
            {sampled ? '.' : ''}"
          </p>
          <p className="mt-1 font-label text-[11px] text-text-muted">
            {sampled
              ? 'One roll at this setting'
              : 'Same words to choose from every time. Only the odds change.'}
          </p>
        </div>

        {/* The temperature dial */}
        <Panel
          title="Temperature"
          icon="thermostat"
          meta={
            <>
              <span className="rounded-full border-2 border-neutral bg-accent-soft px-2 py-0.5 font-label text-[11px] font-bold text-tertiary">
                {zone.label}
              </span>
              <span className="font-mono text-sm font-bold text-text">{temp.toFixed(1)}</span>
            </>
          }
        >
          <input
            type="range"
            min={TEMP_MIN}
            max={TEMP_MAX}
            step={0.1}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="range-chunky"
            aria-label="Temperature"
          />
          <div className="mt-1 flex justify-between font-label text-[10px] text-text-muted">
            <span>Low · predictable</span>
            <span>High · wild</span>
          </div>
        </Panel>

        {/* Live distribution. No word is pinned as "the right one" (PIZZA-14):
            the favourite is only ever the tallest bar, and the bars animate
            so the lead visibly melts as the dial goes up. */}
        <Panel title="Chance of each next word" meta="% = probability">
          <div className="flex flex-col gap-2">
            {ranked.map((o) => (
              <div key={o.word} className="flex items-center gap-2">
                <div className="w-24 shrink-0 rounded border-2 border-neutral bg-muted px-1.5 py-1 text-center font-mono text-xs text-text">
                  {o.word}
                </div>
                <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                  <div
                    className="h-full bg-cheese transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: `${o.pct}%` }}
                  />
                </div>
                <div className="w-9 shrink-0 text-right text-xs text-text-muted">{Math.round(o.pct)}%</div>
              </div>
            ))}
          </div>
          {/* The favourite's lead, in one line, straight from the same maths
              as the bars: ~7x at the bottom of the dial, ~1.2x at the top. */}
          <p className="mt-3 text-[13px] leading-snug text-text">
            <span className="font-bold">{lead.word}</span> is{' '}
            <span className="font-mono font-bold">{lead.ratio}×</span> {lead.text}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-text-muted">{zone.note}</p>
        </Panel>

        {/* Re-roll stays inline as a secondary; the pinned bar carries the
            forward action so it's always on screen. */}
        {interacted && (
          <GameActionButton variant="neutral" icon="casino" onClick={roll}>
            Roll again
          </GameActionButton>
        )}
      </>
    )

    // Left: read-once orientation (what temperature is + Your role). Right: the
    // live dial, the distribution and the roll — the part you actually touch.
    return (
      <>
        <GameStage
          term={term}
          main={main}
          progress={{ part: 1, parts: 2 }}
        />
        <GameActions>
          {!interacted ? (
            <GameActionButton variant="accent" icon="casino" onClick={roll}>
              Roll the dice, let the bot pick
            </GameActionButton>
          ) : (
            <GameActionButton
              variant="primary"
              icon="arrow_forward"
              onClick={() => setPhase('match')}
            >
              Next: pick the right setting
            </GameActionButton>
          )}
        </GameActions>
      </>
    )
  }

  // ---------- Beat 2: pick the setting ----------
  if (phase === 'match') {
    const round = taskRounds[roundIndex]
    const answered = pick !== null
    const correct = pick === round.answer
    const isLast = roundIndex === taskRounds.length - 1

    function choose(choice) {
      if (pick) return
      setPick(choice)
      setResults((r) => [...r, choice === round.answer])
    }

    function next() {
      if (isLast) {
        setPhase('reveal')
        return
      }
      setRoundIndex((i) => i + 1)
      setPick(null)
    }

    // Left column keeps the same orientation as beat 1 (the term + Your role),
    // so it stays put while the right column switches from the dial to the jobs.
    const main = (
      <>
        <PhaseCard title="Pick the setting">
          Same bot, very different jobs. For each one, decide which way to turn the dial.
        </PhaseCard>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 shadow-pop">
          <p className="font-label text-[11px] text-text-muted">The job</p>
          <p className="mt-1 text-[15px] font-bold leading-snug text-text">{round.task}</p>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">{round.detail}</p>
        </div>

        {!answered ? (
          <ChoiceGroup mode="commit" columns={2} label="Which way do you turn the dial?">
            <SelectableCard
              mode="commit"
              variant="tile"
              icon="ac_unit"
              label="Turn it down"
              detail="Low · consistent"
              onSelect={() => choose('low')}
            />
            <SelectableCard
              mode="commit"
              variant="tile"
              icon="local_fire_department"
              iconClassName="text-tomato"
              label="Turn it up"
              detail="High · creative"
              onSelect={() => choose('high')}
            />
          </ChoiceGroup>
        ) : (
          <Callout
            tone={correct ? 'success' : 'problem'}
            icon={correct ? 'check_circle' : 'cancel'}
            title={
              correct
                ? `Right, turn it ${round.answer === 'low' ? 'down' : 'up'}`
                : `Better to turn it ${round.answer === 'low' ? 'down' : 'up'}`
            }
            compact
          >
            {round.why}
          </Callout>
        )}
      </>
    )

    return (
      <>
        <GameStage
          term={term}
          main={main}
          progress={{ part: 2, parts: 2, step: roundIndex + (answered ? 1 : 0), steps: taskRounds.length }}
        />
        {answered && (
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={next}>
              {isLast ? 'See what this means' : 'Next job'}
            </GameActionButton>
          </GameActions>
        )}
      </>
    )
  }

  // ---------- Reveal ----------
  const score = results.filter(Boolean).length
  return (
    <TermReveal term={term} score={`You matched the setting on ${score} of ${taskRounds.length}.`} onComplete={onComplete} />
  )
}

/**
 * Reshape the candidate distribution for a given temperature.
 * Standard temperature scaling: q_i is proportional to base_i^(1/T). At low T
 * the top word runs away with it; at high T the distribution flattens and the
 * long shots become viable. Returns each candidate with a `pct` (0-100).
 */
function reshape(list, temp) {
  const exps = list.map((c) => Math.pow(c.base, 1 / temp))
  const sum = exps.reduce((a, b) => a + b, 0)
  return list.map((c, i) => ({ ...c, pct: (exps[i] / sum) * 100 }))
}

/**
 * How far ahead the favourite is, as "N× the runner-up" plus a plain sentence.
 * Derived from the same reshaped percentages the bars show, so the readout can
 * never disagree with the picture: with these candidates it runs from about
 * 7× (dial at 0.2) down to about 1.2× (dial at 2.0).
 */
function leadReadout(ranked) {
  const sorted = [...ranked].sort((a, b) => b.pct - a.pct)
  const [top, second] = sorted
  const r = top.pct / second.pct
  const ratio = r >= 10 ? String(Math.round(r)) : r.toFixed(1)
  let text
  if (r >= 4) text = 'more likely than the runner-up. It wins almost every roll.'
  else if (r >= 2) text = 'more likely than the runner-up. It usually wins, but not always.'
  else if (r >= 1.35) text = 'more likely than the runner-up. The lead is melting.'
  else text = 'more likely than the runner-up. Barely ahead: almost any word can win.'
  return { word: top.word, ratio, text }
}

/** Draw one word from a reshaped distribution (percentages sum to 100). */
function sampleWord(ranked, rng = Math.random) {
  const r = rng() * 100
  let acc = 0
  for (const c of ranked) {
    acc += c.pct
    if (r <= acc) return c.word
  }
  return ranked[ranked.length - 1].word
}
