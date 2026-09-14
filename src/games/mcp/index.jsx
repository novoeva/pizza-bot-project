import { useState } from 'react'
import { useGameScroll } from '../../lib/useGameScroll.js'
import { BOT, NEEDED, EXTRA, STRANGER, FORMATS, STEPS, WEEKS_PER_CONNECTOR } from './systems.js'
import terms from '../../content/terms.json'
import GameActions, { GameActionButton } from '../../components/GameActions.jsx'
import TermReveal from '../../components/TermReveal.jsx'
import Callout from '../../components/Callout.jsx'
import PhaseCard from '../../components/PhaseCard.jsx'
import StatusStrip from '../../components/StatusStrip.jsx'
import GameStage from '../../components/GameStage.jsx'
import SelectableCard from '../../components/SelectableCard.jsx'
import ChoiceGroup from '../../components/ChoiceGroup.jsx'

/**
 * MCP game, { termId, onComplete } interface.
 *
 * You are the owner with ONE bot that needs to reach the systems your pizzeria
 * runs on. Phases: old → mcp → proof → reveal.
 *
 * PIZZA-23: the old way is no longer narrated, it is DONE. Each custom
 * integration is a five-step wizard the player taps through (pick the data
 * format, map three field names, copy the access key, run a test, fix what
 * broke), in full for Menu and again for Delivery, then a one-tap "all five
 * again" for Bookings once the pain is felt twice. The Loyalty app then
 * arrives and asks: start over from step 1? Taps and weeks accumulate on
 * screen. The MCP phase stays click-click-green, and that contrast is the
 * lesson: one shared standard instead of one custom integration per system.
 * The proof phase (a stranger's tool connects) ends on a before/after wiring
 * diagram that the recap repeats.
 */

// The bot's card at the top of every build screen. Learns the standard once
// MCP is on.
function BotCard({ sub, mcp = false }) {
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
      <div className="min-w-0">
        <p className="font-display text-lg font-extrabold leading-none">Your {BOT.name}</p>
        <p className="mt-0.5 text-[12px] leading-snug text-text-muted">{sub}</p>
      </div>
      {mcp && (
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border-2 border-primary bg-surface px-2 py-0.5 font-label text-[10px] font-bold text-primary">
          <span className="material-symbols-rounded text-[14px]">hub</span>
          speaks MCP
        </span>
      )}
    </div>
  )
}

// One system the bot connects to. `right` is the action or status on the trailing edge.
function SystemRow({ sys, tone = 'todo', note, right }) {
  const border =
    tone === 'custom'
      ? 'border-cheese-dim bg-cheese-bg'
      : tone === 'mcp'
        ? 'border-success bg-success-bg'
        : 'border-neutral bg-surface'
  return (
    <div className={'flex items-center gap-3 rounded-md border-[3px] px-3 py-2 shadow-pop ' + border}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-neutral bg-surface text-text">
        <span className="material-symbols-rounded text-[20px]">{sys.icon}</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-tight">{sys.name}</p>
        <p className="text-[11px] leading-snug text-text-muted">{note ?? sys.desc}</p>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  )
}

// "Wired" / "In" trailing labels for a SystemRow.
function Wired() {
  return (
    <span className="flex items-center gap-1 font-label text-[11px] font-bold text-cheese-dim">
      <span className="material-symbols-rounded text-[16px]">build</span>
      Wired
    </span>
  )
}
function In() {
  return (
    <span className="flex items-center gap-1 font-label text-[11px] font-bold text-success">
      <span className="material-symbols-rounded text-[16px]">check_circle</span>
      In
    </span>
  )
}

// A cost counter: the shared status strip with a big figure.
function Counter({ n, label, tone = 'neutral' }) {
  const t = tone === 'good' ? 'success' : tone === 'bad' ? 'problem' : 'info'
  return (
    <StatusStrip tone={t} big={n}>
      {label}
    </StatusStrip>
  )
}

// A finished wizard step, folded to one amber line so the pile of things you
// did stays on screen while you do the next one.
function DoneLine({ children }) {
  return (
    <li className="flex items-start gap-1.5 text-[12px] leading-snug text-text">
      <span className="material-symbols-rounded mt-px shrink-0 text-[15px] text-cheese-dim" aria-hidden="true">
        check
      </span>
      <span>{children}</span>
    </li>
  )
}

