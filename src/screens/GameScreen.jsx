import { Suspense, useCallback } from 'react'
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

  if (!GameComponent || !term) {
    return (
      <main className="mx-auto max-w-game px-4 py-8 text-center">
        <p className="text-text-muted mb-4">This game doesn't exist yet.</p>
        <Link to="/" className="text-cheese underline">
          Back to the workshop
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-game min-h-screen px-4 py-6">
      <Link to="/" className="inline-block text-text-muted text-sm mb-4">
        ← Workshop
      </Link>
      <Suspense fallback={<p className="text-text-muted text-center mt-12">Loading…</p>}>
        <GameComponent termId={term.id} onComplete={handleComplete} />
      </Suspense>
    </main>
  )
}
