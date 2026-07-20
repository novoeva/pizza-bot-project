// Self-contained content for this game only.
export const round1Lines = [
  { speaker: 'customer', text: "Hi! I'd like a large diavola, please." },
  {
    speaker: 'bot',
    text: 'Great choice! The diavola is one of our most popular pizzas — spicy salami, chili oil, and a rich tomato base.',
  },
  { speaker: 'customer', text: 'Sounds great. Can I get one delivered?' },
  {
    speaker: 'bot',
    text: 'Absolutely — it pairs wonderfully with a nice Chianti if you feel like treating yourself!',
  },
  { speaker: 'customer', text: '...so where\'s my pizza?' },
]

export const actionSteps = [
  { id: 'menu', label: 'Check menu', kitchenText: 'Menu checked ✓' },
  { id: 'confirm', label: 'Confirm order', kitchenText: 'Order confirmed: 1x large diavola ✓' },
  { id: 'charge', label: 'Charge card', kitchenText: 'Payment: $18.00 charged ✓' },
  { id: 'send', label: 'Send to kitchen', kitchenText: '🍕 Pizza in the oven!' },
]
