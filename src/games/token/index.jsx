import { useState } from 'react'
import { hookWord, hookTokens, samplePhrase, predictionRounds } from './content.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'

const GUESS_OPTIONS = [1, 2, 3, 4]

function bestOf(options) {
  return options.reduce((a, b) => (b.pct > a.pct ? b : a))
}

/**
 * Token game, { termId, onComplete } interface.
 * Two beats that build the concept in order:
 *   1. Chop it up, a token is a chunk of text. Guess how many tokens
 *      "Pepperoni" is (four), then see the chunks and a whole order tokenized.
 *   2. Guess what's next, the model writes one token at a time, predicting
 *      the next from a ranked list. Guess the next token, then see the ranking.
 */
export default function TokenGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)
  const [phase, setPhase] = useState('chop') // 'chop' | 'predict' | 'reveal'
  const [chopGuess, setChopGuess] = useState(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [pick, setPick] = useState(null)
  const [results, setResults] = useState([])

  // ---------- Beat 1: chop it up ----------
  if (phase === 'chop') {
    const answered = chopGuess !== null
    const correct = chopGuess === hookTokens.length
    const wordCount = samplePhrase.text.trim().split(/\s+/).length
    return (
      <div className="flex flex-col gap-3">
        <GameIntro term={term} />

        <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-card">
          <p className="text-center font-label text-[11px] text-text-muted">
            {answered ? 'It splits into' : 'How many tokens is this word?'}
          </p>

          {!answered ? (
            <>
              <p className="mt-2 text-center text-3xl font-extrabold tracking-tight">{hookWord}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {GUESS_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setChopGuess(n)}
                    className="press rounded-md border-[3px] border-neutral bg-surface py-3 font-label text-lg font-bold text-text shadow-pop"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {hookTokens.map((t, i) => (
                  <span
                    key={i}
                    className="rounded border-2 border-neutral bg-accent-soft px-2.5 py-1.5 font-mono text-sm font-bold text-tertiary"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-center text-[13px] leading-snug text-text">
                <span className="font-bold">{hookTokens.length} tokens.</span>{' '}
                {correct ? 'Nailed it.' : 'Surprising, right?'} One word to you, four chunks to the
                model.
              </p>
            </>
          )}
        </div>

        {answered && (
          <>
            <div className="rounded-md border-[3px] border-neutral bg-muted p-3 shadow-pop">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-label text-[11px] text-text-muted">A whole order, chunked</p>
                <span className="shrink-0 rounded-full border-2 border-neutral bg-accent-soft px-2 py-0.5 font-label text-[11px] font-bold text-tertiary">
                  {samplePhrase.tokens.length} tokens
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {samplePhrase.tokens.map((t, i) => (
                  <span
                    key={i}
                    className="rounded border-2 border-neutral bg-surface px-2 py-1 font-mono text-xs text-text"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-snug text-text-muted">
                <span className="font-bold text-text">
                  {wordCount} words, {samplePhrase.tokens.length} tokens.
                </span>{' '}
                Short, common words are usually one token. Long or unusual ones get split. Even
                punctuation counts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPhase('predict')}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              Next: predict the next token
            </button>
          </>
        )}
      </div>
    )
  }

  // ---------- Beat 2: guess what's next ----------
  if (phase === 'predict') {
    const round = predictionRounds[roundIndex]
    const best = bestOf(round.options)
    const answered = pick !== null
    const correct = pick === best.word
    const isLast = roundIndex === predictionRounds.length - 1
    const sorted = [...round.options].sort((a, b) => b.pct - a.pct)

    function choose(word) {
      if (pick) return
      setPick(word)
      setResults((r) => [...r, word === best.word])
    }

    function next() {
      if (isLast) {
        setPhase('reveal')
        return
      }
      setRoundIndex((i) => i + 1)
      setPick(null)
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <div className="flex items-center justify-between">
            <p className="font-label text-[11px] text-primary">Game · Guess what's next</p>
            <span className="font-label text-[11px] text-text-muted">
              {roundIndex + 1} / {predictionRounds.length}
            </span>
          </div>
          <h1 className="text-2xl leading-tight">Token</h1>
          <p className="mt-1 text-[13px] leading-snug text-text-muted">
            An LLM never writes a whole reply at once. It predicts just the next token,
            statistically, from everything it's seen so far. Then it does it again, and again.
          </p>
        </div>

        <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
          <p className="text-lg font-extrabold leading-snug">
            "{round.context} <span className="text-primary">___</span>"
          </p>
        </div>

        {!answered ? (
          <div className="flex flex-col gap-2">
            <p className="text-center font-label text-[11px] text-text-muted">
              You're the model. Which token is most likely to come next?
            </p>
            {round.options.map((o) => (
              <button
                key={o.word}
                type="button"
                onClick={() => choose(o.word)}
                className="press rounded-md border-[3px] border-neutral bg-surface py-3 font-mono text-sm font-bold text-text shadow-pop"
              >
                {o.word}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div
              className={
                'rounded-md border-[3px] px-4 py-3 shadow-pop ' +
                (correct ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg')
              }
            >
              <p
                className={
                  'flex items-center gap-1.5 font-label text-sm font-bold ' +
                  (correct ? 'text-success' : 'text-danger')
                }
              >
                <span className="material-symbols-rounded text-[18px]">
                  {correct ? 'check_circle' : 'cancel'}
                </span>
                {correct ? 'You matched the model' : `Model picked "${best.word}"`}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-text">{round.why}</p>
            </div>

            <div className="rounded-md border-[3px] border-neutral bg-surface p-4 shadow-pop">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <p className="font-label text-[11px] text-text-muted">The model's ranking</p>
                <p className="font-label text-[11px] text-text-muted">% = probability</p>
              </div>
              <div className="flex flex-col gap-2">
                {sorted.map((o) => {
                  const isBest = o.word === best.word
                  const isPick = o.word === pick
                  return (
                    <div key={o.word} className="flex items-center gap-2">
                      <div
                        className={
                          'w-24 shrink-0 rounded border-2 px-1.5 py-1 text-center font-mono text-xs ' +
                          (isPick
                            ? 'border-neutral bg-accent-soft font-bold text-tertiary'
                            : 'border-neutral bg-muted text-text-muted')
                        }
                      >
                        {o.word}
                      </div>
                      <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-neutral bg-surface">
                        <div
                          className={'h-full ' + (isBest ? 'bg-success' : 'bg-tertiary')}
                          style={{ width: `${o.pct}%` }}
                        />
                      </div>
                      <div className="w-9 shrink-0 text-right text-xs text-text-muted">
                        {o.pct}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              {isLast ? 'See what this means' : 'Next sentence'}
            </button>
          </>
        )}
      </div>
    )
  }

  // ---------- Reveal ----------
  const score = results.filter(Boolean).length
  return (
    <div className="flex flex-col gap-3 text-center">
      <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
        <span className="material-symbols-rounded fill text-5xl text-white">check</span>
      </div>
      <p className="font-label text-[11px] text-primary">Snapped onto your bot · {term.botPart}</p>
      <h2 className="text-2xl">You just learned the term Token</h2>
      <p className="font-label text-xs text-text-muted">
        You matched the model on {score} of {predictionRounds.length}.
      </p>

      <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
        <p className="font-label text-[11px] text-text-muted">What it means</p>
        <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
      </div>

      <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
        <p className="font-label text-[11px] text-text-muted">Why you care</p>
        <p className="mt-1 text-[15px] leading-snug">{term.whyYouCare}</p>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="press mt-2 flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-5 py-3 font-label font-bold text-white shadow-pop"
      >
        <span className="material-symbols-rounded">arrow_forward</span>
        Snap it onto your bot
      </button>
    </div>
  )
}