// The system's "docs": the facts you need for the five steps. Plain info card,
// so the player is never asked to guess something they were not shown.
function Docs({ sys }) {
  return (
    <Callout tone="info" compact title={`${sys.name}'s docs, 14 pages. The useful bits:`} icon="description">
      <ul className="flex flex-col gap-0.5 text-[12px]">
        <li>
          Sends <b>{sys.format}</b>
        </li>
        <li>
          Access key <b className="font-label">{sys.key}</b>
        </li>
        <li>
          Fields:{' '}
          {sys.fields.map((f, i) => (
            <span key={f.theirs}>
              <b className="font-label">{f.theirs}</b> ({f.hint}){i < sys.fields.length - 1 ? ', ' : ''}
            </span>
          ))}
        </li>
      </ul>
    </Callout>
  )
}

/**
 * Before / after wiring diagram. Left: every system on its own custom wire to
 * the bot, crossing each other, amber because each is a thing you built and
 * maintain. Right: the same systems plugged into one MCP hub, green, one
 * standard. Inline SVG on house tokens, so it follows the theme.
 */
const NODES = [
  { id: 'menu', label: 'Menu', x: 34, y: 92 },
  { id: 'stock', label: 'Stock', x: 166, y: 92 },
  { id: 'delivery', label: 'Delivery', x: 34, y: 162 },
  { id: 'bookings', label: 'Bookings', x: 166, y: 162 },
  { id: 'loyalty', label: 'Loyalty', x: 100, y: 192 },
]
const BOT_XY = { x: 100, y: 22 }
const HUB_XY = { x: 100, y: 112 }
// Custom wires: each takes its own detour so they cross, the way five
// hand-built integrations do.
const WIRES = {
  menu: 'M34,80 C34,40 160,84 100,34',
  stock: 'M166,80 C166,40 40,84 100,34',
  delivery: 'M34,150 C120,150 184,60 100,34',
  bookings: 'M166,150 C80,150 16,60 100,34',
  loyalty: 'M100,180 C30,120 170,110 100,34',
}
const DASHES = { menu: '', stock: '5 3', delivery: '2 3', bookings: '9 3', loyalty: '1 4' }

function NodeBox({ x, y, label }) {
  return (
    <g>
      <rect x={x - 28} y={y - 12} width="56" height="24" rx="5" strokeWidth="2.5" className="fill-surface stroke-neutral" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" className="fill-text font-label">
        {label}
      </text>
    </g>
  )
}
function BotBox() {
  return (
    <g>
      <rect x={BOT_XY.x - 32} y={BOT_XY.y - 13} width="64" height="26" rx="6" strokeWidth="2.5" className="fill-primary stroke-neutral" />
      <text x={BOT_XY.x} y={BOT_XY.y + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" className="fill-white font-label">
        Your bot
      </text>
    </g>
  )
}

function DiagramPanel({ tone, title, sub, children }) {
  const head = tone === 'bad' ? 'border-danger bg-danger-bg text-danger' : 'border-success bg-success-bg text-success'
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border-[3px] border-neutral bg-surface p-2 shadow-pop">
      <p className={'rounded-md border-2 px-2 py-1 text-center font-label text-[10px] font-bold leading-tight ' + head}>{title}</p>
      <svg viewBox="0 0 200 210" className="w-full" role="img" aria-label={title}>
        {children}
      </svg>
      <p className="text-center text-[11px] leading-snug text-text-muted">{sub}</p>
    </div>
  )
}

function WiringDiagram({ weeks, oldTaps, mcpTaps, builtCount }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <DiagramPanel
        tone="bad"
        title="Before: 5 custom wires you build and maintain"
        sub={`You built ${builtCount} of them: ${weeks} wks, ${oldTaps} taps.`}
      >
        {NODES.map((n) => (
          <path
            key={n.id}
            d={WIRES[n.id]}
            fill="none"
            strokeWidth="2.5"
            strokeDasharray={DASHES[n.id] || undefined}
            strokeLinecap="round"
            className="stroke-cheese-dim"
          />
        ))}
        <BotBox />
        {NODES.map((n) => (
          <NodeBox key={n.id} {...n} />
        ))}
      </DiagramPanel>
      <DiagramPanel tone="good" title="With MCP: 1 shared standard" sub={`All 5 connected: 0 wks, ${mcpTaps} taps.`}>
        <line x1={BOT_XY.x} y1={BOT_XY.y + 13} x2={HUB_XY.x} y2={HUB_XY.y} strokeWidth="3" className="stroke-success" />
        {NODES.map((n) => (
          <line key={n.id} x1={n.x} y1={n.y} x2={HUB_XY.x} y2={HUB_XY.y} strokeWidth="3" className="stroke-success" />
        ))}
        <BotBox />
        {NODES.map((n) => (
          <NodeBox key={n.id} {...n} />
        ))}
        <circle cx={HUB_XY.x} cy={HUB_XY.y} r="21" strokeWidth="2.5" className="fill-success stroke-neutral" />
        <text x={HUB_XY.x} y={HUB_XY.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" className="fill-white font-label">
          MCP
        </text>
      </DiagramPanel>
    </div>
  )
}

