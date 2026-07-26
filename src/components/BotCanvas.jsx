import terms from '../content/terms.json'

/**
 * The half-built robot: the meta-game's progress bar.
 * Chassis (head + torso shells) is always visible; each completed term
 * lights up its part in full colour, missing parts stay as dashed slots.
 * When every term is in, the bot powers on, eyes and core glow, pizza appears.
 */
export default function BotCanvas({ completedTerms = [] }) {
  const done = new Set(completedTerms)
  const has = (id) => done.has(id)
  const powered = done.size >= terms.length

  const slot = {
    className: 'fill-slot-fill stroke-slot-empty',
    strokeWidth: 2.5,
    strokeDasharray: '5 5',
    strokeLinecap: 'round',
  }

  return (
    <svg
      viewBox="0 0 260 372"
      className="mx-auto block h-auto w-full max-w-[280px] select-none"
      role="img"
      aria-label={`Pizza bot, ${done.size} of ${terms.length} parts installed`}
    >
      <ellipse cx="130" cy="352" rx="78" ry="12" className="fill-ground" />

      {/* SKILL, antenna */}
      {has('skill') ? (
        <g>
          <line
            x1="130"
            y1="46"
            x2="130"
            y2="20"
            className="stroke-neutral"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="130" cy="15" r="8" className="fill-tertiary stroke-text" strokeWidth="2" />
        </g>
      ) : (
        <circle cx="130" cy="18" r="9" {...slot} />
      )}

      {/* head shell */}
      <rect
        x="76"
        y="42"
        width="108"
        height="80"
        rx="24"
        className="fill-surface stroke-text"
        strokeWidth="5"
      />

      {/* CONTEXT WINDOW, head panel / short-term memory chip */}
      {has('context-window') ? (
        <rect
          x="94"
          y="52"
          width="72"
          height="15"
          rx="7"
          className="fill-accent stroke-text"
          strokeWidth="2"
        />
      ) : (
        <rect x="94" y="52" width="72" height="15" rx="7" {...slot} />
      )}

      {/* HALLUCINATION, eyes / reality-check filter */}
      {has('hallucination') ? (
        <g>
          {powered && <circle cx="108" cy="90" r="16" className="fill-glow" />}
          {powered && <circle cx="152" cy="90" r="16" className="fill-glow" />}
          <circle cx="108" cy="90" r="10" className={powered ? 'fill-success' : 'fill-text'} />
          <circle cx="152" cy="90" r="10" className={powered ? 'fill-success' : 'fill-text'} />
        </g>
      ) : (
        <g>
          <circle cx="108" cy="90" r="10" {...slot} />
          <circle cx="152" cy="90" r="10" {...slot} />
        </g>
      )}

      {/* TOKEN, voice box */}
      {has('token') ? (
        <g>
          <rect x="102" y="104" width="56" height="12" rx="6" className="fill-text" />
          <line x1="114" y1="106" x2="114" y2="114" className="stroke-surface" strokeWidth="2" />
          <line x1="124" y1="106" x2="124" y2="114" className="stroke-surface" strokeWidth="2" />
          <line x1="134" y1="106" x2="134" y2="114" className="stroke-surface" strokeWidth="2" />
          <line x1="144" y1="106" x2="144" y2="114" className="stroke-surface" strokeWidth="2" />
        </g>
      ) : (
        <rect x="102" y="104" width="56" height="12" rx="6" {...slot} />
      )}

      {/* TEMPERATURE, creativity dial on the side of the head */}
      {has('temperature') ? (
        <g>
          {powered && <circle cx="177" cy="74" r="13" className="fill-glow" />}
          <circle cx="177" cy="74" r="10" className="fill-accent stroke-text" strokeWidth="2" />
          <line
            x1="177"
            y1="74"
            x2="183"
            y2="68"
            className="stroke-text"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="172" cy="82" r="1.4" className="fill-text" />
          <circle cx="182" cy="82" r="1.4" className="fill-text" />
          <circle cx="177" cy="74" r="2" className="fill-text" />
        </g>
      ) : (
        <circle cx="177" cy="74" r="10" {...slot} />
      )}

      {/* neck */}
      <rect x="118" y="120" width="24" height="16" rx="4" className="fill-neutral" />

      {/* GUARDRAILS, safety-casing bumpers (behind torso) */}
      {has('guardrails') ? (
        <g>
          <rect
            x="52"
            y="140"
            width="30"
            height="26"
            rx="12"
            className="fill-primary stroke-text"
            strokeWidth="2"
          />
          <rect
            x="178"
            y="140"
            width="30"
            height="26"
            rx="12"
            className="fill-primary stroke-text"
            strokeWidth="2"
          />
        </g>
      ) : (
        <g>
          <rect x="52" y="140" width="30" height="26" rx="12" {...slot} />
          <rect x="178" y="140" width="30" height="26" rx="12" {...slot} />
        </g>
      )}

      {/* torso shell */}
      <rect
        x="62"
        y="134"
        width="136"
        height="120"
        rx="30"
        className="fill-surface stroke-text"
        strokeWidth="5"
      />

      {/* MCP, universal port pack */}
      {has('mcp') ? (
        <g>
          <rect
            x="192"
            y="158"
            width="26"
            height="56"
            rx="10"
            className="fill-neutral stroke-text"
            strokeWidth="2"
          />
          <rect x="198" y="168" width="14" height="6" rx="3" className="fill-accent" />
          <rect x="198" y="180" width="14" height="6" rx="3" className="fill-accent" />
          <rect x="198" y="192" width="14" height="6" rx="3" className="fill-accent" />
        </g>
      ) : (
        <rect x="192" y="158" width="26" height="56" rx="10" {...slot} />
      )}

      {/* TOOL USE, arms */}
      {has('tool-use') ? (
        <g>
          <rect x="34" y="176" width="30" height="14" rx="7" className="fill-neutral" />
          <circle cx="34" cy="183" r="12" className="fill-neutral stroke-text" strokeWidth="2" />
          <circle cx="34" cy="183" r="5" className="fill-accent" />
          <rect x="196" y="176" width="30" height="14" rx="7" className="fill-neutral" />
          <circle cx="226" cy="183" r="12" className="fill-neutral stroke-text" strokeWidth="2" />
          <circle cx="226" cy="183" r="5" className="fill-accent" />
        </g>
      ) : (
        <g>
          <circle cx="34" cy="183" r="12" {...slot} />
          <circle cx="226" cy="183" r="12" {...slot} />
        </g>
      )}

      {/* MEMORY, hard-drive core (chest) */}
      {has('memory') ? (
        <g>
          {powered && <circle cx="130" cy="176" r="26" className="fill-glow" />}
          <circle cx="130" cy="176" r="20" className="fill-primary stroke-text" strokeWidth="2" />
          <circle cx="130" cy="176" r="9" className="fill-accent" />
        </g>
      ) : (
        <circle cx="130" cy="176" r="20" {...slot} />
      )}

      {/* PROMPT, instruction dial */}
      {has('prompt') ? (
        <g>
          <circle cx="96" cy="220" r="13" className="fill-accent stroke-text" strokeWidth="2" />
          <line
            x1="96"
            y1="220"
            x2="103"
            y2="213"
            className="stroke-text"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <circle cx="96" cy="220" r="13" {...slot} />
      )}
      <circle cx="164" cy="220" r="5" className="fill-slot-empty" />

      {/* AGENT, legs / wheelbase */}
      {has('agent') ? (
        <g>
          <rect x="82" y="254" width="96" height="22" rx="11" className="fill-neutral" />
          <circle cx="100" cy="286" r="16" className="fill-neutral stroke-text" strokeWidth="2" />
          <circle cx="100" cy="286" r="6" className="fill-accent" />
          <circle cx="160" cy="286" r="16" className="fill-neutral stroke-text" strokeWidth="2" />
          <circle cx="160" cy="286" r="6" className="fill-accent" />
        </g>
      ) : (
        <g>
          <rect x="82" y="254" width="96" height="22" rx="11" {...slot} />
          <circle cx="100" cy="286" r="14" {...slot} />
          <circle cx="160" cy="286" r="14" {...slot} />
        </g>
      )}

      {/* pizza, only once fully powered on */}
      {powered && (
        <g>
          <circle cx="226" cy="176" r="22" className="fill-accent stroke-primary" strokeWidth="3" />
          <circle cx="220" cy="170" r="3" className="fill-primary" />
          <circle cx="232" cy="172" r="3" className="fill-primary" />
          <circle cx="223" cy="183" r="3" className="fill-primary" />
          <circle cx="233" cy="182" r="2.5" className="fill-primary" />
        </g>
      )}
    </svg>
  )
}
