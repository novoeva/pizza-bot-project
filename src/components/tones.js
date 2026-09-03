/**
 * The verdict colours shared by Callout and StatusStrip, so "problem" and
 * "success" look the same on a card and on a strip (roles 6 and 7 in
 * COMPONENT-AUDIT.md §2).
 */
export const TONES = {
  problem: { box: 'border-danger bg-danger-bg', label: 'text-danger', icon: 'warning' },
  success: { box: 'border-success bg-success-bg', label: 'text-success', icon: 'check_circle' },
  info: { box: 'border-neutral bg-surface', label: 'text-text-muted', icon: 'info' },
}
