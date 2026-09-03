// Self-contained content for the MCP game only.
//
// Role frame: you're the OWNER, and you have one bot. It needs to reach the
// systems your pizzeria runs on. The old way, each one needs its own custom
// connector, built to order and maintained forever, and every new tool you
// want is another custom build and another wait. You feel that friction one
// system at a time. Then MCP gives your bot a single universal port: anything
// that speaks MCP just clicks in, including a tool a stranger built that has
// never heard of your bot. No custom bridge, no waiting.

export const BOT = { name: 'Pizza Bot', icon: 'smart_toy' }

// The systems your pizzeria already runs on, that your bot needs to reach.
export const NEEDED = [
  { id: 'menu', name: 'Menu', icon: 'menu_book', desc: "today's pizzas and prices" },
  { id: 'delivery', name: 'Delivery', icon: 'local_shipping', desc: 'dispatch a driver' },
  { id: 'bookings', name: 'Bookings', icon: 'event_seat', desc: 'table reservations' },
]

// The extra tool you decide you want partway through — still the old, custom way.
export const EXTRA = { id: 'loyalty', name: 'Loyalty app', icon: 'loyalty', desc: 'points and rewards' }

// The brand-new tool a stranger built last month, that already speaks MCP.
export const STRANGER = {
  id: 'stock',
  name: 'Stock tracker',
  icon: 'inventory_2',
  desc: 'live ingredient levels, built by another company',
}

// How long each hand-built connector costs, so the friction is a real number
// that keeps climbing as you connect more systems.
export const WEEKS_PER_CONNECTOR = 3