export default function McpGame({ termId, onComplete }) {
  const term = terms.find((t) => t.id === termId)

  const [phase, setPhase] = useState('old') // old | mcp | proof | reveal

  // --- old way: the five-step wizard -------------------------------------
  const [sysIdx, setSysIdx] = useState(0) // 0 Menu, 1 Delivery (full wizard), 2 Bookings (one tap), 3 Loyalty
  const [step, setStep] = useState(0) // 0 format, 1 fields, 2 key, 3 test, 4 fix, 5 wired
  const [mapIdx, setMapIdx] = useState(0) // which of the three fields you are on
  const [miss, setMiss] = useState(null) // what went wrong on the last tap, if anything
  const [built, setBuilt] = useState([]) // ids wired the custom way
  const [oldTaps, setOldTaps] = useState(0) // every tap the old way costs you
  const [loyaltyChoice, setLoyaltyChoice] = useState(null) // 'again' | 'better'

  // --- mcp / proof ---------------------------------------------------------
  const [mcpOn, setMcpOn] = useState(false) // the bot speaks the standard
  const [connected, setConnected] = useState([]) // ids connected over MCP
  const [mcpTaps, setMcpTaps] = useState(0)
  const [strangerIn, setStrangerIn] = useState(false)

  const oldSystems = [...NEEDED, EXTRA]
  const mcpSystems = [...NEEDED, EXTRA]
  const sys = NEEDED[Math.min(sysIdx, NEEDED.length - 1)]
  const allConnected = mcpSystems.every((s) => connected.includes(s.id))
  const weeks = built.length * WEEKS_PER_CONNECTOR

  useGameScroll(
    phase,
    `${sysIdx}:${step}:${mapIdx}:${miss}:${loyaltyChoice}:${mcpOn}:${connected.length}:${strangerIn}`,
  )

  function tapOld() {
    setOldTaps((n) => n + 1)
  }
  function wire(id) {
    setBuilt((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }
  function tapFormat(fmt) {
    tapOld()
    if (fmt === sys.format) {
      setMiss(null)
      setStep(1)
    } else {
      setMiss(`${sys.name} doesn't send ${fmt}. Check their docs.`)
    }
  }
  function tapField(theirs) {
    tapOld()
    const want = sys.fields[mapIdx]
    if (theirs === want.theirs) {
      setMiss(null)
      if (mapIdx + 1 < sys.fields.length) {
        setMapIdx(mapIdx + 1)
      } else {
        setMapIdx(0)
        setStep(2)
      }
    } else {
      const f = sys.fields.find((x) => x.theirs === theirs)
      setMiss(`Not that one. ${theirs} is ${f.hint}.`)
    }
  }
  function tapKey(k) {
    tapOld()
    if (k === sys.key) {
      setMiss(null)
      setStep(3)
    } else {
      setMiss('Access denied. One character is off. Check the key again.')
    }
  }
  function tapTest() {
    tapOld()
    setMiss(null)
    setStep(4)
  }
  function tapFix(fix) {
    tapOld()
    if (fix.ok) {
      setMiss(null)
      setStep(5)
      wire(sys.id)
    } else {
      setMiss(fix.why)
    }
  }
  function nextSystem() {
    setSysIdx((i) => i + 1)
    setStep(0)
    setMapIdx(0)
    setMiss(null)
  }
  function tapBookingsShortcut() {
    tapOld()
    wire('bookings')
    setSysIdx(3)
  }
  function tapLoyalty(choice) {
    tapOld()
    setLoyaltyChoice(choice)
    if (choice === 'again') wire(EXTRA.id)
  }
  function connect(id) {
    setMcpTaps((n) => n + 1)
    setConnected((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const diagram = (
    <WiringDiagram weeks={weeks} oldTaps={oldTaps} mcpTaps={mcpTaps} builtCount={built.length} />
  )

  // --- reveal -------------------------------------------------------------
  if (phase === 'reveal') {
    return <TermReveal term={term} onComplete={onComplete} aside={diagram} />
  }

  // --- proof: a tool nobody planned for, connects straight away ------------
  if (phase === 'proof') {
    return (
      <GameStage
        term={term}
        progress={{ part: 3, parts: 3 }}
        main={
          <>
            <PhaseCard title="A tool nobody planned for">
              A stock tracker was built last month by a company that has never heard of you or
              your bot. The old way, it would wait until you built it a custom integration: five
              steps, three weeks.
              <span className="mt-2 block font-bold text-text">But it speaks MCP. Connect it.</span>
            </PhaseCard>

            <BotCard sub="speaks MCP, so anything that speaks it too can connect" mcp />

            <SystemRow
              sys={STRANGER}
              tone={strangerIn ? 'mcp' : 'todo'}
              note={strangerIn ? 'connected · 0 weeks · nobody built a bridge' : STRANGER.desc}
              right={
                strangerIn ? (
                  <In />
                ) : (
                  <GameActionButton
                    inline
                    variant="primary"
                    onClick={() => {
                      setMcpTaps((n) => n + 1)
                      setStrangerIn(true)
                    }}
                  >
                    Connect
                  </GameActionButton>
                )
              }
            />

            {strangerIn && (
              <>
                <Callout tone="success" title="It just connected. You waited for no one.">
                  The people who built the stock tracker and the people who built your bot never
                  spoke. Both built to the same standard, so the two sides fit before they ever met.
                </Callout>

                <p className="px-1 font-label text-[11px] text-text-muted">What you just did, as a picture</p>
                {diagram}

                <GameActions>
                  <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('reveal')}>
                    See what this means
                  </GameActionButton>
                </GameActions>
              </>
            )}
          </>
        }
      />
    )
  }

  // --- mcp: one shared standard instead of one integration per system ------
  if (phase === 'mcp') {
    return (
      <GameStage
        term={term}
        progress={{ part: 2, parts: 3, step: connected.length, steps: mcpSystems.length }}
        main={
          <>
            <PhaseCard title="One shared standard">
              Instead of a custom integration per system, everyone builds to one shared standard
              for how tools talk to AI: MCP, the Model Context Protocol. Your bot learns it once.
              Every system that speaks it too just connects. No format, no field names, no key.
            </PhaseCard>

            <BotCard
              sub={mcpOn ? 'speaks the shared standard' : "doesn't speak the shared standard yet"}
              mcp={mcpOn}
            />

            {!mcpOn ? (
              <GameActions>
                <GameActionButton
                  variant="primary"
                  icon="hub"
                  onClick={() => {
                    setMcpTaps((n) => n + 1)
                    setMcpOn(true)
                  }}
                >
                  Teach your bot the standard (MCP)
                </GameActionButton>
              </GameActions>
            ) : (
              <>
                <p className="px-1 font-label text-[11px] text-text-muted">
                  The same systems, now speaking MCP. No five steps. Tap Connect on each one.
                </p>
                <div className="flex flex-col gap-2">
                  {mcpSystems.map((s) => {
                    const isIn = connected.includes(s.id)
                    return (
                      <SystemRow
                        key={s.id}
                        sys={s}
                        tone={isIn ? 'mcp' : 'todo'}
                        note={isIn ? 'connected · 0 wks · nothing to maintain' : 'speaks MCP'}
                        right={
                          isIn ? (
                            <In />
                          ) : (
                            <GameActionButton inline variant="primary" onClick={() => connect(s.id)}>
                              Connect
                            </GameActionButton>
                          )
                        }
                      />
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Counter n={`${weeks} wks`} label={`${oldTaps} taps, the old way`} tone="bad" />
                  <Counter n="0 wks" label={`${mcpTaps} taps, with MCP`} tone="good" />
                </div>

                {allConnected && (
                  <>
                    <Callout tone="success" title="Same systems. One standard. Zero custom integrations.">
                      Neither side has to know anything about the other any more. Both only have to
                      know the standard.
                    </Callout>
                    <GameActions>
                      <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('proof')}>
                        Now the useful part
                      </GameActionButton>
                    </GameActions>
                  </>
                )}
              </>
            )}
          </>
        }
      />
    )
  }

  // --- old: wire each system by hand, five steps a piece --------------------
  const inWizard = sysIdx < 2 // Menu and Delivery get the full wizard
  const atBookings = sysIdx === 2
  const atLoyalty = sysIdx === 3
  const stepNo = Math.min(step, 4) + 1
  const missCard = miss && <Callout tone="problem" compact title={miss} icon="close" />

  function rowNote(s) {
    if (built.includes(s.id)) return `custom integration · ${WEEKS_PER_CONNECTOR} wks · you maintain it`
    if (inWizard && s.id === sys.id) return `wiring by hand · step ${stepNo} of ${STEPS.length}`
    return s.desc
  }

  let wizard = null
  if (inWizard) {
    // The steps you have already done for this system, folded to one line each.
    const done = []
    if (step >= 1) done.push(`Format: ${sys.format}`)
    const mapped = step >= 2 ? sys.fields : sys.fields.slice(0, mapIdx)
    mapped.forEach((f) => done.push(`${f.ours} = ${f.theirs}`))
    if (step >= 3) done.push(`Key: ${sys.key}`)
    if (step >= 4) done.push('Test run: failed')
    if (step >= 5) done.push('Fix applied, test passed')

    wizard = (
      <div className="flex flex-col gap-2 rounded-lg border-[3px] border-cheese-dim bg-cheese-bg p-3 shadow-pop">
        <div className="flex items-center justify-between gap-2">
          <p className="font-label text-[11px] font-bold text-cheese-dim">
            Custom integration · {sys.name}
          </p>
          <p className="shrink-0 font-label text-[11px] text-text-muted">
            step {stepNo} of {STEPS.length} · {STEPS[stepNo - 1]}
          </p>
        </div>

        {step < 5 && <Docs sys={sys} />}

        {done.length > 0 && (
          <ul className="flex flex-col gap-1">
            {done.map((d) => (
              <DoneLine key={d}>{d}</DoneLine>
            ))}
          </ul>
        )}

        {step === 0 && (
          <ChoiceGroup mode="commit" label={`Step 1 · Which format does ${sys.name} send?`} columns={2}>
            {FORMATS.map((fmt) => (
              <SelectableCard key={fmt} mode="commit" variant="tile" icon="data_object" label={fmt} onSelect={() => tapFormat(fmt)} />
            ))}
          </ChoiceGroup>
        )}

        {step === 1 && (
          <ChoiceGroup
            mode="commit"
            label={`Step 2 · Your bot's "${sys.fields[mapIdx].ours}" is ${sys.name}'s…`}
          >
            {sys.fields.map((f, i) => (
              <SelectableCard
                key={f.theirs}
                mode="commit"
                icon="data_table"
                tag={`${sys.name}'s field name`}
                label={f.theirs}
                disabled={i < mapIdx}
                onSelect={() => tapField(f.theirs)}
                labelClassName="font-label"
              />
            ))}
          </ChoiceGroup>
        )}

        {step === 2 && (
          <ChoiceGroup mode="commit" label={`Step 3 · Copy ${sys.name}'s access key`}>
            {sys.keys.map((k) => (
              <SelectableCard
                key={k}
                mode="commit"
                icon="key"
                tag="Access key"
                label={k}
                onSelect={() => tapKey(k)}
                labelClassName="font-label"
              />
            ))}
          </ChoiceGroup>
        )}

        {step === 3 && (
          <ChoiceGroup mode="commit" label="Step 4 · Does it work?" hint="Tap it">
            <SelectableCard mode="commit" icon="play_arrow" tag="Test your integration" label="Run the test" onSelect={tapTest} />
          </ChoiceGroup>
        )}

        {step === 4 && (
          <>
            <Callout tone="problem" compact title="Test failed" icon="bug_report">
              {sys.testFail}
            </Callout>
            <ChoiceGroup mode="commit" label="Step 5 · Fix it">
              {sys.fixes.map((fix) => (
                <SelectableCard key={fix.label} mode="commit" icon="build" tag="Your fix" label={fix.label} onSelect={() => tapFix(fix)} />
              ))}
            </ChoiceGroup>
          </>
        )}

        {step < 5 && missCard}

        {step === 5 && (
          <Callout tone="info" compact title={`${sys.name} is wired. ${WEEKS_PER_CONNECTOR} weeks. You maintain it.`} icon="build">
            If {sys.name} ever changes its format or its key, you are back at step 1.
          </Callout>
        )}
      </div>
    )
  }

  const bookingsCard = atBookings && (
    <div className="flex flex-col gap-2 rounded-lg border-[3px] border-cheese-dim bg-cheese-bg p-3 shadow-pop">
      <p className="font-label text-[11px] font-bold text-cheese-dim">Custom integration · Bookings</p>
      <p className="text-[13px] leading-snug text-text">
        You know the drill by now. Format, three field names, an access key, a test, a fix.
      </p>
      <ChoiceGroup mode="commit" label="Step 1 to 5, again" hint="Tap it">
        <SelectableCard
          mode="commit"
          icon="replay"
          tag="The same five steps"
          label="Do it all again for Bookings"
          detail={`CSV · tbl_no, slot_ts, pax · key BK-2R8-M · test · fix · ${WEEKS_PER_CONNECTOR} more weeks`}
          onSelect={tapBookingsShortcut}
        />
      </ChoiceGroup>
    </div>
  )

  const loyaltyCard = atLoyalty && (
    <>
      {loyaltyChoice === null ? (
        <>
          <Callout tone="problem" title="And you're not done" compact>
            The Loyalty app just arrived. Points and rewards. It has its own format, its own field
            names, its own key. Start over from step 1?
          </Callout>
          <ChoiceGroup mode="commit" label="Loyalty app">
            <SelectableCard
              mode="commit"
              icon="replay"
              tag="The old way"
              label="Yes, wire Loyalty too"
              detail={`Five steps · ${WEEKS_PER_CONNECTOR} more weeks · one more thing to maintain`}
              onSelect={() => tapLoyalty('again')}
            />
            <SelectableCard
              mode="commit"
              icon="lightbulb"
              tag="Your call"
              label="No. There has to be a better way."
              onSelect={() => tapLoyalty('better')}
            />
          </ChoiceGroup>
        </>
      ) : (
        <>
          <Callout
            tone="problem"
            title={`${built.length} custom integrations. ${weeks} weeks. ${oldTaps} taps.`}
            icon="schedule"
          >
            You maintain every one of them. And it never ends: every new tool your bot needs is
            five more steps, three more weeks, one more thing that can break.
          </Callout>
          <GameActions>
            <GameActionButton variant="primary" icon="arrow_forward" onClick={() => setPhase('mcp')}>
              {loyaltyChoice === 'again' ? 'There has to be a better way' : 'Show me the better way'}
            </GameActionButton>
          </GameActions>
        </>
      )}
    </>
  )

  return (
    <GameStage
      term={term}
      progress={{ part: 1, parts: 3, step: built.length, steps: oldSystems.length }}
      main={
        <>
          <PhaseCard title="The old way" meta={oldTaps ? `${oldTaps} taps` : undefined}>
            Your bot needs to reach the systems your pizzeria runs on. The old way, each one is a
            custom integration you build by hand: five steps, and you do every one of them.
          </PhaseCard>

          <BotCard sub="needs to reach the systems your pizzeria runs on" />

          <div className="flex flex-col gap-2">
            {oldSystems.map((s) => {
              const isBuilt = built.includes(s.id)
              const current = inWizard && s.id === sys.id
              if (s.id === EXTRA.id && !atLoyalty) return null
              return (
                <SystemRow
                  key={s.id}
                  sys={s}
                  tone={isBuilt ? 'custom' : 'todo'}
                  note={rowNote(s)}
                  right={
                    isBuilt ? (
                      <Wired />
                    ) : current ? (
                      <span className="font-label text-[11px] font-bold text-text-muted">wiring…</span>
                    ) : null
                  }
                />
              )
            })}
          </div>

          <div className="flex justify-center">
            <Counter
              n={`${weeks} wks`}
              label={built.length === 1 ? '1 custom integration, you maintain it' : `${built.length} custom integrations, you maintain them`}
              tone={built.length ? 'bad' : 'neutral'}
            />
          </div>

          {wizard}
          {bookingsCard}
          {loyaltyCard}

          {inWizard && step === 5 && (
            <GameActions>
              <GameActionButton variant="primary" icon="arrow_forward" onClick={nextSystem}>
                {sysIdx === 0 ? 'Next: Delivery, from step 1' : 'Next: Bookings, from step 1'}
              </GameActionButton>
            </GameActions>
          )}
        </>
      }
    />
  )
}
