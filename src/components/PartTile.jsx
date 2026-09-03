/**
 * PartTile, a part you can put into your bot (role 5 in COMPONENT-AUDIT.md
 * §2, decision R3). Amber from the start, the same colour as the slot it
 * lands in: a part never changes colour, it changes place.
 *
 * Obviously draggable, the five signals from R3:
 *   1. a grab handle, grab cursor on hover
 *   2. the hint says the verb: "drag ↑" (touch: "tap to add")
 *   3. (the SlotList's empty slot says "drag a step here…")
 *   4. (SlotList wiggles the first tile once per session, see `wiggle`)
 *   5. tap works too and slides the tile into the slot
 *
 * `used`: already in the bot, shown faded on the shelf. `onAdd` is the tap
 * fallback; drag carries `id` to the SlotList via dataTransfer.
 */
/** The drag payload type PartTile writes and SlotList reads. Page text
 * dragged by accident is text/plain and is ignored. */
export const PART_MIME = 'application/x-pizzabot-part'

export default function PartTile({ id, icon, label, detail, foot, used = false, usedLabel = 'in the bot', onAdd, wiggle = false }) {
  return (
    <div
      role="button"
      tabIndex={used ? -1 : 0}
      draggable={!used}
      aria-disabled={used}
      onClick={used ? undefined : onAdd}
      onKeyDown={(e) => {
        if (!used && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onAdd?.()
        }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData(PART_MIME, id)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.classList.add('part-dragging')
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove('part-dragging')}
      className={
        'flex items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-2.5 py-2.5 ' +
        (used ? 'opacity-40' : 'press cursor-grab shadow-pop active:cursor-grabbing ') +
        (wiggle && !used ? 'part-wiggle' : '')
      }
    >
      <span className="material-symbols-rounded shrink-0 text-[20px] text-cheese-dim" aria-hidden="true">
        drag_indicator
      </span>
      {icon && <span className="material-symbols-rounded shrink-0 text-[18px] text-cheese-dim">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-snug text-text">{label}</span>
        {detail && <span className="mt-0.5 block text-[12px] leading-snug text-text-muted">{detail}</span>}
        {foot && <span className="mt-1 block font-label text-[9px] text-text-muted">{foot}</span>}
      </span>
      <span className="ml-auto shrink-0 font-label text-[10px] text-cheese-dim">
        {used ? (
          usedLabel
        ) : (
          <>
            <span className="[@media(hover:none)]:hidden">drag ↑</span>
            <span className="hidden [@media(hover:none)]:inline">tap to add</span>
          </>
        )}
      </span>
    </div>
  )
}
