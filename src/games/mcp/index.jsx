import { useEffect, useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { BOTS, SYSTEMS, PLUGS, STAGES, PREDICT, HUB, NEW_SYSTEM } from './systems.js'
import terms from '../../content/terms.json'
import GameIntro from '../../components/GameIntro.jsx'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'

/**
 * MCP game, { termId, onComplete } interface.
 *
 * "The wiring board". The player hand wires each bot to each system by
 * matching a plug to a socket shape. A new system arrives, then a second
 * bot, and none of the earlier wiring transfers. The tangle on screen is
 * one the player built tap by tap, so the multiplication is felt, not told.
 * They then predict the total for 3 bots x 4 systems (12), watch it drawn,
 * and only then does one shared plug show up and collapse it to 3 + 4.
 * The final beat adds a brand new system for the cost of a single plug.
 */

// --- shapes ---------------------------------------------------------------

const SHAPE_PATHS = {
  triangle: <polygon points="50,10 92,86 8,86" />,
  square: <rect x="14" y="14" width="72" height="72" rx="8" />,
  hexagon: <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" />,
  star: <polygon points="50,4 62,37 97,37 69,58 79,92 50,71 21,92 31,58 3,37 38,37" />,
  circle: <circle cx="50" cy="50" r="43" />,
}

const SHAPE_NAMES = {
  triangle: 'triangle',
  square: 'square',
  hexagon: 'six sided',
  star: 'star',
  circle: 'round',
}

function Shape({ shape, size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
      {SHAPE_PATHS[shape]}
    </svg>
  )
}

function UniversalPlug({ size = 22, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect x="8" y="8" width="84" height="84" rx="26" fill="currentColor" />
      <circle cx="50" cy="50" r="17" fill="var(--color-muted)" />
    </svg>
  )
}

// --- board ----------------------------------------------------------------

const BOT_X = 19
const SYS_X = 81
const HUB_X = 50

const curve = (x1, y1, x2, y2) => {
  const m = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${m} ${y1}, ${m} ${y2}, ${x2} ${y2}`
}

const spread = (n, i) => ((i + 0.5) / n) * 100

function Board({
  bots,
  systems,
  links = [],
  hubMode = false,
  hubPlugged = [],
  onTapSystem,
  onTapNode,
  onTapPlug,
  activeSystems = [],
  activeBots = [],
  pending,
  wrong,
}) {
  const botY = {}
  bots.forEach((b, i) => {
    botY[b] = spread(bots.length, i)
  })
  const sysY = {}
  systems.forEach((s, i) => {
    sysY[s] = spread(systems.length, i)
  })

  const cables = []
  if (hubMode) {
    bots.forEach((b) => {
      if (hubPlugged.includes(b)) {
        cables.push({ k: `b-${b}`, d: curve(BOT_X, botY[b], HUB_X, 50), c: 'var(--color-success)' })
      }
    })
    systems.forEach((s) => {
      if (hubPlugged.includes(s)) {
        cables.push({ k: `s-${s}`, d: curve(HUB_X, 50, SYS_X, sysY[s]), c: 'var(--color-success)' })
      }
    })
  } else {
    links.forEach((l, i) => {
      if (botY[l.bot] === undefined || sysY[l.system] === undefined) return
      cables.push({
        k: `l-${i}`,
        d: curve(BOT_X, botY[l.bot], SYS_X, sysY[l.system]),
        c: 'var(--color-tomato)',
      })
    })
  }

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg border-[3px] border-neutral bg-muted shadow-pop">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {cables.map((c) => (
          <path
            key={c.k}
            d={c.d}
            fill="none"
            stroke={c.c}
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.85"
          />
        ))}
      </svg>

      {hubMode && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${HUB_X}%`, top: '50%' }}
        >
          <div className="flex w-[64px] flex-col items-center gap-0.5 rounded-md border-[3px] border-neutral bg-primary px-1 py-2 text-white shadow-pop">
            <UniversalPlug size={20} />
            <span className="font-label text-[10px] font-bold leading-none">MCP</span>
          </div>
        </div>
      )}

      {bots.map((b, i) => {
        const bot = BOTS[b]
        const tappable = activeBots.includes(b)
        const plugged = hubMode && hubPlugged.includes(b)
        return (
          <button
            key={b}
            type="button"
            disabled={!tappable}
            onClick={() => tappable && onTapNode?.(b)}
            style={{ left: `${BOT_X}%`, top: `${spread(bots.length, i)}%` }}
            className={
              'absolute flex w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-md border-[3px] px-1 py-1.5 shadow-pop transition-all ' +
              (plugged
                ? 'border-success bg-success-bg text-success'
                : tappable
                  ? 'press border-primary bg-surface text-primary'
                  : 'border-neutral bg-surface text-text')
            }
          >
            <span className="material-symbols-rounded text-[20px] leading-none">{bot.icon}</span>
            <span className="font-label text-[9px] font-bold leading-tight">{bot.name}</span>
          </button>
        )
      })}

      {systems.map((s, i) => {
        const sys = SYSTEMS[s]
        const tappable = activeSystems.includes(s)
        const isPending = pending === s
        const plugged = hubMode && hubPlugged.includes(s)
        return (
          <button
            key={s}
            type="button"
            disabled={!tappable}
            onClick={() => tappable && (hubMode ? onTapNode?.(s) : onTapSystem?.(s))}
            style={{ left: `${SYS_X}%`, top: `${spread(systems.length, i)}%` }}
            className={
              'absolute flex w-[74px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-md border-[3px] px-1 py-1.5 shadow-pop transition-all ' +
              (plugged
                ? 'border-success bg-success-bg text-success'
                : isPending
                  ? 'border-primary bg-primary text-white'
                  : tappable
                    ? 'press border-primary bg-surface text-primary'
                    : 'border-neutral bg-surface text-text-muted')
            }
          >
            {hubMode && plugged ? (
              <UniversalPlug size={18} />
            ) : (
              <Shape shape={sys.shape} size={18} />
            )}
            <span className="font-label text-[9px] font-bold leading-tight">{sys.name}</span>
          </button>
        )
      })}

      {/* The plug choices appear next to the socket you just tapped, so the
          thing that responds is the thing you touched. */}
      {pending && !hubMode && (
        <div
          className={
            'absolute z-10 flex items-center gap-0.5 rounded-md border-[3px] bg-surface p-1 shadow-pop ' +
            (wrong ? 'border-danger' : 'border-primary')
          }
          style={{
            left: `calc(${SYS_X}% - 44px)`,
            top: `${spread(systems.length, systems.indexOf(pending))}%`,
            transform: 'translate(-100%, -50%)',
          }}
        >
          {PLUGS.map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => onTapPlug?.(shape)}
              className="press flex h-8 w-8 items-center justify-center rounded-sm border-2 border-neutral bg-surface text-primary"
            >
              <Shape shape={shape} size={17} />
            </button>
          ))}
          <span
            className={
              'absolute -right-[7px] h-3 w-3 rotate-45 border-r-[3px] border-t-[3px] bg-surface ' +
              (wrong ? 'border-danger' : 'border-primary')
            }
            style={{ top: 'calc(50% - 6px)' }}
          />
        </div>
      )}
    </div>
  )
}

