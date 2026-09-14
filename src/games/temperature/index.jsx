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
 *   1. "Feel the dial", drag the temperature and watch the candidate words go
 *      from "always the safe one" (low) to "anything can win" (high). Rolling
 *      the dice samples one word so the randomness is concrete; the rolled
 *      word is marked in the list and counted in a low-vs-high tally, and one
 *      roll at each end of the dial unlocks the next beat (PIZZA-14/15).
 *   2. "Pick the setting", match a real bot job to the right temperature.
 */
export default function TemperatureGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('play') // 'play' | 'match' | 'reveal'

  // ---------- Beat 1: slide it ----------
  // Start low so the first roll is already half of the experiment (low, then
  // high) and the favourite's runaway lead is the opening picture.
  const [temp, setTemp] = useState(0.4)
  // The last roll: which word, at which dial position (so the list can point
  // at it only while the odds on screen are the odds it was drawn from).
  const [sampled, setSampled] = useState(null)
  // Every roll so far, for the low-vs-high tally.
  const [history, setHistory] = useState([])

  // ---------- Beat 2: pick the setting ----------
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  useGameScroll(`${phase}:${roundIndex}`)

  // ---------- Beat 1: slide it ----------
  if (phase === 'play') {
    const ranked = reshape(candidates, temp)
    const lead = leadReadout(ranked)
    const zone = zoneFor(temp)
    const rolledHere = sampled && sampled.temp === temp ? sampled.word : null
    const tally = tallyByZone(history)
    const lowDone = tally.low.total > 0
    const highDone = tally.wild.total > 0
    // The experiment is "roll low, then roll high". Six rolls anywhere also
    // unlock the next beat, so nobody gets stuck on the dial.
    const experimentDone = (lowDone && highDone) || history.length >= 6

    function roll() {
      const word = sampleWord(ranked)
      setSampled({ word, temp })
      setHistory((h) => [...h, { word, zoneId: zone.id }])
    }

    const main = (
      <>
        {/* This beat's own instruction, at the top of the active column so it's
            always the current step (the constant orientation stays on the left). */}
        <PhaseCard
          title="Feel the dial"
          meta={
            <>
              Low {lowDone ? '✓' : '·'} High {highDone ? '✓' : '·'}
            </>
          }
        >
          Roll a few times with the dial low, then drag it high and roll again. Watch which word wins, and how often.
        </PhaseCard>

        {/* The sentence the bot is about to finish */}
        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{sliderContext}{' '}
            <span className="text-tertiary">{sampled ? sampled.word : '___'}</span>
            {sampled ? '.' : ''}"
          </p>
          <p className="mt-1 font-label text-[11px] text-text-muted">
            {sampled
              ? `Rolled at ${sampled.temp.toFixed(1)} · ${zoneFor(sampled.temp).label}` +
                (rolledHere ? '' : ' · the dial has moved since')
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
            so the lead visibly melts as the dial goes up. The word the last
            roll landed on is marked blue, the same blue as in the sentence
            (PIZZA-15), while the dial still sits where it was rolled. */}
        <Panel title="Chance of each next word" meta="% = probability">
          <div className="flex flex-col gap-2">
            {ranked.map((o) => {
              const rolled = o.word === rolledHere
              return (
                <div
                  key={o.word}
                  className={
                    '-mx-1 flex items-center gap-2 rounded-md px-1 py-0.5 ' +
                    (rolled ? 'bg-accent-soft' : '')
                  }
                >
                  <div
                    className={
                      'w-24 shrink-0 rounded border-2 px-1.5 py-1 text-center font-mono text-xs ' +
                      (rolled
                        ? 'border-tertiary bg-tertiary font-bold text-white'
                        : 'border-neutral bg-muted text-text')
                    }
                  >
                    {o.word}
                  </div>
                  <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                    <div
                      className="h-full bg-cheese transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: `${o.pct}%` }}
                    />
                  </div>
                  <div className="w-9 shrink-0 text-right text-xs text-text-muted">{Math.round(o.pct)}%</div>
                  <span
                    className={
                      'material-symbols-rounded w-5 shrink-0 text-[18px] text-tertiary ' +
                      (rolled ? '' : 'invisible')
                    }
                    aria-label={rolled ? 'the bot picked this word' : undefined}
                    aria-hidden={rolled ? undefined : 'true'}
                  >
                    casino
                  </span>
                </div>
              )
            })}
          </div>
          {/* The favourite's lead, in one line, straight from the same maths
              as the bars: ~7x at the bottom of the dial, ~1.2x at the top. */}
          <p className="mt-3 text-[13px] leading-snug text-text">
            <span className="font-bold">{lead.word}</span> is{' '}
            <span className="font-mono font-bold">{lead.ratio}×</span> {lead.text}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-text-muted">{zone.note}</p>
        </Panel>

        {/* The tally: what the rolls actually landed on, low vs high, so the
            difference is on screen as evidence rather than as a claim. */}
        <Panel title="Your rolls so far" icon="casino" meta={`${history.length} roll${history.length === 1 ? '' : 's'}`}>
          <div className="flex flex-col gap-2">
            <TallyRow label="Low" sub="predictable" bucket={tally.low} hint="drag the dial down and roll" />
            {tally.balanced.total > 0 && (
              <TallyRow label="Middle" sub="balanced" bucket={tally.balanced} />
            )}
            <TallyRow label="High" sub="wild" bucket={tally.wild} hint="drag the dial up and roll" />
          </div>
        </Panel>
      </>
    )

    // Left: read-once orientation (what temperature is + Your role). Right: the
    // live dial, the distribution, the tally. The roll button lives in the
    // pinned bar so it is always on screen; "Next" joins it once you have
    // rolled at both ends of the dial.
    return (
      <>
        <GameStage
          term={term}
          main={main}
          progress={{ part: 1, parts: 2 }}
        />
        <GameActions>
          <GameActionButton variant="accent" icon="casino" onClick={roll}>
            {history.length === 0 ? 'Roll the dice, let the bot pick' : `Roll again at ${temp.toFixed(1)}`}
          </GameActionButton>
          {experimentDone && (
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

/** The zone a dial position falls in. */
function zoneFor(temp) {
  return zones.find((z) => temp <= z.max)
}

/**
 * Count the rolls per dial zone and per word: { low: { total, words: [[word, n], ...] }, ... }
 * with the words sorted most-rolled first.
 */
function tallyByZone(history) {
  const out = {}
  for (const z of zones) out[z.id] = { total: 0, counts: {} }
  for (const h of history) {
    const b = out[h.zoneId]
    b.total += 1
    b.counts[h.word] = (b.counts[h.word] || 0) + 1
  }
  for (const b of Object.values(out)) {
    b.words = Object.entries(b.counts).sort((a, c) => c[1] - a[1])
  }
  return out
}

/** One line of the tally: the zone on the left, "classic ×4 · spicy honey ×1" on the right. */
function TallyRow({ label, sub, bucket, hint }) {
  const empty = bucket.total === 0
  return (
    <div className="flex items-start gap-2">
      <div className="w-24 shrink-0 rounded border-2 border-neutral bg-muted px-1.5 py-1 text-center font-label text-[11px] font-bold text-text">
        {label}
        <span className="block text-[9px] font-normal text-text-muted">{sub}</span>
      </div>
      <div className="min-w-0 flex-1 py-1 text-[13px] leading-snug">
        {empty ? (
          <span className="text-text-muted">No rolls yet{hint ? `, ${hint}` : ''}.</span>
        ) : (
          bucket.words.map(([word, n], i) => (
            <span key={word}>
              {i > 0 && <span className="text-text-muted"> · </span>}
              <span className={i === 0 ? 'font-bold text-text' : 'text-text'}>{word}</span>
              <span className="font-mono text-text-muted"> ×{n}</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
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
