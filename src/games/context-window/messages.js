// Self-contained content for this game only.
// A rambling order — one message ("no olives!!") is the fact that has to
// survive in the window until the end, or the bot never sees it.
export const messages = [
  { id: 'm1', text: "Hi! I'd like to order a pizza please 🍕" },
  { id: 'm2', text: "No olives!! I'm serious, I hate them.", critical: true },
  { id: 'm3', text: 'Can I get a large?' },
  { id: 'm4', text: 'Actually make it extra cheese' },
  { id: 'm5', text: 'Do you have a gluten-free base?' },
  { id: 'm6', text: 'Never mind, regular base is fine' },
  { id: 'm7', text: 'Also add mushrooms' },
  { id: 'm8', text: 'And can it be ready by 7?' },
]

export const WINDOW_SIZE = 6
