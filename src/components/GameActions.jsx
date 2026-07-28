import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'

const GameActionsContext = createContext(null)

/**
 * Wrap the app frame so a game's action bar and the fixed slot it renders into
 * share one DOM node. This is what lets every game pin its "what do I do next"
 * control to the bottom of the screen without each game measuring the nav.
 */
export function GameActionsProvider({ children }) {
  const [node, setNode] = useState(null)
  // Stable callback ref: fires once when the slot div mounts/unmounts, not on
  // every render, so publishing the node never loops.
  const attachSlot = useCallback((el) => setNode(el), [])
  return (
    <GameActionsContext.Provider value={{ node, attachSlot }}>{children}</GameActionsContext.Provider>
  )
}

/**
 * The fixed slot the action bar portals into. Lives directly above the bottom
 * nav inside one fixed stack (see Layout), so the bar always sits on screen and
 * we never have to compute the nav's height.
 */
export function GameActionsSlot() {
  const ctx = useContext(GameActionsContext)
  if (!ctx) throw new Error('GameActionsSlot must be rendered inside GameActionsProvider')
  const { attachSlot } = ctx
  return <div ref={attachSlot} />
}

const BUTTON_VARIANTS = {
  primary: 'border-neutral bg-primary text-white',
  accent: 'border-neutral bg-tertiary text-white',
  neutral: 'border-neutral bg-surface text-text',
  soft: 'border-cheese-dim bg-cheese-bg text-cheese-dim',
}

/**
 * The one true action button. Owns the shared styling so no game repeats it;
 * `variant` picks the colour, `icon` is an optional leading material symbol.
 * Full-width by design, since it lives in the pinned bar.
 */
export function GameActionButton({
  variant = 'primary',
  icon,
  iconFill = false,
  onClick,
  disabled = false,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        'press flex w-full items-center justify-center gap-2 rounded-md border-[3px] py-3 font-label font-bold shadow-pop disabled:opacity-40 ' +
        BUTTON_VARIANTS[variant]
      }
    >
      {icon && (
        <span className={'material-symbols-rounded' + (iconFill ? ' fill' : '')}>{icon}</span>
      )}
      {children}
    </button>
  )
}

/**
 * Pins its children to the bottom of the screen as a bordered action bar.
 * Games wrap their forward / primary GameActionButton(s) in this so the control
 * that moves you on is always visible, never stranded below the fold on mobile.
 * Renders nothing inline, it portals into the shared slot. Use at most one per
 * screen (one per game phase).
 */
export default function GameActions({ children }) {
  const ctx = useContext(GameActionsContext)
  const node = ctx?.node ?? null

  if (!ctx) throw new Error('GameActions must be rendered inside GameActionsProvider')
  // ctx.node is legitimately null for the first render, before the slot's ref
  // has attached; render nothing until it exists, then portal in.
  if (!node) return null
  return createPortal(
    <div className="mx-auto max-w-game border-t-[3px] border-neutral bg-bg lg:max-w-[34rem]">
      <div className="flex flex-col gap-2 px-4 py-3">{children}</div>
    </div>,
    node,
  )
}
