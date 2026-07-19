/** The workshop's current failure-mode line — the humor engine and the call to action. */
export default function FailureLine({ line }) {
  if (!line) return null

  return (
    <p className="rounded-md bg-bg-raised border border-border px-4 py-3 text-sm italic text-text-muted">
      {line}
    </p>
  )
}
