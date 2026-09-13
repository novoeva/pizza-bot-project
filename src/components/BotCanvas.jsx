import terms from '../content/terms.json'

/**
 * The half-built robot: the meta-game's progress bar.
 *
 * Design ported from the Lovable "RobotAssembly" cutout so the assembled bot
 * matches the pizza-guy cartoon on the landing page. Each of the app's 11 terms
 * reveals one robot part; before a term is done its part is a soft dashed
 * blueprint outline, so the whole robot reads as a plan at 0/11 and as a
 * finished, friendly bot at 11/11.
 *
 * Part → term map (keeps the app's existing part meanings where they line up):
 *   head shell    → context-window   antenna    → skill
 *   face / eyes   → hallucination     side dials → temperature
 *   mouth         → token             neck       → prompt
 *   body casing   → guardrails        chest core → memory
 *   port panel    → mcp               arms       → tool-use
 *   wheeled base  → agent
 *
 * Colours reference the app's theme tokens (not raw hex), so the robot re-skins
 * along with the rest of the UI and works if a dark theme is added. Red parts
 * use the brand `tomato` token (as the rest of the app's bot art does); cheeks
 * are a soft tint of it.
 */
const NAVY = 'var(--color-text)'
const SHELL = 'var(--color-surface)'
const SAGE = 'var(--color-neutral)'
const RED = 'var(--color-tomato)'
const SKY = 'var(--color-accent)'
const DEEP = 'var(--color-tertiary)'
const BLUSH = 'var(--color-tomato)'

const SIZE_DEFAULT =
  'mx-auto block h-auto w-full min-h-[200px] max-h-[calc(100svh-20rem)] max-w-[280px]'

/**
 * @param sizeClassName base sizing for the <svg>; defaults to the Workshop /
 *   Progress board size. Callers that need a different footprint (e.g. the
 *   landing page's small step illustration) pass their own.
 */
