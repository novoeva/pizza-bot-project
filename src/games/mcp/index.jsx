import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { BOT, SHAPES, SYSTEMS, EXTRA, STRANGER, WEEKS_PER_ADAPTER, usbTitle, usbBody } from './systems.js'
import terms from '../../content/terms.json'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import StatusStrip from '../../components/StatusStrip.jsx'
import GameStage from '../../components/GameStage.jsx'

/**
 * MCP game, { termId, onComplete } interface.
 *
 * Plugs and sockets (PIZZA-23 round 2). Beat 1, "Before MCP": your bot has a
 * round plug, every system has its own socket shape. Tap a system to plug in:
 * one fits, the others don't, so you build an adapter for each (weeks, and you
 * maintain them). A fourth tool arrives with yet another shape. Beat 2, "With
 * MCP": one shared socket shape everyone agreed on. The same systems click
 * straight in, and so does a tool a stranger built. Then the recap.
 */
export default function McpGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)

  const [phase, setPhase] = useState('old') // old | mcp | reveal
  // Beat 1: per system, 'todo' | 'nofit' (tried, wrong shape) | 'fit' | 'adapter'
  const [oldState, setOldState] = useState({})
  // Beat 2: ids clicked into MCP
  const [mcpIn, setMcpIn] = useState([])
  const [strangerIn, setStrangerIn] = useState(false)

  const basicsDone = SYSTEMS.every((s) => ['fit', 'adapter'].includes(oldState[s.id]))
  const extraTried = oldState[EXTRA.id] === 'nofit'
  const adapters = Object.values(oldState).filter((v) => v === 'adapter').length
  const weeks = adapters * WEEKS_PER_ADAPTER
  const mcpSystems = [...SYSTEMS, EXTRA]
  const allMcpIn = mcpSystems.every((s) => mcpIn.includes(s.id))

  useGameScroll(phase, `${Object.keys(oldState).length}:${adapters}:${basicsDone}:${extraTried}:${mcpIn.length}:${strangerIn}`)

  function tryPlug(sys) {
    setOldState((prev) => ({ ...prev, [sys.id]: sys.socket === BOT.plug ? 'fit' : 'nofit' }))
  }
  function buildAdapter(sys) {
    setOldState((prev) => ({ ...prev, [sys.id]: 'adapter' }))
  }
  function clickIn(id) {
    setMcpIn((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  // --- reveal -------------------------------------------------------------
  if (phase === 'reveal') {
    return (
      <TermReveal
        term={term}
        onComplete={onComplete}
        aside={
          <Callout tone="info" title={usbTitle} icon="usb" compact>
            {usbBody}
          </Callout>
        }
      />
    )
  }

  // --- beat 2: one shared shape ------------------------------------------
  if (phase === 'mcp') {
    const main = (
      <>
        <PhaseCard title="With MCP" meta={`${mcpIn.length + (strangerIn ? 1 : 0)} connected`}>
          MCP is one socket shape everyone agreed on, like USB-C. Your bot now has the MCP plug. Tap
          each system to plug it in.
        </PhaseCard>

        <BotCard plug="mcp" sub="one plug, the shared MCP shape" />

        <div className="flex flex-col gap-2">
          {mcpSystems.map((sys) => {
            const isIn = mcpIn.includes(sys.id)
            return (
              <SystemCard
                key={sys.id}
                sys={{ ...sys, socket: 'mcp' }}
                tone={isIn ? 'good' : 'todo'}
                status={isIn ? 'Clicks in. 0 weeks, nothing to maintain.' : 'MCP socket. Same shape as your plug.'}
                graphic={<Fit plug="mcp" socket="mcp" state={isIn ? 'fit' : 'ready'} />}
                action={
                  !isIn && (
                    <RowButton icon="power" onClick={() => clickIn(sys.id)}>
                      Plug in
                    </RowButton>
                  )
                }
              />
            )
          })}
        </div>

        <StatusStrip tone={allMcpIn ? 'success' : 'info'} big="0 wks">
          {mcpIn.length} of {mcpSystems.length} connected · 0 adapters
        </StatusStrip>

        {allMcpIn && (
          <>
            <Callout tone="info" title="A tool nobody planned for" icon="new_releases" compact>
              A {STRANGER.name.toLowerCase()} built last month by a company that has never heard of
              your bot. The old way you would build it an adapter first. But it has the MCP socket.
            </Callout>
            <SystemCard
              sys={STRANGER}
              tone={strangerIn ? 'good' : 'todo'}
              status={strangerIn ? 'Clicks in. You waited for no one.' : 'MCP socket, built by strangers.'}
              graphic={<Fit plug="mcp" socket="mcp" state={strangerIn ? 'fit' : 'ready'} />}
              action={
                !strangerIn && (
                  <RowButton icon="power" onClick={() => setStrangerIn(true)}>
                    Plug in
                  </RowButton>
                )
              }
            />
          </>
        )}

        {strangerIn && (
          <>
            <Callout tone="success" title="It just connected. Nobody built anything." compact>
              The people who built the stock tracker and the people who built your bot never spoke.
              Both used the same shape, so the two sides fit before they ever met.
            </Callout>
            <ShapePicture adapters={adapters} />
          </>
        )}
      </>
    )
    return (
      <>
        <GameStage term={term} main={main} progress={{ part: 2, parts: 2 }} />
        {strangerIn && (
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
              See what this means
            </GameActionButton>
          </GameActions>
        )}
      </>
    )
  }

  // --- beat 1: every system has its own shape ----------------------------
  const oldSystems = basicsDone ? [...SYSTEMS, EXTRA] : SYSTEMS
  const main = (
    <>
      <PhaseCard title="Before MCP" meta={adapters > 0 ? `${adapters} adapter${adapters === 1 ? '' : 's'}` : undefined}>
        Your bot has a round plug. Each system has its own socket shape. Tap a system to try plugging
        your bot in.
      </PhaseCard>

      <BotCard plug={BOT.plug} sub="one round plug" />

      <div className="flex flex-col gap-2">
        {oldSystems.map((sys) => {
          const st = oldState[sys.id] ?? 'todo'
          const shape = SHAPES[sys.socket].label
          const isExtra = sys.id === EXTRA.id
          return (
            <SystemCard
              key={sys.id}
              sys={sys}
              tone={st === 'fit' ? 'good' : st === 'adapter' ? 'custom' : st === 'nofit' ? 'bad' : 'todo'}
              status={
                st === 'todo'
                  ? `${cap(shape)} socket.`
                  : st === 'fit'
                    ? 'Fits. Round socket, round plug. Connected.'
                    : st === 'nofit'
                      ? `Doesn't fit. ${cap(shape)} socket, round plug.`
                      : `Connected through an adapter. ${WEEKS_PER_ADAPTER} weeks to build, and it's yours to maintain.`
              }
              graphic={<Fit plug={BOT.plug} socket={sys.socket} state={st} />}
              action={
                st === 'todo' ? (
                  <RowButton icon="power" onClick={() => tryPlug(sys)}>
                    Plug in
                  </RowButton>
                ) : st === 'nofit' && !isExtra ? (
                  <RowButton icon="build" tone="warn" onClick={() => buildAdapter(sys)}>
                    Build an adapter · {WEEKS_PER_ADAPTER} wks
                  </RowButton>
                ) : null
              }
            />
          )
        })}
      </div>

      <StatusStrip tone={adapters > 0 ? 'problem' : 'info'} big={`${weeks} wks`}>
        {adapters} adapter{adapters === 1 ? '' : 's'} you build and maintain
      </StatusStrip>

      {basicsDone && !extraTried && (
        <Callout tone="info" title="Now you want a loyalty app" icon="loyalty" compact>
          Of course it has its own socket shape too. Try it.
        </Callout>
      )}

      {extraTried && (
        <Callout tone="problem" title="Every new system is a new shape" icon="build" compact>
          Another adapter, another {WEEKS_PER_ADAPTER} weeks, another thing that breaks when they
          change something. There has to be a better way.
        </Callout>
      )}
    </>
  )

  return (
    <>
      <GameStage term={term} main={main} progress={{ part: 1, parts: 2 }} />
      {extraTried && (
        <GameActions>
          <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('mcp')}>
            Show me the better way
          </GameActionButton>
        </GameActions>
      )}
    </>
  )
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

// The bot's card at the top of both beats, with its plug shape on the right.
function BotCard({ plug, sub }) {
  const mcp = plug === 'mcp'
  return (
    <div
      className={
        'flex items-center gap-3 rounded-lg border-[3px] px-3 py-2.5 shadow-pop ' +
        (mcp ? 'border-primary bg-accent-soft' : 'border-neutral bg-surface')
      }
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-[3px] border-neutral bg-primary text-white">
        <span className="material-symbols-rounded text-[22px]">{BOT.icon}</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-extrabold leading-none">Your {BOT.name}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-text-muted">{sub}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <Shape kind={plug} variant="plug" size={30} />
        <span className="font-label text-[9px] text-text-muted">{mcp ? 'MCP plug' : 'plug'}</span>
      </div>
    </div>
  )
}

// One system: icon, name, what it does, its socket shape, a status line, and
// (when there is something to do) one button.
function SystemCard({ sys, tone = 'todo', status, graphic, action }) {
  const border =
    tone === 'good'
      ? 'border-success bg-success-bg'
      : tone === 'bad'
        ? 'border-danger bg-danger-bg'
        : tone === 'custom'
          ? 'border-cheese-dim bg-cheese-bg'
          : 'border-neutral bg-surface'
  return (
    <div className={'rounded-md border-[3px] px-3 py-2.5 shadow-pop ' + border}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-neutral bg-surface text-text">
          <span className="material-symbols-rounded text-[20px]">{sys.icon}</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight">{sys.name}</p>
          <p className="text-[11px] leading-snug text-text-muted">{sys.desc}</p>
        </div>
        <div className="shrink-0">{graphic}</div>
      </div>
      {(status || action) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {status && <p className="text-[12px] leading-snug text-text">{status}</p>}
          {action}
        </div>
      )}
    </div>
  )
}

// The small in-card button (the pinned bar stays for the phase's forward move).
function RowButton({ icon, tone = 'primary', onClick, children }) {
  const cls =
    tone === 'warn'
      ? 'border-cheese-dim bg-cheese-bg text-cheese-dim'
      : 'border-neutral bg-tertiary text-white'
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center gap-1 rounded-md border-[3px] px-2.5 py-1.5 font-label text-[11px] font-bold shadow-pop ' + cls
      }
    >
      <span className="material-symbols-rounded text-[16px]">{icon}</span>
      {children}
    </button>
  )
}

