// Content + data for the Agent game ("From chat to agent").
//
// The whole lesson in one line: a chatbot only TALKS; an agent ACTS. It fires
// real actions in real systems (checks stock, charges the card, tells the
// kitchen, sends a driver), no human in between. The player feels it by first
// watching a chatbot produce nothing but words, then BUILDING the agent: they
// give it the real actions to take, in a sensible order, and watch each one
// light up an external system. Order matters (an agent acts in the real world),
// so a bad sequence (driver before the kitchen's even cooked) fails funnily
// and sends the player back to fix it.

// The incoming order the agent has to actually fulfill.
export const order = {
  customer: 'Marco',
  text: '“One large diavola to 12 Main St, please. Paying by card.”',
}

// Round 1: the plain chatbot. All talk, triggers nothing.
export const chatbotReply =
  '“Ooh, the diavola is our spiciest one. You’ll love it! Just call the shop to order.”'

// The real actions the player can hand the agent (the to-do list it builds).
export const actions = [
  { id: 'stock', icon: 'inventory_2', label: 'Check the stock' },
  { id: 'charge', icon: 'credit_card', label: 'Charge the card' },
  { id: 'kitchen', icon: 'skillet', label: 'Fire it to the kitchen' },
  { id: 'driver', icon: 'moped', label: 'Send out a driver' },
]

// The three headline external systems shown as "screens" that wake up when the
// matching action fires. (Stock is a check, not a headline system, so it only
// shows in the fired-actions feed.)
export const systems = [
  { id: 'charge', icon: 'credit_card', name: 'Payment' },
  { id: 'kitchen', icon: 'skillet', name: 'Kitchen' },
  { id: 'driver', icon: 'moped', name: 'Delivery' },
]

// What each action reports when it fires, shown in the systems and the feed.
export const fired = {
  stock: { icon: 'inventory_2', name: 'Stock', result: 'Diavola in stock ✓' },
  charge: { icon: 'credit_card', name: 'Payment', result: 'Charged €14.50' },
  kitchen: { icon: 'skillet', name: 'Kitchen', result: 'Order #A12 firing' },
  driver: { icon: 'moped', name: 'Delivery', result: 'Luca → 12 Main St' },
}

// The two order mistakes worth catching, with the real-world consequence.
const snags = {
  driverBeforeKitchen:
    'You sent the driver before the kitchen even cooked. Luca is parked outside with an empty bag.',
  kitchenBeforeStock: 'The kitchen started before anyone checked stock. No dough, so the order jammed.',
}

/**
 * Validate the player's action order the way the real world would. Returns null
 * when the sequence holds up, or { msg, lit } describing the failure and which
 * system fired out of turn. Assumes all four actions are present.
 */
export function validateSequence(seq) {
  const at = (id) => seq.indexOf(id)
  if (at('driver') < at('kitchen')) return { msg: snags.driverBeforeKitchen, lit: 'driver' }
  if (at('kitchen') < at('stock')) return { msg: snags.kitchenBeforeStock, lit: 'kitchen' }
  return null
}
