import { useRef, useState } from 'react'
import Panel from './Panel.jsx'
import { PART_MIME } from './PartTile.jsx'

/**
 * SlotList, the place inside your bot where PartTiles land (role 5, R3).
 * `capacity` dashed slots; landed parts are amber tiles with a number and a ✕
 * that sends them back to the shelf. Accepts drops from PartTile (HTML drag
 * and drop) and, through the tiles' own tap fallback, taps.
 *
 * While a tile is being dragged over the list, the next empty slot lights up
 * amber and says "Drop here". Once per session the first empty slot pulses,
 * paired with the first tile's wiggle, so a first-time player sees the move.
 *
 *   items      [{ id, icon, label }] in order
 *   accepts    optional list of part ids this list may take; anything else
 *              dropped on it (a tile from another list, stray page text) is
 *              ignored instead of reaching game state
 *   onDrop(id) called with the dragged tile's id
 *   onRemove(index)
 *   emptyLabel what an empty slot says ("drag a step here…"); on touch
 *              screens `emptyTapLabel` is shown instead ("tap a step to add it…")
 */
export default function SlotList({
  title,
  icon = 'construction',
  meta,
  capacity,
  items,
  accepts,
  onDrop,
  onRemove,
  onClear,
  emptyLabel = 'drag a step here…',
  emptyTapLabel = 'tap a part to add it…',
  numbered = true,
  pulse = false,
}) {
  const [over, setOver] = useState(false)
  // dragenter/dragleave fire for every child boundary (and Safari leaves
  // relatedTarget null), so count depth instead of trusting one leave event.
  const depth = useRef(0)
  const nextEmpty = items.length
  const full = items.length >= capacity

  return (
    <div
      onDragEnter={(e) => {
        if (full || !e.dataTransfer.types.includes(PART_MIME)) return
        depth.current += 1
        if (!over) setOver(true)
      }}
      onDragOver={(e) => {
        if (full || !e.dataTransfer.types.includes(PART_MIME)) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setOver(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        depth.current = 0
        setOver(false)
        const id = e.dataTransfer.getData(PART_MIME)
        if (!id || full) return
        if (accepts && !accepts.includes(id)) return
        if (items.some((it) => it.id === id)) return
        onDrop?.(id)
      }}
    >
      <Panel compact title={title} icon={icon} meta={meta ?? `${items.length}/${capacity}`}>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: capacity }).map((_, i) => {
            const item = items[i]
            if (!item) {
              const target = i === nextEmpty && (over || pulse)
              return (
                <div
                  key={'empty-' + i}
                  className={
                    'flex min-h-[42px] items-center gap-2 rounded-md border-2 border-dashed px-2.5 py-2 text-[12px] ' +
                    (target
                      ? 'border-cheese-dim bg-cheese-bg/50 font-label font-bold text-cheese-dim ' +
                        (pulse && !over ? 'slot-pulse' : '')
                      : 'border-slot-empty text-text-muted')
                  }
                >
                  {numbered && <span className="w-4 text-center font-label text-[11px] font-bold">{i + 1}</span>}
                  {over && i === nextEmpty ? (
                    <>
                      <span className="material-symbols-rounded text-[16px]">south</span>
                      Drop here
                    </>
                  ) : (
                    <>
                      <span className="touch:hidden">{emptyLabel}</span>
                      <span className="hidden touch:inline">{emptyTapLabel}</span>
                    </>
                  )}
                </div>
              )
            }
            return (
              <div
                key={item.id}
                className="part-land flex min-h-[42px] items-center gap-2 rounded-md border-[3px] border-cheese-dim bg-cheese-bg px-2.5 py-2 text-[13px] font-bold text-text"
              >
                {numbered && (
                  <span className="w-4 text-center font-label text-[11px] font-bold text-cheese-dim">{i + 1}</span>
                )}
                {item.icon && <span className="material-symbols-rounded text-[16px] text-cheese-dim">{item.icon}</span>}
                <span className="leading-tight">{item.label}</span>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="ml-auto font-label text-[13px] font-bold text-cheese-dim"
                    aria-label={`Take back ${item.label}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {onClear && items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="mt-2 w-full text-center font-label text-[11px] font-bold text-text-muted"
          >
            ↻ clear the list
          </button>
        )}
      </Panel>
    </div>
  )
}