/**
 * Plug meets socket, as a small picture:
 *   ready    plug … socket (not tried yet)
 *   fit      plug = socket, same shape, green
 *   nofit    plug ✕ socket, different shapes, red
 *   adapter  plug → [adapter] → socket, amber
 */
function Fit({ plug, socket, state, small = false }) {
  const sz = small ? 18 : 24
  const good = state === 'fit'
  const plugColor = good ? 'text-success' : state === 'nofit' ? 'text-danger' : 'text-primary'
  const sockColor = good ? 'text-success' : state === 'nofit' ? 'text-danger' : 'text-text-muted'
  const mid =
    state === 'adapter' ? (
      <span
        className={
          'flex items-center rounded border-2 border-cheese-dim bg-cheese-bg font-label font-bold text-cheese-dim ' +
          (small ? 'h-5 px-0.5 text-[8px]' : 'h-6 px-1 text-[9px]')
        }
        aria-label="adapter"
      >
        {small ? 'adpt' : 'adapter'}
      </span>
    ) : (
      <span
        className={
          'material-symbols-rounded text-[16px] ' +
          (good ? 'text-success' : state === 'nofit' ? 'text-danger' : 'text-text-muted')
        }
        aria-hidden="true"
      >
        {good ? 'check' : state === 'nofit' ? 'close' : 'more_horiz'}
      </span>
    )
  return (
    <div className="flex items-center gap-1" aria-label={`${plug} plug, ${socket} socket, ${state}`}>
      <Shape kind={plug} variant="plug" size={sz} className={plugColor} />
      {mid}
      <Shape kind={socket} variant="socket" size={sz} className={sockColor} />
    </div>
  )
}

