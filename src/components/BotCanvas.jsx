const ACTIVE_CLASS = 'fill-cheese stroke-crust transition-all duration-500'
const EMPTY_CLASS = 'fill-transparent stroke-slot-empty [stroke-dasharray:4_4] transition-all duration-500'

function Part({ id, completed, children }) {
  const isActive = completed.has(id)
  return (
    <g className={isActive ? ACTIVE_CLASS : EMPTY_CLASS} strokeWidth={2} data-part={id}>
      {children}
    </g>
  )
}

/**
 * The half-built robot: the meta-game's progress bar.
 * Chassis is always visible (endowed progress); each completed term
 * lights up its part, missing parts stay as visible dashed outlines.
 */
export default function BotCanvas({ completedTerms = [] }) {
  const completed = new Set(completedTerms)

  return (
    <svg
      viewBox="0 0 240 320"
      className="w-full max-w-[16rem] mx-auto"
      role="img"
      aria-label={`Pizza bot, ${completed.size} of 10 parts installed`}
    >
      {/* chassis — always visible, never 0% */}
      <rect x="70" y="100" width="100" height="120" rx="16" className="fill-metal-dim stroke-metal" strokeWidth={2} />
      <circle cx="120" cy="60" r="34" className="fill-metal-dim stroke-metal" strokeWidth={2} />
      <rect x="80" y="220" width="80" height="12" rx="4" className="fill-metal-dim stroke-metal" strokeWidth={2} />

      {/* context-window: antenna chip on top of head */}
      <Part id="context-window" completed={completed}>
        <rect x="112" y="8" width="16" height="18" rx="3" />
        <circle cx="120" cy="6" r="5" />
      </Part>

      {/* hallucination: the eyes */}
      <Part id="hallucination" completed={completed}>
        <circle cx="108" cy="55" r="6" />
        <circle cx="132" cy="55" r="6" />
      </Part>

      {/* token: voice box / speaker grille */}
      <Part id="token" completed={completed}>
        <rect x="106" y="74" width="28" height="10" rx="5" />
      </Part>

      {/* guardrails: safety casing overlay on torso */}
      <Part id="guardrails" completed={completed}>
        <rect x="70" y="100" width="100" height="120" rx="16" fill="none" strokeWidth={4} />
      </Part>

      {/* memory: hard drive in the chest */}
      <Part id="memory" completed={completed}>
        <rect x="95" y="122" width="50" height="38" rx="6" />
        <line x1="103" y1="134" x2="137" y2="134" strokeWidth={2} />
        <line x1="103" y1="146" x2="137" y2="146" strokeWidth={2} />
      </Part>

      {/* prompt: instruction dial */}
      <Part id="prompt" completed={completed}>
        <circle cx="90" cy="185" r="10" />
        <line x1="90" y1="185" x2="90" y2="177" strokeWidth={2} />
      </Part>

      {/* skill: training badge */}
      <Part id="skill" completed={completed}>
        <circle cx="150" cy="118" r="10" />
      </Part>

      {/* mcp: universal port on the side */}
      <Part id="mcp" completed={completed}>
        <rect x="166" y="150" width="10" height="22" rx="2" />
      </Part>

      {/* tool-use: arms */}
      <Part id="tool-use" completed={completed}>
        <rect x="44" y="110" width="24" height="70" rx="8" />
        <rect x="172" y="110" width="24" height="70" rx="8" />
      </Part>

      {/* agent: legs */}
      <Part id="agent" completed={completed}>
        <rect x="82" y="220" width="24" height="58" rx="6" />
        <rect x="134" y="220" width="24" height="58" rx="6" />
      </Part>
    </svg>
  )
}