export default function BotCanvas({
  completedTerms = [],
  className = '',
  sizeClassName = SIZE_DEFAULT,
}) {
  const done = new Set(completedTerms)
  const powered = done.size >= terms.length

  /** Finished part when its term is done, else a dashed blueprint outline. */
  const part = (id, outline, children) =>
    done.has(id) ? (
      <g>{children}</g>
    ) : (
      <g
        fill="none"
        stroke={NAVY}
        strokeWidth={3}
        strokeDasharray="7 7"
        strokeLinecap="round"
        opacity={0.3}
      >
        {outline}
      </g>
    )

  return (
    <svg
      viewBox="0 0 340 520"
      className={`${sizeClassName} select-none ${className}`}
      role="img"
      aria-label={`Pizza bot, ${done.size} of ${terms.length} parts installed`}
    >
      {/* soft "powered on" halo once every part is in */}
      {powered && <ellipse cx={170} cy={300} rx={150} ry={210} fill={SKY} opacity={0.14} />}

      {/* ground shadow */}
      <ellipse cx={170} cy={486} rx={104} ry={13} fill={NAVY} opacity={0.08} />

      {/* antenna → skill */}
      {part(
        'skill',
        <>
          <path d="M170 100 C170 78 170 70 170 62" />
          <circle cx={170} cy={50} r={14} />
        </>,
        <>
          <path d="M170 104 C170 82 170 72 170 64" stroke={NAVY} strokeWidth={9} strokeLinecap="round" fill="none" />
          <circle cx={170} cy={50} r={15} fill={RED} stroke={NAVY} strokeWidth={5} />
          <circle cx={165} cy={45} r={4} fill={SHELL} opacity={0.85} />
        </>,
      )}

      {/* neck → prompt */}
      {part(
        'prompt',
        <rect x={150} y={212} width={40} height={48} rx={14} />,
        <>
          <rect x={150} y={212} width={40} height={48} rx={14} fill={SAGE} stroke={NAVY} strokeWidth={5} />
          <line x1={152} y1={234} x2={188} y2={234} stroke={NAVY} strokeWidth={4} strokeLinecap="round" />
        </>,
      )}

      {/* left arm → tool-use */}
      {part(
        'tool-use',
        <>
          <path d="M64 300 C36 302 28 320 30 340" />
          <circle cx={30} cy={356} r={19} />
        </>,
        <>
          <path d="M66 300 C38 302 30 320 32 340" fill="none" stroke={NAVY} strokeWidth={16} strokeLinecap="round" />
          <path d="M66 300 C38 302 30 320 32 340" fill="none" stroke={SAGE} strokeWidth={9} strokeLinecap="round" />
          <circle cx={30} cy={356} r={19} fill={SHELL} stroke={NAVY} strokeWidth={5} />
          <circle cx={30} cy={356} r={8} fill={SKY} stroke={NAVY} strokeWidth={3} />
        </>,
      )}

      {/* right arm → tool-use */}
      {part(
        'tool-use',
        <>
          <path d="M276 300 C304 302 312 320 310 340" />
          <circle cx={310} cy={356} r={19} />
        </>,
        <>
          <path d="M274 300 C302 302 310 320 308 340" fill="none" stroke={NAVY} strokeWidth={16} strokeLinecap="round" />
          <path d="M274 300 C302 302 310 320 308 340" fill="none" stroke={SAGE} strokeWidth={9} strokeLinecap="round" />
          <circle cx={310} cy={356} r={19} fill={SHELL} stroke={NAVY} strokeWidth={5} />
          <circle cx={310} cy={356} r={8} fill={SKY} stroke={NAVY} strokeWidth={3} />
        </>,
      )}

      {/* wheeled base → agent */}
      {part(
        'agent',
        <>
          <rect x={88} y={418} width={164} height={30} rx={15} />
          <circle cx={118} cy={458} r={22} />
          <circle cx={222} cy={458} r={22} />
        </>,
        <>
          <rect x={88} y={416} width={164} height={32} rx={16} fill={SAGE} stroke={NAVY} strokeWidth={5} />
          <circle cx={118} cy={458} r={22} fill={SHELL} stroke={NAVY} strokeWidth={5} />
          <circle cx={118} cy={458} r={9} fill={SKY} stroke={NAVY} strokeWidth={3} />
          <circle cx={222} cy={458} r={22} fill={SHELL} stroke={NAVY} strokeWidth={5} />
          <circle cx={222} cy={458} r={9} fill={SKY} stroke={NAVY} strokeWidth={3} />
        </>,
      )}

      {/* body shell + red side thrusters → guardrails (safety casing) */}
      {part(
        'guardrails',
        <>
          <rect x={64} y={252} width={212} height={172} rx={52} />
          <path d="M64 288 q-22 -10 -22 14 q0 24 22 16 z" />
          <path d="M276 288 q22 -10 22 14 q0 24 -22 16 z" />
        </>,
        <>
          <path d="M66 288 q-24 -12 -24 14 q0 26 24 18 z" fill={RED} stroke={NAVY} strokeWidth={5} />
          <path d="M274 288 q24 -12 24 14 q0 26 -24 18 z" fill={RED} stroke={NAVY} strokeWidth={5} />
          <rect x={64} y={252} width={212} height={172} rx={52} fill={SHELL} stroke={NAVY} strokeWidth={7} />
        </>,
      )}

      {/* control / port panel → mcp */}
      {part(
        'mcp',
        <>
          <rect x={196} y={294} width={54} height={92} rx={20} />
          <circle cx={106} cy={392} r={9} />
        </>,
        <>
          <rect x={196} y={294} width={54} height={92} rx={20} fill={SAGE} stroke={NAVY} strokeWidth={5} />
          <rect x={208} y={312} width={30} height={10} rx={5} fill={SKY} stroke={NAVY} strokeWidth={3} />
          <rect x={208} y={336} width={30} height={10} rx={5} fill={SKY} stroke={NAVY} strokeWidth={3} />
          <circle cx={223} cy={368} r={8} fill={RED} stroke={NAVY} strokeWidth={3} />
          <circle cx={106} cy={392} r={9} fill={SKY} stroke={NAVY} strokeWidth={3} />
          <circle cx={132} cy={392} r={9} fill={SKY} stroke={NAVY} strokeWidth={3} />
        </>,
      )}

      {/* chest core → memory */}
      {part(
        'memory',
        <>
          <circle cx={128} cy={322} r={38} />
          <circle cx={128} cy={322} r={17} />
        </>,
        <>
          {powered && <circle cx={128} cy={322} r={44} fill={SKY} opacity={0.5} />}
          <circle cx={128} cy={322} r={38} fill={RED} stroke={NAVY} strokeWidth={6} />
          <circle cx={128} cy={322} r={22} fill={SHELL} stroke={NAVY} strokeWidth={4} />
          <circle cx={128} cy={322} r={10} fill={SKY} stroke={NAVY} strokeWidth={3} />
        </>,
      )}

      {/* side dials → temperature */}
      {part(
        'temperature',
        <>
          <rect x={56} y={140} width={22} height={44} rx={11} />
          <rect x={262} y={140} width={22} height={44} rx={11} />
        </>,
        <>
          <rect x={56} y={140} width={22} height={44} rx={11} fill={SAGE} stroke={NAVY} strokeWidth={5} />
          <rect x={262} y={140} width={22} height={44} rx={11} fill={SAGE} stroke={NAVY} strokeWidth={5} />
        </>,
      )}

      {/* head shell → context-window */}
      {part(
        'context-window',
        <rect x={76} y={104} width={188} height={140} rx={48} />,
        <rect x={76} y={104} width={188} height={140} rx={48} fill={SHELL} stroke={NAVY} strokeWidth={7} />,
      )}

      {/* face / visor with eyes → hallucination */}
      {part(
        'hallucination',
        <>
          <rect x={98} y={128} width={144} height={78} rx={34} />
          <circle cx={140} cy={168} r={12} />
          <circle cx={200} cy={168} r={12} />
        </>,
        <>
          <rect x={98} y={128} width={144} height={78} rx={34} fill={SKY} stroke={NAVY} strokeWidth={6} />
          <circle cx={140} cy={168} r={14} fill={NAVY} />
          <circle cx={200} cy={168} r={14} fill={NAVY} />
          <circle cx={135} cy={162} r={5} fill={SHELL} />
          <circle cx={195} cy={162} r={5} fill={SHELL} />
          <circle cx={112} cy={192} r={8} fill={BLUSH} opacity={0.3} />
          <circle cx={228} cy={192} r={8} fill={BLUSH} opacity={0.3} />
        </>,
      )}

      {/* mouth / smile → token ("Mouth" in terms.json) */}
      {part(
        'token',
        <path d="M144 220 q26 20 52 0" />,
        <path d="M144 218 q26 22 52 0" fill="none" stroke={DEEP} strokeWidth={7} strokeLinecap="round" />,
      )}
    </svg>
  )
}
