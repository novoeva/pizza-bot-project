import { Suspense, useCallback, useLayoutEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { gameRegistry } from '../games/registry.js'
import { markTermCompleted } from '../lib/progress.js'
import terms from '../content/terms.json'

export default function GameScreen() {
  const { termId } = useParams()
  const navigate = useNavigate()
  const GameComponent = gameRegistry[termId]
  const term = terms.find((t) => t.id === termId)

  const handleComplete = useCallback(() => {
    markTermCompleted(termId)
    navigate('/')
  }, [termId, navigate])

  // Baseline: opening or switching games always starts at the top, even if a
  // game forgets its own useGameScroll. Intra-game page turns are handled by
  // that hook; this only covers game entry.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [termId])

  if (!GameComponent || !term) {
    return (
      <main className="mx-auto max-w-game px-4 py-8 text-center">
        <p className="mb-4 text-text-muted">This game doesn't exist yet.</p>
        <Link to="/" className="font-label text-primary underline">
          Back to the workshop
        </Link>
      </main>
    )
  }

  return (
    <main
      className="mx-auto max-w-game px-4 pt-5"
      // Clear the fixed bottom stack (action bar + nav), whatever its height,
      // plus a little breathing room. Falls back to a sane constant on the
      // first paint before Layout measures it.
      style={{ paddingBottom: 'calc(var(--bottom-stack-h, 9rem) + 1.5rem)' }}
    >
      <Suspense fallback={<p className="mt-12 text-center text-text-muted">Loading…</p>}>
        <GameComponent termId={term.id} onComplete={handleComplete} />
      </Suspense>
    </main>
  )
}
