// Self-contained content for the MCP game only.
//
// "The wiring board". Every outside system has its own shaped socket, so
// every bot needs its own custom plug to reach it. The player wires them by
// hand. Then a new system arrives. Then a second bot arrives, and none of
// the earlier wiring helps. The tangle the player built with their own taps
// IS the lesson: bots x systems = custom connectors.
//
// Then one shared plug shows up, and the multiplication turns into addition.

export const BOTS = {
  pizza: { id: 'pizza', name: 'Pizza Bot', icon: 'smart_toy' },
  phone: { id: 'phone', name: 'Phone Bot', icon: 'support_agent' },
  kitchen: { id: 'kitchen', name: 'Kitchen Bot', icon: 'restaurant' },
}

export const SYSTEMS = {
  orders: { id: 'orders', name: 'Orders', shape: 'triangle' },
  till: { id: 'till', name: 'Till', shape: 'square' },
  delivery: { id: 'delivery', name: 'Delivery', shape: 'hexagon' },
  loyalty: { id: 'loyalty', name: 'Loyalty', shape: 'star' },
  stock: { id: 'stock', name: 'Stock', shape: 'circle' },
}

// The plugs available in the tray, in a fixed order so the player is
// matching a shape, not hunting a moving target.
export const PLUGS = ['triangle', 'square', 'hexagon', 'star', 'circle']

// Round 1, hand wiring. Each stage adds something and makes the player
// feel the cost of it.
export const STAGES = [
  {
    bots: ['pizza'],
    systems: ['orders', 'till', 'delivery'],
    target: 'pizza',
    banner: null,
    hint: 'Tap a system, then pick the plug shape that fits its socket.',
  },
  {
    bots: ['pizza'],
    systems: ['orders', 'till', 'delivery', 'loyalty'],
    target: 'pizza',
    banner: 'New: the Loyalty program just went live.',
    hint: 'New system, new socket shape, new custom plug. Nobody can reuse this one.',
  },
  {
    bots: ['pizza', 'phone'],
    systems: ['orders', 'till', 'delivery', 'loyalty'],
    target: 'phone',
    banner: 'New: the Phone Bot handles calls. It needs the same four systems.',
    hint: 'None of the Pizza Bot wiring helps here. Start over, four more times.',
  },
]

// The prediction beat. The player works out the multiplication themselves,
// which is the whole point of the game.
export const PREDICT = {
  question:
    'A third bot is arriving: the Kitchen Bot. With 3 bots and 4 systems, how many custom connections does someone have to build and keep working?',
  options: [
    {
      value: 4,
      label: '4',
      why: 'That would be one connection per system, shared by all the bots. But look at the board. The plug you built from the Pizza Bot into Orders does nothing for the Phone Bot. Each bot still has to build its own. Try again.',
    },
    {
      value: 7,
      label: '7',
      why: 'That is the bots and the systems added up. But a connection is not owned by one side. It joins one bot to one system, so count the pairs instead. How many systems does each bot need? And how many bots are there? Try again.',
    },
    {
      value: 12,
      label: '12',
      why: '3 bots x 4 systems = 12. Every single pair needs its own connection, built by somebody and kept working by somebody. Add a fifth system and it is 15.',
    },
  ],
  correct: 12,
}

// Round 2, the shared plug.
export const HUB = {
  name: 'MCP',
  sub: 'one shared plug',
  bots: ['pizza', 'phone', 'kitchen'],
  systems: ['orders', 'till', 'delivery', 'loyalty'],
}

// The proof at the end: a brand new system, added once.
export const NEW_SYSTEM = 'stock'
