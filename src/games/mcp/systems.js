// Self-contained content for this game only.
// Round 1: each system needs its own fiddly custom adapter (more pins = more tedium).
export const customSystems = [
  { id: 'ordering', name: 'Ordering system', connector: 'triangle connector', pins: 3 },
  { id: 'pos', name: 'POS system', connector: 'spiral connector', pins: 5 },
  { id: 'delivery', name: 'Delivery service', connector: 'seven-pin connector', pins: 7 },
]

export const surpriseSystem = { id: 'loyalty', name: 'Loyalty program' }

// Round 2: same systems plus the surprise one, all through one standard port.
export const allSystems = [...customSystems, surpriseSystem]
