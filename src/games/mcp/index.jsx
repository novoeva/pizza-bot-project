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

  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-md bg-bg-raised border border-border px-4 py-4 text-sm italic text-text-muted">
          Three hand-built adapters versus four instant snaps — the difference is one standard
          plug instead of custom wiring per system. That's why an AI assistant can plug into your
          calendar, docs, or database at all: someone already agreed on the port.
        </p>

        <div className="rounded-md bg-surface px-4 py-4">
          <h2 className="font-display font-semibold text-cheese mb-1">MCP</h2>
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

  if (phase === 'round2') {
    const allSnapped = snapped.length === allSystems.length
    return (
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text-muted text-center">
          Round 2 — one standard MCP port. Tap each system to snap it in.
        </p>
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
                  'rounded-md border-2 px-4 py-3 text-left font-medium transition-all active:scale-[0.98] ' +
                  (done
                    ? 'bg-success-bg border-success text-success'
                    : 'bg-cheese/20 border-cheese text-cheese')
                }
              >
                {done ? `✓ ${sys.name} — connected` : `🔌 Snap in ${sys.name}`}
              </button>
            )
          })}
        </div>
        {allSnapped && (
          <>
            <p className="text-success text-sm text-center font-medium">
              Four systems. Four taps. Two seconds.
            </p>
            <button
              type="button"
              onClick={() => setPhase('reveal')}
              className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
            >
              See what this means →
            </button>
          </>
        )}
      </div>
    )
  }

  if (phase === 'surprise') {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-md bg-danger-bg border border-danger px-4 py-6 text-center">
          <p className="text-danger font-semibold mb-1">One more thing —</p>
          <p className="text-text">"{surpriseSystem.name}" needs connecting too. Better start on a fourth custom adapter.</p>
        </div>
        <button
          type="button"
          onClick={() => setPhase('round2')}
          className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
        >
          Ugh. There has to be a better way →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-text-dim">
        <span>Round 1 — custom wiring</span>
        <span>
          System {systemIndex + 1} / {customSystems.length}
        </span>
      </div>

      <div className="rounded-md bg-surface px-4 py-4 text-center">
        <p className="text-lg font-medium">{current.name}</p>
        <p className="text-text-muted text-sm mt-1">Needs a hand-built {current.connector} — wire every pin.</p>
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
                'h-12 w-12 rounded-full border-2 font-semibold text-xs transition-all active:scale-[0.9] ' +
                (wired
                  ? 'bg-success-bg border-success text-success'
                  : 'bg-bg-raised border-border text-text-dim')
              }
            >
              {wired ? '✓' : `pin ${i + 1}`}
            </button>
          )
        })}
      </div>

      {allPinsWired ? (
        <div className="flex flex-col gap-2">
          <p className="text-success text-sm text-center font-medium">Adapter built ✓</p>
          <button
            type="button"
            onClick={nextSystem}
            className="rounded-md bg-tomato text-text font-semibold py-3 active:scale-[0.98] transition-transform"
          >
            {isLastCustomSystem ? 'Done — finally →' : 'Next system →'}
          </button>
        </div>
      ) : (
        <p className="text-text-dim text-xs text-center">{wiredPins.size} / {current.pins} pins wired</p>
      )}
    </div>
  )
}
