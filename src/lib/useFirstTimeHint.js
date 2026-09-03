import { useEffect, useState } from 'react'

const KEY = 'pizzabot-drag-hint-seen'

/**
 * True for ~2 s the first time a build screen is on screen in this session,
 * false otherwise: drives the one-time "the tile moves" hint (PartTile wiggle
 * + SlotList pulse, decision R3).
 *
 * Pass `active` = "the build screen is showing now". The hint starts when
 * `active` turns true, and the sessionStorage key is written only when the
 * hint has run to its end, so StrictMode's mount/unmount/mount in dev and a
 * quick navigation away do not burn it. If storage is blocked there is simply
 * no hint.
 */
export function useFirstTimeHint(active = true) {
  const [hint, setHint] = useState(false)
  useEffect(() => {
    if (!active) return
    try {
      if (sessionStorage.getItem(KEY)) return
    } catch {
      return
    }
    const start = setTimeout(() => setHint(true), 0)
    const stop = setTimeout(() => {
      setHint(false)
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* storage blocked */
      }
    }, 2200)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
      setHint(false)
    }
  }, [active])
  return hint
}
