// Self-contained content for the MCP game only.
//
// The metaphor (PIZZA-23 round 2, Eva): plugs and sockets. Your bot has one
// plug shape. Every system your pizzeria runs on has its own socket shape, so
// the bot only fits one of them; the rest need an adapter you build and keep
// maintaining. Then MCP: one socket shape everybody agreed on, like USB-C.
// Anything with that socket clicks straight in, including a tool built by
// people who have never heard of your bot.

export const BOT = { name: 'Pizza Bot', icon: 'smart_toy', plug: 'round' }

// The shape vocabulary. `mcp` is the one shared shape.
export const SHAPES = {
  round: { label: 'round' },
  square: { label: 'square' },
  triangle: { label: 'triangle' },
  hex: { label: 'hexagon' },
  mcp: { label: 'MCP' },
}

// The systems your pizzeria already runs on. Only Bookings happens to share
// the bot's plug shape; the other two need an adapter the old way.
export const SYSTEMS = [
  { id: 'menu', name: 'Menu', icon: 'menu_book', desc: "today's pizzas and prices", socket: 'square' },
  { id: 'delivery', name: 'Delivery', icon: 'local_shipping', desc: 'dispatch a driver', socket: 'triangle' },
  { id: 'bookings', name: 'Bookings', icon: 'event_seat', desc: 'table reservations', socket: 'round' },
]

// The tool you want next. Yet another shape.
export const EXTRA = { id: 'loyalty', name: 'Loyalty app', icon: 'loyalty', desc: 'points and rewards', socket: 'hex' }

// The brand-new tool a stranger built last month, that already has the MCP socket.
export const STRANGER = {
  id: 'stock',
  name: 'Stock tracker',
  icon: 'inventory_2',
  desc: 'live ingredient levels, built by another company',
  socket: 'mcp',
}

// What each hand-built adapter costs, so the friction is a number that climbs.
export const WEEKS_PER_ADAPTER = 3

// Reveal aside: why people call it "USB-C for AI".
export const usbTitle = 'Why people call MCP "USB-C for AI"'
export const usbBody =
  'Before USB-C, every phone had its own charger and every drawer was full of adapters. One agreed shape fixed that. MCP is the same agreement for AI tools: your bot and the systems around it speak one shared standard, so they fit without a custom adapter, even when the two sides were built by people who never met.'
