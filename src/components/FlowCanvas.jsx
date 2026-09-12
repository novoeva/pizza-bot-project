import { useNavigate } from 'react-router-dom'
import terms from '../content/terms.json'

/**
 * The flow board: the meta-game's progress picture, drawn as an n8n-style
 * workflow instead of a robot. Illustration ported from the Lovable export
 * ("New robot there", components/FlowBoard); wiring adapted to this app:
 * react-router, this app's term ids, theme tokens instead of raw hex.
 * Names, numbers and order come from terms.json; only the board-specific
 * bits (box key, icon, geometry) live here.
 *
 * Same contract as BotCanvas: give it `completedTerms` (array of term ids)
 * and it draws the state (shadow / built / fully wired).
 * EXPERIMENT (worktree-flow-board).
 */
const NAVY = "var(--color-text)";
const CARD = "var(--color-surface)";
const SAGE = "var(--color-slot-fill)";
const NEUTRAL = "var(--color-neutral)";
const RED = "var(--color-tomato)";
const SKY = "var(--color-accent)";
const MINT = "var(--color-success)";
const ICON_FONT = "Material Symbols Rounded";
const LABEL_FONT = "var(--font-display)";
const MONO_FONT = "var(--font-label)";
/** Board slot -> term id + icon. Everything else (name, number) is terms.json. */
const BOARD = [
  { key: "token", id: "token", icon: "toll" },
  { key: "temperature", id: "temperature", icon: "thermostat" },
  { key: "context", id: "context-window", icon: "crop_free" },
  { key: "hallucination", id: "hallucination", icon: "warning" },
  { key: "prompt", id: "prompt", icon: "edit_note" },
  { key: "agent", id: "agent", icon: "smart_toy" },
  { key: "memory", id: "memory", icon: "database" },
  { key: "skill", id: "skill", icon: "auto_awesome" },
  { key: "tooluse", id: "tool-use", icon: "handyman" },
  { key: "mcp", id: "mcp", icon: "hub" },
  { key: "rag", id: "rag", icon: "menu_book" },
  { key: "guardrails", id: "guardrails", icon: "shield" },
];
const TERM_BY_ID = Object.fromEntries(terms.map((t) => [t.id, t]));
const TERMS = BOARD.map((b) => {
  const t = TERM_BY_ID[b.id];
  if (!t) throw new Error(`FlowCanvas: no term "${b.id}" in terms.json`);
  return { ...b, num: t.order, label: t.name };
});
if (import.meta.env.DEV && TERMS.length !== terms.length) {
  console.warn("FlowCanvas: the board draws", TERMS.length, "terms but terms.json has", terms.length);
}
const TERM_BY_KEY = Object.fromEntries(TERMS.map((t) => [t.key, t]));
const DESKTOP = {
  vw: 1e3,
  vh: 800,
  ports: [
    [445, 155],
    [490, 155],
    [535, 155],
    [580, 155]
  ],
  boxes: {
    customer: { x: 20, y: 40, w: 150, h: 90 },
    prompt: { x: 210, y: 40, w: 160, h: 90 },
    agent: { x: 410, y: 15, w: 210, h: 140 },
    guardrails: { x: 660, y: 40, w: 150, h: 90 },
    reply: { x: 850, y: 40, w: 130, h: 90 },
    model: { x: 40, y: 265, w: 344, h: 350 },
    memory: { x: 400, y: 280, w: 150, h: 110 },
    skill: { x: 580, y: 280, w: 150, h: 110 },
    tooluse: { x: 760, y: 280, w: 170, h: 110 },
    mcp: { x: 520, y: 470, w: 150, h: 100 },
    rag: { x: 760, y: 470, w: 150, h: 100 },
    menu: { x: 180, y: 640, w: 150, h: 100 },
    kitchen: { x: 360, y: 640, w: 150, h: 100 },
    delivery: { x: 540, y: 640, w: 150, h: 100 },
    binder: { x: 760, y: 640, w: 150, h: 100 },
    // chips live inside the model panel
    token: { x: 58, y: 340, w: 308, h: 58 },
    temperature: { x: 58, y: 408, w: 308, h: 58 },
    context: { x: 58, y: 476, w: 308, h: 58 },
    hallucination: { x: 58, y: 544, w: 308, h: 58 }
  }
};
const MOBILE = {
  vw: 420,
  vh: 1450,
  ports: [
    [130, 312],
    [160, 312],
    [190, 312],
    [220, 312]
  ],
  boxes: {
    customer: { x: 115, y: 16, w: 190, h: 72 },
    prompt: { x: 115, y: 112, w: 190, h: 72 },
    agent: { x: 100, y: 208, w: 220, h: 104 },
    model: { x: 60, y: 336, w: 300, h: 256 },
    memory: { x: 115, y: 616, w: 190, h: 72 },
    skill: { x: 115, y: 712, w: 190, h: 72 },
    tooluse: { x: 115, y: 808, w: 190, h: 72 },
    mcp: { x: 52, y: 908, w: 148, h: 84 },
    rag: { x: 220, y: 908, w: 148, h: 84 },
    // Binder sits straight under RAG; the three systems go on the row below
    // it so the MCP fan-out (turning under the binder) and the RAG->binder
    // wire never pass behind a box.
    binder: { x: 229, y: 1024, w: 130, h: 84 },
    menu: { x: 14, y: 1140, w: 122, h: 84 },
    kitchen: { x: 149, y: 1140, w: 122, h: 84 },
    delivery: { x: 284, y: 1140, w: 122, h: 84 },
    guardrails: { x: 115, y: 1248, w: 190, h: 72 },
    reply: { x: 115, y: 1344, w: 190, h: 72 },
    token: { x: 78, y: 394, w: 264, h: 44 },
    temperature: { x: 78, y: 444, w: 264, h: 44 },
    context: { x: 78, y: 494, w: 264, h: 44 },
    hallucination: { x: 78, y: 544, w: 264, h: 44 }
  }
};
/** Vertical → horizontal → vertical elbow. `turnY` overrides the midpoint
 *  for wires whose midpoint would run behind another box. */