/** A plug (filled) or a socket (outlined hole) in one of the five shapes. */
function Shape({ kind, variant = 'plug', size = 24, className = '' }) {
  const plug = variant === 'plug'
  const common = plug
    ? { fill: 'currentColor', stroke: 'none' }
    : { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeDasharray: '4 2.5' }
  let body
  switch (kind) {
    case 'square':
      body = <rect x="4" y="4" width="16" height="16" rx="2" {...common} />
      break
    case 'triangle':
      body = <polygon points="12,3.5 21,20 3,20" strokeLinejoin="round" {...common} />
      break
    case 'hex':
      body = <polygon points="12,2.5 20.5,7.2 20.5,16.8 12,21.5 3.5,16.8 3.5,7.2" strokeLinejoin="round" {...common} />
      break
    case 'mcp':
      body = <rect x="2" y="6.5" width="20" height="11" rx="5.5" {...common} />
      break
    default:
      body = <circle cx="12" cy="12" r="8.5" {...common} />
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={'shrink-0 ' + className}
      aria-hidden="true"
    >
      {body}
    </svg>
  )
}

/** The closing picture: four different sockets and their adapters, versus one shared shape. */
function ShapePicture({ adapters }) {
  const all = [...SYSTEMS, EXTRA, STRANGER]
  return (
    <div>
      <p className="mb-2 font-label text-[11px] text-text-muted">What you just did, as a picture</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border-[3px] border-neutral bg-surface p-3 shadow-pop">
          <p className="font-label text-[10px] font-bold text-danger">Before · every system its own shape</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {all
              .filter((s) => s.id !== STRANGER.id)
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-1">
                  <span className="min-w-0 flex-1 truncate text-[10px]">{s.name}</span>
                  <Fit small plug={BOT.plug} socket={s.socket} state={s.socket === BOT.plug ? 'fit' : 'adapter'} />
                </div>
              ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-text-muted">
            {adapters} adapter{adapters === 1 ? '' : 's'} built, {adapters * WEEKS_PER_ADAPTER} weeks, and a new
            one for every new tool.
          </p>
        </div>
        <div className="rounded-md border-[3px] border-success bg-success-bg p-3 shadow-pop">
          <p className="font-label text-[10px] font-bold text-success">With MCP · one shape for all</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {all.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-1">
                <span className="min-w-0 flex-1 truncate text-[10px]">{s.name}</span>
                <Fit small plug="mcp" socket="mcp" state="fit" />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-text-muted">
            0 adapters, 0 weeks, and the next tool fits too.
          </p>
        </div>
      </div>
    </div>
  )
}
