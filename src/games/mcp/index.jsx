import { useState } from 'react'
import { customSystems, surpriseSystem, allSystems } from './systems.js'
import terms from '../../content/terms.json'

/**
 * MCP game — { termId, onComplete } interface.
 * "The plug nightmare": round 1 hand-builds a fiddly custom adapter for
 * each system, three times. Round 2, one standard port and every system
 * snaps in instantly — including the one that just showed up.
 */
export default function McpGame({ termId, onComplete }) {
  const [systemIndex, setSystemIndex] = useState(0)
  const [wiredPins, setWiredPins] = useState(new Set())
  const [phase, setPhase] = useState('round1') // 'round1' | 'surprise' | 'round2' | 'reveal'
  const [snapped, setSnapped] = useState([])

  const term = terms.find((t) => t.id === termId)
  const current = customSystems[systemIndex]
  const allPinsWired = current && wiredPins.size === current.pins
  const isLastCustomSystem = systemIndex === customSystems.length - 1

  function tapPin(i) {
    setWiredPins((prev) => new Set(prev).add(i))
  }

  function nextSystem() {
    if (isLastCustomSystem) {
      setPhase('surprise')
      return
    }
    setSystemIndex((i) => i + 1)
    setWiredPins(new Set())
  }

  function snapIn(id) {
    if (snapped.includes(id)) return
    const next = [...snapped, id]
    setSnapped(next)
    if (next.length === allSystems.length) {
      // brief beat before moving on, handled by the button appearing below
    }
  }

  const instruction = (sub) => (
    <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
      <p className="font-label text-[11px] text-primary">Game · The plug nightmare</p>
      <h1 className="text-2xl leading-tight">MCP</h1>
      <p className="mt-1 font-label text-[11px] text-text-muted">{sub}</p>
    </div>
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
        <h2 className="text-2xl">You just learned MCP</h2>

        <div className="rounded-lg border-[3px] border-neutral bg-muted p-3 text-left shadow-pop">
          <p className="text-[13px] leading-snug text-text">
            Three hand-built adapters versus four instant snaps — the difference is one standard
            plug instead of custom wiring per system. That's why an AI assistant can plug into your
            calendar, docs, or database at all: someone already agreed on the port.
          </p>
        </div>

        <div className="rounded-lg border-[3px] border-neutral bg-surface p-4 text-left shadow-pop">
          <p className="font-label text-[11px] text-text-muted">What it means</p>
          <p className="mt-1 text-[15px] leading-snug">{term.definition}</p>
          <p className="mt-3 text-[15px] leading-snug text-text-muted">
            <span className="font-semibold text-tertiary">Why you care: </span>
            {term.whyYouCare}
          </p>
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

  if (phase === 'round2') {
    const allSnapped = snapped.length === allSystems.length
    return (
      <div className="flex flex-col gap-3">
        {instruction('Round 2 — one standard MCP port. Tap each system to snap it in.')}
        <div className="flex flex-col gap-2">
          {allSystems.map((sys) => {
            const done = snapped.includes(sys.id)
            return (
              <button
                key={sys.id}
                type="button"
                disabled={done}
                onClick={() => snapIn(sys.id)}
                className={
                  'flex items-center gap-2 rounded-md border-[3px] px-4 py-3 text-left font-bold shadow-pop transition-all ' +
                  (done
                    ? 'border-success bg-success-bg text-success'
                    : 'press border-cheese-dim bg-cheese-bg text-cheese-dim')
                }
              >
                <span className="material-symbols-rounded text-[18px]">
                  {done ? 'check_circle' : 'power'}
                </span>
                {done ? `${sys.name} — connected` : `Snap in ${sys.name}`}
              </button>
            )
          })}
        </div>
        {allSnapped && (
          <>
            <p className="text-center font-label text-[11px] font-bold text-success">
              Four systems. Four taps. Two seconds.
            </p>
            <button
              type="button"
              onClick={() => setPhase('reveal')}
              className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
            >
              <span className="material-symbols-rounded">arrow_forward</span>
              See what this means
            </button>
          </>
        )}
      </div>
    )
  }

  if (phase === 'surprise') {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-danger bg-danger-bg p-4 text-center shadow-card">
          <p className="mb-1 font-label text-[11px] font-bold text-danger">One more thing —</p>
          <p className="text-[15px] leading-snug text-text">
            "{surpriseSystem.name}" needs connecting too. Better start on a fourth custom adapter.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
        >
          <span className="material-symbols-rounded">arrow_forward</span>
          Ugh. There has to be a better way
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {instruction(`Round 1 — custom wiring · system ${systemIndex + 1} / ${customSystems.length}`)}

      <div className="rounded-md border-[3px] border-neutral bg-muted px-4 py-4 text-center shadow-pop">
        <p className="text-lg font-extrabold">{current.name}</p>
        <p className="mt-1 text-sm text-text-muted">
          Needs a hand-built {current.connector} — wire every pin.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: current.pins }).map((_, i) => {
          const wired = wiredPins.has(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => tapPin(i)}
              disabled={wired}
              className={
                'h-12 w-12 rounded-full border-[3px] font-label text-xs font-bold transition-all active:scale-[0.9] ' +
                (wired
                  ? 'border-success bg-success-bg text-success'
                  : 'border-neutral bg-surface text-text-muted shadow-pop')
              }
            >
              {wired ? '✓' : `pin ${i + 1}`}
            </button>
          )
        })}
      </div>

      {allPinsWired ? (
        <div className="flex flex-col gap-2">
          <p className="text-center font-label text-[11px] font-bold text-success">Adapter built ✓</p>
          <button
            type="button"
            onClick={nextSystem}
            className="press flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-neutral bg-primary py-3 font-label font-bold text-white shadow-pop"
          >
            <span className="material-symbols-rounded">arrow_forward</span>
            {isLastCustomSystem ? 'Done — finally' : 'Next system'}
          </button>
        </div>
      ) : (
        <p className="text-center font-label text-[11px] text-text-muted">
          {wiredPins.size} / {current.pins} pins wired
        </p>
      )}
    </div>
  )
}
