/**
 * ProgressPie, the game's progress drawn as a pizza: `total` slices, the first
 * `current` of them marinara, the rest still uncooked (grey). Replaces the
 * "Round 2 / 3" text (Phase 1 review, Q5: numbers read as a phase label, not
 * as progress). The count is kept for screen readers only.
 */
function slicePath(i, n, r) {
  const a0 = (i / n) * 2 * Math.PI - Math.PI / 2
  const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2
  const x0 = r + r * Math.cos(a0)
  const y0 = r + r * Math.sin(a0)
  const x1 = r + r * Math.cos(a1)
  const y1 = r + r * Math.sin(a1)
  const large = 1 / n > 0.5 ? 1 : 0
  return `M${r},${r} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`
}

export default function ProgressPie({ current, total, unit, size = 22 }) {
  const r = 16
  const label = `${unit ? unit + ' ' : ''}${current} of ${total}`
  if (total === 1) {
    return (
      <span className="flex items-center gap-1.5" role="img" aria-label={label}>
        <span
          className="inline-block rounded-full border-2 border-neutral"
          style={{ width: size, height: size, background: 'var(--color-primary)' }}
        />
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5" role="img" aria-label={label}>
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="var(--color-neutral)" />
        {Array.from({ length: total }).map((_, i) => (
          <path
            key={i}
            d={slicePath(i, total, r)}
            transform="translate(0 0)"
            fill={i < current ? 'var(--color-primary)' : 'var(--color-muted)'}
            stroke="var(--color-neutral)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </span>
  )
}