// --- game -----------------------------------------------------------------

export default function McpGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)

  const [phase, setPhase] = useState('wire') // wire | predict | tangle | hub | proof | reveal
  const [stage, setStage] = useState(0)
  const [links, setLinks] = useState([])
  const [pending, setPending] = useState(null)
  const [wrong, setWrong] = useState(null)
  const [picked, setPicked] = useState(null)
  const [hubPlugged, setHubPlugged] = useState([])
  const [stockPlugged, setStockPlugged] = useState(false)
  const [reached, setReached] = useState(0)

  useGameScroll(`${phase}:${stage}`)

  // After the new system is plugged in, each bot reaches it one after the
  // other. Nobody wired them to it. They were already compatible.
  useEffect(() => {
    if (!stockPlugged) return
    const timers = HUB.bots.map((_, i) => setTimeout(() => setReached(i + 1), 350 * (i + 1)))
    return () => timers.forEach(clearTimeout)
  }, [stockPlugged])

  const st = STAGES[stage]
  const isConnected = (bot, system) => links.some((l) => l.bot === bot && l.system === system)

  function tapSystem(sysId) {
    if (isConnected(st.target, sysId)) return
    setWrong(null)
    setPending((p) => (p === sysId ? null : sysId))
  }

  function tapPlug(shape) {
    if (!pending) return
    if (SYSTEMS[pending].shape === shape) {
      setLinks((prev) => [...prev, { bot: st.target, system: pending }])
      setPending(null)
      setWrong(null)
    } else {
      setWrong(`That plug does not fit ${SYSTEMS[pending].name}. Look at its socket.`)
    }
  }

  function nextStage() {
    setPending(null)
    setWrong(null)
    if (stage < STAGES.length - 1) {
      setStage((s) => s + 1)
    } else {
      setPhase('predict')
    }
  }

  function answerPredict(value) {
    setPicked(value)
    if (value === PREDICT.correct) {
      // draw the full tangle: every bot to every system
      const all = []
      HUB.bots.forEach((b) => HUB.systems.forEach((s) => all.push({ bot: b, system: s })))
      setLinks(all)
    }
  }

  function tapHubNode(id) {
    setHubPlugged((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const counter = (n, label, tone = 'neutral') => (
    <div
      className={
        'flex items-center justify-center gap-2 rounded-md border-[3px] px-3 py-1.5 shadow-pop ' +
        (tone === 'good'
          ? 'border-success bg-success-bg text-success'
          : 'border-neutral bg-surface text-text')
      }
    >
      <span className="font-display text-lg font-extrabold leading-none">{n}</span>
      <span className="font-label text-[10px] leading-tight">{label}</span>
    </div>
  )

  // --- reveal -------------------------------------------------------------
  if (phase === 'reveal') {
    return (
      <div className="flex flex-col gap-3 text-center">
        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-neutral bg-success shadow-pop">
          <span className="material-symbols-rounded fill text-5xl text-white">check</span>
        </div>
        <p className="font-label text-[11px] text-primary">
          Snapped onto your bot · {term.botPart}
        </p>
        <h2 className="text-2xl">You just learned the term MCP</h2>

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

  // --- proof: one new system, one plug ------------------------------------
  if (phase === 'proof') {
    const systems = [...HUB.systems, NEW_SYSTEM]
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · The wiring board</p>
          <h1 className="text-2xl leading-tight">A tool nobody planned for</h1>
          <p className="mt-1 text-[13px] leading-snug text-text">
            A stock tracking tool was built last month by a company that has never heard of you.
            Your bots were built before that tool existed. Nobody has ever put these two things in
            the same room.
          </p>
          <p className="mt-2 text-[13px] font-bold leading-snug text-text">
            But it uses the same plug. Tap it in.
          </p>
        </div>

        <Board
          bots={HUB.bots}
          systems={systems}
          hubMode
          hubPlugged={[...hubPlugged, ...(stockPlugged ? [NEW_SYSTEM] : [])]}
          activeSystems={stockPlugged ? [] : [NEW_SYSTEM]}
          onTapNode={() => setStockPlugged(true)}
        />

        {stockPlugged ? (
          <>
            <div className="flex flex-col gap-1.5">
              {HUB.bots.map((b, i) => (
                <div
                  key={b}
                  className={
                    'flex items-center gap-2 rounded-md border-[3px] px-3 py-2 transition-all duration-300 ' +
                    (reached > i
                      ? 'translate-y-0 border-success bg-success-bg opacity-100 shadow-pop'
                      : 'translate-y-1 border-neutral bg-muted opacity-0')
                  }
                >
                  <span className="material-symbols-rounded fill text-[18px] text-success">
                    check_circle
                  </span>
                  <span className="text-[13px] font-bold text-text">
                    {BOTS[b].name} can use it. Immediately.
                  </span>
                </div>
              ))}
            </div>

            {reached === HUB.bots.length && (
              <>
                <div className="rounded-lg border-[3px] border-success bg-success-bg p-3 shadow-pop">
                  <p className="text-[15px] font-bold leading-snug text-success">
                    Nobody built a bridge. Nobody asked permission.
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-text">
                    The people who made the stock tool and the people who made your bots never
                    spoke. They both built to the same plug, so the two sides were compatible before
                    they ever met.
                  </p>
                  <p className="mt-2 text-[13px] leading-snug text-text">
                    The old way, this tool would sit there unusable until somebody found the time to
                    build three separate connectors for it. And a fourth one, the day you add
                    another bot.
                  </p>
                </div>
                <GameActions>
                  <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
                    See what this means
                  </GameActionButton>
                </GameActions>
              </>
            )}
          </>
        ) : (
          <p className="text-center font-label text-[11px] text-text-muted">
            Tap the Stock system to plug it in
          </p>
        )}
      </div>
    )
  }

  // --- hub: everyone agrees on one plug -----------------------------------
  if (phase === 'hub') {
    const allNodes = [...HUB.bots, ...HUB.systems]
    const left = allNodes.filter((n) => !hubPlugged.includes(n))
    const done = left.length === 0
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · The wiring board</p>
          <h1 className="text-2xl leading-tight">One shared plug</h1>
          <p className="mt-1 text-[13px] leading-snug text-text">
            Now everyone agrees to use the same plug. No matching, no shapes. Tap each bot and each
            system once.
          </p>
        </div>

        <Board
          bots={HUB.bots}
          systems={HUB.systems}
          hubMode
          hubPlugged={hubPlugged}
          activeBots={HUB.bots.filter((b) => !hubPlugged.includes(b))}
          activeSystems={HUB.systems.filter((s) => !hubPlugged.includes(s))}
          onTapNode={tapHubNode}
        />

        <div className="grid grid-cols-2 gap-2">
          {counter(12, 'custom connections, the old way')}
          {counter(hubPlugged.length, `plug ins so far, of ${allNodes.length}`, 'good')}
        </div>

        {done ? (
          <>
            <div className="rounded-lg border-[3px] border-success bg-success-bg p-3 text-center shadow-pop">
              <p className="text-[15px] font-bold leading-snug text-success">
                3 + 4 = 7, not 3 x 4 = 12.
              </p>
              <p className="mt-1 text-[13px] leading-snug text-text">
                Because no side has to know about any other side any more. Each one only has to know
                the plug.
              </p>
            </div>
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('proof')}>
                Now the useful part
              </GameActionButton>
            </GameActions>
          </>
        ) : (
          <p className="text-center font-label text-[11px] text-text-muted">
            {left.length} left to plug in
          </p>
        )}
      </div>
    )
  }

  // --- predict: the multiplication ----------------------------------------
  if (phase === 'predict') {
    const right = picked === PREDICT.correct
    const chosen = PREDICT.options.find((o) => o.value === picked)
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · The wiring board</p>
          <h1 className="text-2xl leading-tight">Before you wire the next one</h1>
          <p className="mt-1 text-[13px] leading-snug text-text">{PREDICT.question}</p>
        </div>

        <Board bots={HUB.bots} systems={HUB.systems} links={links} />

        <div className="grid grid-cols-3 gap-2">
          {PREDICT.options.map((o) => {
            const isPick = picked === o.value
            const isRight = o.value === PREDICT.correct
            return (
              <button
                key={o.value}
                type="button"
                disabled={right}
                onClick={() => answerPredict(o.value)}
                className={
                  'rounded-md border-[3px] py-3 font-display text-xl font-extrabold shadow-pop transition-all ' +
                  (isPick && isRight
                    ? 'border-success bg-success-bg text-success'
                    : isPick
                      ? 'border-danger bg-danger-bg text-danger'
                      : 'press border-neutral bg-surface text-text')
                }
              >
                {o.label}
              </button>
            )
          })}
        </div>

        {picked !== null && (
          <div
            className={
              'rounded-lg border-[3px] p-3 shadow-pop ' +
              (right ? 'border-success bg-success-bg' : 'border-danger bg-danger-bg')
            }
          >
            <p className="text-[13px] leading-snug text-text">{chosen.why}</p>
          </div>
        )}

        {right && (
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('hub')}>
              There has to be a better way
            </GameActionButton>
          </GameActions>
        )}
      </div>
    )
  }

  // --- wire ---------------------------------------------------------------
  const remaining = st.systems.filter((s) => !isConnected(st.target, s))
  const stageDone = remaining.length === 0

  return (
    <div className="flex flex-col gap-3">
      {stage === 0 ? (
        <GameIntro term={term} />
      ) : (
        <div className="rounded-lg border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[11px] text-primary">Game · The wiring board</p>
          <h1 className="text-2xl leading-tight">MCP</h1>
          <p className="mt-1 font-label text-[11px] text-text-muted">{st.hint}</p>
        </div>
      )}

      {st.banner && (
        <div className="rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-3 py-2 text-center shadow-pop">
          <p className="text-[13px] font-bold leading-snug text-cheese-dim">{st.banner}</p>
        </div>
      )}

      {!stageDone && (
        <div
          className={
            'rounded-md border-[3px] px-3 py-2 text-center shadow-pop ' +
            (wrong ? 'border-danger bg-danger-bg' : 'border-primary bg-surface')
          }
        >
          {wrong ? (
            <p className="text-[13px] font-bold leading-snug text-danger">{wrong}</p>
          ) : pending ? (
            <p className="text-[13px] leading-snug text-text">
              <span className="font-bold">{SYSTEMS[pending].name}</span> has a{' '}
              {SHAPE_NAMES[SYSTEMS[pending].shape]} socket. Pick the plug that fits it.
            </p>
          ) : (
            <p className="text-[13px] leading-snug text-text">
              Tap a system to wire the <span className="font-bold">{BOTS[st.target].name}</span> to
              it.
            </p>
          )}
        </div>
      )}

      <Board
        bots={st.bots}
        systems={st.systems}
        links={links}
        activeSystems={remaining}
        pending={pending}
        wrong={wrong}
        onTapSystem={tapSystem}
        onTapPlug={tapPlug}
      />

      <div className="flex justify-center">
        {counter(
          links.length,
          links.length === 1 ? 'custom connection built' : 'custom connections built',
        )}
      </div>

      {stageDone && (
        <>
          <p className="text-center font-label text-[11px] font-bold text-success">
            {BOTS[st.target].name} is wired to all {st.systems.length} systems.
          </p>
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={nextStage}>
              {stage === STAGES.length - 1 ? 'Finally, done' : 'Next'}
            </GameActionButton>
          </GameActions>
        </>
      )}
    </div>
  )
}