function elbow(x1, y1, x2, y2, turnY) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 2) return `M${x1} ${y1} L${x2} ${y2}`;
  const dir = dx > 0 ? 1 : -1;
  const my = turnY ?? (y1 + y2) / 2;
  const room = Math.min(my - y1, y2 - my);
  const r = Math.max(2, Math.min(18, (Math.abs(dx) - 4) / 2, room));
  return [
    `M${x1} ${y1}`,
    `L${x1} ${my - r}`,
    `Q${x1} ${my} ${x1 + dir * r} ${my}`,
    `L${x2 - dir * r} ${my}`,
    `Q${x2} ${my} ${x2} ${my + r}`,
    `L${x2} ${y2}`
  ].join(" ");
}
export default function FlowCanvas({ completedTerms = [], className = "" }) {
  const done = new Set(completedTerms);
  return (
    <div className={`select-none lg:flex lg:min-h-0 lg:flex-1 lg:justify-center ${className}`}>
      {/* Desktop: the wrapper is a flex item in the Workshop's fixed-height
          column, so the board takes whatever height is left (no viewport
          arithmetic); width follows from the viewBox ratio, centred. */}
      <Board
        layout={DESKTOP}
        done={done}
        className="hidden max-w-full lg:block lg:h-full lg:min-h-0 lg:w-auto"
      />
      <Board layout={MOBILE} done={done} className="block h-auto w-full lg:hidden" />
    </div>
  );
}
function Board({ layout, done, className }) {
  const navigate = useNavigate();
  const b = layout.boxes;
  const isMobile = layout === MOBILE;
  const built = (k) => done.has(TERM_BY_KEY[k].id);
  const chips = ["token", "temperature", "context", "hallucination"];
  const modelBuilt = chips.some(built);
  const allBuilt = TERMS.every((t) => done.has(t.id));
  const open = (k) => navigate(`/game/${TERM_BY_KEY[k].id}`);
  const mid = (box) => box.x + box.w / 2;
  const wires = [];
  const add = (d, on, plugs) => wires.push({ d, on, plugs });
  if (!isMobile) {
    add(`M${b.customer.x + b.customer.w} 85 L${b.prompt.x} 85`, built("prompt"), [
      [b.customer.x + b.customer.w, 85],
      [b.prompt.x, 85]
    ]);
    add(`M${b.prompt.x + b.prompt.w} 85 L${b.agent.x} 85`, built("prompt") && built("agent"), [
      [b.prompt.x + b.prompt.w, 85],
      [b.agent.x, 85]
    ]);
    add(
      `M${b.agent.x + b.agent.w} 85 L${b.guardrails.x} 85`,
      built("agent") && built("guardrails"),
      [
        [b.agent.x + b.agent.w, 85],
        [b.guardrails.x, 85]
      ]
    );
    add(`M${b.guardrails.x + b.guardrails.w} 85 L${b.reply.x} 85`, built("guardrails"), [
      [b.guardrails.x + b.guardrails.w, 85],
      [b.reply.x, 85]
    ]);
    const targets = [
      ["model", modelBuilt],
      ["memory", built("memory")],
      ["skill", built("skill")],
      ["tooluse", built("tooluse")]
    ];
    targets.forEach(([key, on], i) => {
      const p = layout.ports[i];
      const box = b[key];
      add(elbow(p[0], p[1], mid(box), box.y), built("agent") && on, [[mid(box), box.y]]);
    });
    add(
      elbow(mid(b.tooluse), b.tooluse.y + b.tooluse.h, mid(b.mcp), b.mcp.y),
      built("tooluse") && built("mcp"),
      [
        [mid(b.tooluse), b.tooluse.y + b.tooluse.h],
        [mid(b.mcp), b.mcp.y]
      ]
    );
    add(
      elbow(mid(b.tooluse), b.tooluse.y + b.tooluse.h, mid(b.rag), b.rag.y),
      built("tooluse") && built("rag"),
      [[mid(b.rag), b.rag.y]]
    );
    ["menu", "kitchen", "delivery"].forEach((k) => {
      // One shared bus just below the model panel (its shadow ends at
      // model.y + model.h + 6) so no fan-out wire runs behind the panel.
      const busY = b.model.y + b.model.h + 13;
      add(elbow(mid(b.mcp), b.mcp.y + b.mcp.h, mid(b[k]), b[k].y, busY), built("mcp"), [
        [mid(b[k]), b[k].y]
      ]);
    });
    add(elbow(mid(b.rag), b.rag.y + b.rag.h, mid(b.binder), b.binder.y), built("rag"), [
      [mid(b.binder), b.binder.y]
    ]);
  } else {
    const chain = [
      ["customer", "prompt", built("prompt")],
      ["prompt", "agent", built("prompt") && built("agent")],
      ["kitchen", "guardrails", built("guardrails")],
      ["guardrails", "reply", built("guardrails")]
    ];
    chain.forEach(([from, to, on]) => {
      const f = b[from];
      const t = b[to];
      add(elbow(mid(f), f.y + f.h, mid(t), t.y), on, [
        [mid(f), f.y + f.h],
        [mid(t), t.y]
      ]);
    });
    const railX = 34;
    const railTop = b.agent.y + b.agent.h;
    const railBottom = b.tooluse.y + b.tooluse.h / 2;
    add(`M${b.agent.x} ${railTop - 20} L${railX} ${railTop - 20} L${railX} ${railBottom}`, built("agent"), []);
    [
      ["model", modelBuilt],
      ["memory", built("memory")],
      ["skill", built("skill")],
      ["tooluse", built("tooluse")]
    ].forEach(([k, on]) => {
      const box = b[k];
      add(`M${railX} ${box.y + box.h / 2} L${box.x} ${box.y + box.h / 2}`, built("agent") && on, [
        [box.x, box.y + box.h / 2]
      ]);
    });
    add(elbow(mid(b.tooluse), b.tooluse.y + b.tooluse.h, mid(b.mcp), b.mcp.y), built("tooluse") && built("mcp"), [
      [mid(b.mcp), b.mcp.y]
    ]);
    add(elbow(mid(b.tooluse), b.tooluse.y + b.tooluse.h, mid(b.rag), b.rag.y), built("tooluse") && built("rag"), [
      [mid(b.rag), b.rag.y]
    ]);
    // One shared bus below the binder for the whole MCP fan-out.
    const busY = b.binder.y + b.binder.h + 16;
    ["menu", "kitchen", "delivery"].forEach((k) => {
      add(elbow(mid(b.mcp), b.mcp.y + b.mcp.h, mid(b[k]), b[k].y, busY), built("mcp"), [[mid(b[k]), b[k].y]]);
    });
    add(elbow(mid(b.rag), b.rag.y + b.rag.h, mid(b.binder), b.binder.y), built("rag"), [
      [mid(b.binder), b.binder.y]
    ]);
  }
  const scale = isMobile ? 0.85 : 1;
  const glowId = isMobile ? "fb-glow-mobile" : "fb-glow-desktop";
  return <svg
    viewBox={`0 0 ${layout.vw} ${layout.vh}`}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="group" aria-label={`Pizza bot flow, ${done.size} of ${terms.length} terms wired in`}
  >
      <defs>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {
    /* wires first, under every box */
  }
      {wires.map((w, i) => <g key={i}>
          <path
    d={w.d}
    fill="none"
    stroke={w.on ? NAVY : NEUTRAL}
    strokeWidth={w.on ? 6 : 3}
    strokeLinecap="round"
    strokeDasharray={w.on ? void 0 : "8 9"}
    opacity={w.on ? 1 : 0.35}
    className={w.on && allBuilt ? "flow-wire" : void 0}
  />
          {w.on && w.plugs.map(([px, py], j) => <circle key={j} cx={px} cy={py} r={7} fill={CARD} stroke={NAVY} strokeWidth={3.5} />)}
        </g>)}

      {
    /* scenery */
  }
      <Scenery box={b.customer} label="Customer" art="customer" scale={scale} />
      <Scenery box={b.reply} label="Reply" art="reply" scale={scale} />
      <Scenery box={b.menu} label="Menu" art="menu" scale={scale} />
      <Scenery box={b.kitchen} label="Kitchen" art="kitchen" scale={scale} />
      <Scenery box={b.delivery} label="Delivery" art="scooter" scale={scale} />
      <Scenery box={b.binder} label="Recipe binder" art="binder" scale={scale} />

      {
    /* the model control panel */
  }
      <ModelPanel box={b.model} scale={scale}>
        {chips.map((k) => <Chip
    key={k}
    box={b[k]}
    term={TERM_BY_KEY[k]}
    built={built(k)}
    onOpen={() => open(k)}
    scale={scale}
  />)}
      </ModelPanel>

      {
    /* terms */
  }
      {["prompt", "memory", "skill", "tooluse", "mcp", "rag", "guardrails"].map((k) => <TermBox
    key={k}
    box={b[k]}
    term={TERM_BY_KEY[k]}
    built={built(k)}
    onOpen={() => open(k)}
    scale={scale}
  />)}

      {
    /* the agent, hero of the board */
  }
      {allBuilt && <rect
    x={b.agent.x - 10}
    y={b.agent.y - 10}
    width={b.agent.w + 20}
    height={b.agent.h + 20}
    rx={34}
    fill={MINT}
    opacity={0.45}
    filter={`url(#${glowId})`}
  />}
      <AgentBox box={b.agent} built={built("agent")} ports={isMobile ? [] : layout.ports} onOpen={() => open("agent")} scale={scale} />
    </svg>;
}
function Shadow({
  box,
  num,
  name,
  icon,
  scale,
  rx = 18
}) {
  const cx = box.x + box.w / 2;
  return <>
      <title>{name}</title>
      <rect
    x={box.x}
    y={box.y}
    width={box.w}
    height={box.h}
    rx={rx}
    fill={CARD}
    fillOpacity={0.4}
    stroke={NEUTRAL}
    strokeWidth={3}
    strokeDasharray="9 9"
    opacity={0.75}
  />
      <circle cx={box.x + 20} cy={box.y + 20} r={13} fill="none" stroke={NEUTRAL} strokeWidth={2.5} strokeDasharray="5 5" />
      <text
    x={box.x + 20}
    y={box.y + 25}
    textAnchor="middle"
    fontFamily={MONO_FONT}
    fontSize={15}
    fontWeight={700}
    fill={NEUTRAL}
  >
        {num}
      </text>
      {icon && <text
    x={cx}
    y={box.y + box.h * 0.46}
    textAnchor="middle"
    fontFamily={ICON_FONT}
    fontSize={34 * scale}
    fill={NEUTRAL}
    opacity={0.5}
  >
          {icon}
        </text>}
      <text
    x={cx}
    y={box.y + box.h - 18 * scale}
    textAnchor="middle"
    fontFamily={LABEL_FONT}
    fontSize={22 * scale}
    fontWeight={700}
    fill={NEUTRAL}
    opacity={0.85}
  >
        {name}
      </text>
    </>;
}
function Badge({ x, y, num, r = 15 }) {
  return <>
      <circle cx={x} cy={y} r={r} fill={RED} stroke={NAVY} strokeWidth={3} />
      <text
    x={x}
    y={y + r * 0.36}
    textAnchor="middle"
    fontFamily={MONO_FONT}
    fontSize={r * 1.05}
    fontWeight={700}
    fill={CARD}
  >
        {num}
      </text>
    </>;
}
function TermBox({
  box,
  term,
  built,
  onOpen,
  scale
}) {
  const cx = box.x + box.w / 2;
  return <g
    role="link"
    tabIndex={0}
    aria-label={term.label}
    style={{ cursor: "pointer" }}
    onClick={onOpen}
    onKeyDown={(e) => e.key === "Enter" ? onOpen() : void 0}
  >
      {!built ? <Shadow box={box} num={term.num} name={term.label} icon={term.icon} scale={scale} /> : <>
          <title>{term.label}</title>
          <rect x={box.x + 6} y={box.y + 6} width={box.w} height={box.h} rx={18} fill={NEUTRAL} opacity={0.9} />
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={18} fill={CARD} stroke={NAVY} strokeWidth={3.5} />
          <text
    x={cx}
    y={box.y + box.h * 0.46}
    textAnchor="middle"
    fontFamily={ICON_FONT}
    fontSize={34 * scale}
    fill={NAVY}
  >
            {term.icon}
          </text>
          <text
    x={cx}
    y={box.y + box.h - 18 * scale}
    textAnchor="middle"
    fontFamily={LABEL_FONT}
    fontSize={22 * scale}
    fontWeight={700}
    fill={NAVY}
  >
            {term.label}
          </text>
          <Badge x={box.x + 18} y={box.y + 18} num={term.num} />
        </>}
    </g>;
}
function AgentBox({
  box,
  built,
  ports,
  onOpen,
  scale
}) {
  const cx = box.x + box.w / 2;
  const term = TERM_BY_KEY.agent;
  return <g
    role="link"
    tabIndex={0}
    aria-label="Agent"
    style={{ cursor: "pointer" }}
    onClick={onOpen}
    onKeyDown={(e) => e.key === "Enter" ? onOpen() : void 0}
  >
      {!built ? <Shadow box={box} num={6} name="Agent" icon={term.icon} scale={scale} rx={26} /> : <>
          <title>Agent</title>
          <rect x={box.x + 7} y={box.y + 7} width={box.w} height={box.h} rx={26} fill={NEUTRAL} opacity={0.9} />
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={26} fill={CARD} stroke={NAVY} strokeWidth={4.5} />
          {
    /* friendly bot face */
  }
          <rect
    x={cx - 44 * scale}
    y={box.y + 18 * scale}
    width={88 * scale}
    height={54 * scale}
    rx={20 * scale}
    fill={SKY}
    stroke={NAVY}
    strokeWidth={3.5}
  />
          <circle cx={cx - 18 * scale} cy={box.y + 42 * scale} r={7 * scale} fill={NAVY} />
          <circle cx={cx + 18 * scale} cy={box.y + 42 * scale} r={7 * scale} fill={NAVY} />
          <path
    d={`M${cx - 14 * scale} ${box.y + 58 * scale} q${14 * scale} ${12 * scale} ${28 * scale} 0`}
    fill="none"
    stroke={NAVY}
    strokeWidth={3.5}
    strokeLinecap="round"
  />
          <circle cx={cx} cy={box.y + 10 * scale} r={6 * scale} fill={RED} stroke={NAVY} strokeWidth={2.5} />
          <text
    x={cx}
    y={box.y + box.h - 22 * scale}
    textAnchor="middle"
    fontFamily={LABEL_FONT}
    fontSize={22 * scale}
    fontWeight={800}
    fill={NAVY}
  >
            {term.label}
          </text>
          <Badge x={box.x + 20} y={box.y + 20} num={6} />
        </>}
      {
    /* four sockets on the bottom edge */
  }
      {ports.map(([px, py], i) => <g key={i}>
          <rect
    x={px - 11}
    y={py - 9}
    width={22}
    height={16}
    rx={6}
    fill={built ? SAGE : CARD}
    stroke={built ? NAVY : NEUTRAL}
    strokeWidth={3}
    opacity={built ? 1 : 0.5}
  />
          <line
    x1={px - 4}
    y1={py - 4}
    x2={px - 4}
    y2={py + 2}
    stroke={built ? NAVY : NEUTRAL}
    strokeWidth={2.5}
    strokeLinecap="round"
    opacity={built ? 1 : 0.5}
  />
          <line
    x1={px + 4}
    y1={py - 4}
    x2={px + 4}
    y2={py + 2}
    stroke={built ? NAVY : NEUTRAL}
    strokeWidth={2.5}
    strokeLinecap="round"
    opacity={built ? 1 : 0.5}
  />
        </g>)}
    </g>;
}
function ModelPanel({ box, scale, children }) {
  return <g>
      <rect x={box.x + 6} y={box.y + 6} width={box.w} height={box.h} rx={20} fill={NEUTRAL} opacity={0.9} />
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={20} fill={SAGE} stroke={NAVY} strokeWidth={3.5} />
      <text
    x={box.x + 16}
    y={box.y + 40 * scale}
    fontFamily={LABEL_FONT}
    fontSize={22 * scale}
    fontWeight={800}
    fill={NAVY}
  >
        The model
      </text>
      {
    /* panel screws */
  }
      <circle cx={box.x + box.w - 16} cy={box.y + 16} r={4} fill={NAVY} opacity={0.5} />
      <circle cx={box.x + box.w - 16} cy={box.y + box.h - 16} r={4} fill={NAVY} opacity={0.5} />
      {children}
    </g>;
}
function Chip({
  box,
  term,
  built,
  onOpen,
  scale
}) {
  const cy = box.y + box.h / 2;
  const gx = box.x + 62;
  return <g
    role="link"
    tabIndex={0}
    aria-label={term.label}
    style={{ cursor: "pointer" }}
    onClick={onOpen}
    onKeyDown={(e) => e.key === "Enter" ? onOpen() : void 0}
  >
      <title>{term.label}</title>
      <rect
    x={box.x}
    y={box.y}
    width={box.w}
    height={box.h}
    rx={box.h / 2}
    fill={built ? CARD : "none"}
    fillOpacity={built ? 1 : 0}
    stroke={built ? NAVY : NEUTRAL}
    strokeWidth={built ? 3 : 2.5}
    strokeDasharray={built ? void 0 : "7 7"}
    opacity={built ? 1 : 0.6}
  />
      <Badge x={box.x + box.h / 2} y={cy} num={term.num} />
      <g opacity={built ? 1 : 0.45}>
        <ChipArt kind={term.key} x={gx} y={cy} scale={scale} />
      </g>

      <text
    x={gx + 24 * scale}
    y={cy + 7 * scale}
    fontFamily={LABEL_FONT}
    fontSize={22 * scale}
    fontWeight={700}
    fill={built ? NAVY : NEUTRAL}
    opacity={built ? 1 : 0.8}
  >

        {term.label}
      </text>

    </g>;
}
function ChipArt({ kind, x, y, scale }) {
  const s = scale;
  if (kind === "token")
    return <g>
        <rect x={x - 12 * s} y={y - 9 * s} width={24 * s} height={18 * s} rx={4} fill={NAVY} />
        <text
      x={x}
      y={y + 5 * s}
      textAnchor="middle"
      fontFamily={MONO_FONT}
      fontSize={11 * s}
      fontWeight={700}
      fill={CARD}
    >
          128
        </text>
      </g>;
  if (kind === "temperature")
    return <g>
        <path
      d={`M${x - 12 * s} ${y + 6 * s} a${12 * s} ${12 * s} 0 0 1 ${24 * s} 0`}
      fill={SKY}
      stroke={NAVY}
      strokeWidth={2.5}
    />
        <line x1={x} y1={y + 6 * s} x2={x + 8 * s} y2={y - 4 * s} stroke={RED} strokeWidth={3} strokeLinecap="round" />
        <circle cx={x} cy={y + 6 * s} r={2.5 * s} fill={NAVY} />
      </g>;
  if (kind === "context")
    return <g>
        <rect x={x - 13 * s} y={y - 8 * s} width={26 * s} height={16 * s} rx={4} fill={CARD} stroke={NAVY} strokeWidth={2.5} />
        <rect x={x - 10 * s} y={y - 5 * s} width={14 * s} height={10 * s} rx={2} fill={MINT} />
      </g>;
  return <g>
      <path
    d={`M${x} ${y - 10 * s} L${x + 12 * s} ${y + 8 * s} L${x - 12 * s} ${y + 8 * s} Z`}
    fill={RED}
    stroke={NAVY}
    strokeWidth={2.5}
    strokeLinejoin="round"
  />
      <text
    x={x}
    y={y + 6 * s}
    textAnchor="middle"
    fontFamily={MONO_FONT}
    fontSize={11 * s}
    fontWeight={700}
    fill={CARD}
  >
        !
      </text>
    </g>;
}
function Scenery({
  box,
  label,
  art,
  scale
}) {
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h * 0.38;
  const s = scale;
  return <g>
      <title>{label}</title>
      <rect x={box.x + 5} y={box.y + 5} width={box.w} height={box.h} rx={18} fill={NEUTRAL} opacity={0.35} />
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={18} fill={SAGE} stroke={NAVY} strokeWidth={3} />
      {art === "customer" && <g>
          <path
    d={`M${cx - 26 * s} ${cy - 16 * s} h${52 * s} a${8 * s} ${8 * s} 0 0 1 ${8 * s} ${8 * s} v${18 * s} a${8 * s} ${8 * s} 0 0 1 -${8 * s} ${8 * s} h-${34 * s} l-${12 * s} ${11 * s} v-${11 * s} h-${6 * s} a${8 * s} ${8 * s} 0 0 1 -${8 * s} -${8 * s} v-${18 * s} a${8 * s} ${8 * s} 0 0 1 ${8 * s} -${8 * s} z`}
    fill={CARD}
    stroke={NAVY}
    strokeWidth={3}
    strokeLinejoin="round"
  />
          <path
    d={`M${cx - 12 * s} ${cy + 6 * s} L${cx} ${cy - 12 * s} L${cx + 12 * s} ${cy + 6 * s} z`}
    fill={RED}
    stroke={NAVY}
    strokeWidth={2.5}
    strokeLinejoin="round"
  />
          <circle cx={cx - 4 * s} cy={cy - 2 * s} r={2.4 * s} fill={CARD} />
          <circle cx={cx + 5 * s} cy={cy + 1 * s} r={2.4 * s} fill={CARD} />
        </g>}
      {art === "reply" && <g>
          <path
    d={`M${cx - 26 * s} ${cy - 16 * s} h${52 * s} a${8 * s} ${8 * s} 0 0 1 ${8 * s} ${8 * s} v${18 * s} a${8 * s} ${8 * s} 0 0 1 -${8 * s} ${8 * s} h-${6 * s} v${11 * s} l-${12 * s} -${11 * s} h-${34 * s} a${8 * s} ${8 * s} 0 0 1 -${8 * s} -${8 * s} v-${18 * s} a${8 * s} ${8 * s} 0 0 1 ${8 * s} -${8 * s} z`}
    fill={CARD}
    stroke={NAVY}
    strokeWidth={3}
    strokeLinejoin="round"
  />
          <circle cx={cx - 10 * s} cy={cy - 4 * s} r={3 * s} fill={NAVY} />
          <circle cx={cx + 10 * s} cy={cy - 4 * s} r={3 * s} fill={NAVY} />
          <path
    d={`M${cx - 11 * s} ${cy + 5 * s} q${11 * s} ${10 * s} ${22 * s} 0`}
    fill="none"
    stroke={NAVY}
    strokeWidth={3}
    strokeLinecap="round"
  />
        </g>}
      {art === "menu" && <g>
          <rect
    x={cx - 18 * s}
    y={cy - 20 * s}
    width={36 * s}
    height={42 * s}
    rx={5}
    fill={CARD}
    stroke={NAVY}
    strokeWidth={3}
  />
          <circle cx={cx} cy={cy - 10 * s} r={5 * s} fill={RED} />
          <line x1={cx - 11 * s} y1={cy + 2 * s} x2={cx + 11 * s} y2={cy + 2 * s} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={cx - 11 * s} y1={cy + 9 * s} x2={cx + 11 * s} y2={cy + 9 * s} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={cx - 11 * s} y1={cy + 16 * s} x2={cx + 3 * s} y2={cy + 16 * s} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />
        </g>}
      {art === "kitchen" && <g>
          <rect
    x={cx - 24 * s}
    y={cy - 18 * s}
    width={48 * s}
    height={38 * s}
    rx={10}
    fill={CARD}
    stroke={NAVY}
    strokeWidth={3}
  />
          <path
    d={`M${cx - 15 * s} ${cy + 12 * s} a${15 * s} ${15 * s} 0 0 1 ${30 * s} 0 z`}
    fill={RED}
    stroke={NAVY}
    strokeWidth={2.5}
  />
          <circle cx={cx - 15 * s} cy={cy - 10 * s} r={3 * s} fill={NAVY} />
          <circle cx={cx + 15 * s} cy={cy - 10 * s} r={3 * s} fill={NAVY} />
        </g>}
      {art === "scooter" && <g>
          <rect
    x={cx - 24 * s}
    y={cy - 18 * s}
    width={20 * s}
    height={18 * s}
    rx={4}
    fill={RED}
    stroke={NAVY}
    strokeWidth={3}
  />
          <path
    d={`M${cx - 20 * s} ${cy + 8 * s} h${22 * s} l${8 * s} -${12 * s} h${8 * s}`}
    fill="none"
    stroke={NAVY}
    strokeWidth={3.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
          <circle cx={cx - 18 * s} cy={cy + 14 * s} r={7 * s} fill={CARD} stroke={NAVY} strokeWidth={3} />
          <circle cx={cx + 16 * s} cy={cy + 14 * s} r={7 * s} fill={CARD} stroke={NAVY} strokeWidth={3} />
        </g>}
      {art === "binder" && <g>
          <rect
    x={cx - 20 * s}
    y={cy - 20 * s}
    width={40 * s}
    height={42 * s}
    rx={5}
    fill={CARD}
    stroke={NAVY}
    strokeWidth={3}
  />
          <rect x={cx - 20 * s} y={cy - 20 * s} width={10 * s} height={42 * s} rx={5} fill={SKY} stroke={NAVY} strokeWidth={3} />
          <circle cx={cx - 15 * s} cy={cy - 10 * s} r={2.6 * s} fill={NAVY} />
          <circle cx={cx - 15 * s} cy={cy + 1 * s} r={2.6 * s} fill={NAVY} />
          <circle cx={cx - 15 * s} cy={cy + 12 * s} r={2.6 * s} fill={NAVY} />
          <line x1={cx - 4 * s} y1={cy - 4 * s} x2={cx + 13 * s} y2={cy - 4 * s} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={cx - 4 * s} y1={cy + 6 * s} x2={cx + 13 * s} y2={cy + 6 * s} stroke={NAVY} strokeWidth={2.5} strokeLinecap="round" />
        </g>}
      <text
    x={cx}
    y={box.y + box.h - 12 * s}
    textAnchor="middle"
    fontFamily={LABEL_FONT}
    fontSize={19 * s}
    fontWeight={700}
    fill={NAVY}
  >
        {label}
      </text>
    </g>;
}
