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
        <p className="mb-4 text-text-muted">This game doesn't exist yet.</p>
        <Link to="/" className="font-label text-primary underline">
          Back to the workshop
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-game px-4 pb-6 pt-5 lg:max-w-[34rem] lg:pt-10">
      <Suspense fallback={<p className="mt-12 text-center text-text-muted">Loading…</p>}>
        <GameComponent termId={term.id} onComplete={handleComplete} />
      </Suspense>
    </main>
  )
}
