// Self-contained content for this game only.
// The customer's actual request is always visible — the player is never
// asked to guess it, only to translate it into a specific enough prompt.
export const customerRequest = 'Medium pepperoni pizza, thin crust, no onions, please!'

export const round1Options = [
  {
    label: '"Make something good"',
    result:
      'The bot delivers a colossal pizza topped with anchovies, gummy bears, and a scoop of vanilla ice cream.',
  },
  {
    label: '"Give me the usual"',
    result: 'The bot delivers a snack-sized pizza with a thin smear of ketchup on cardboard. There is no "usual."',
  },
  {
    label: '"Surprise me!"',
    result: 'The bot delivers a frosted, pizza-shaped cake with a candle in the middle. Happy... pizza day?',
  },
]

export const round2Categories = [
  { name: 'Size', options: ['Small', 'Medium', 'Large'], correct: 'Medium' },
  { name: 'Toppings', options: ['Mushroom', 'Pepperoni', 'Ham & pineapple'], correct: 'Pepperoni' },
]

export const round3Categories = [
  ...round2Categories,
  {
    name: 'Crust & extras',
    options: ['Thin crust, no onions', 'Thick crust, extra onions', 'Stuffed crust, light onions'],
    correct: 'Thin crust, no onions',
  },
]
