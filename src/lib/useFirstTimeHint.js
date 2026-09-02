import { useEffect, useState } from 'react'

const KEY = 'pizzabot-drag-hint-seen'

/**
 * True for ~2 s on the first build screen of a session, false ever after:
 * drives the one-time "the tile moves" hint (PartTile wiggle + SlotList
 * pulse, decision R3). Reads/writes sessionStorage; if storage is blocked
 * there is simply no hint.
 */
export function useFirstTimeHint() {
  const [hint, setHint] = useState(() => {
    try {
      if (sessionStorage.getItem(KEY)) return false
      sessionStorage.setItem(KEY, '1')
      return true
    } catch {
      return false
    }
  })
  useEffect(() => {
    if (!hint) return
    const t = setTimeout(() => setHint(false), 2200)
    return () => clearTimeout(t)
  }, [hint])
  return hint
}
