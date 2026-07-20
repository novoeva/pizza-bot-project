// Self-contained content for this game only.
export const tools = [
  { id: 'delivery', label: '📍 Delivery tracker' },
  { id: 'oven', label: '🔥 Oven queue' },
  { id: 'stock', label: '📦 Stock list' },
]

export const questions = [
  {
    question: 'When does my pizza arrive?',
    guessAnswer: 'Guessing... probably around 6:45pm?',
    correctTool: 'delivery',
    realAnswer: '7:10pm — 3 minutes away, delayed by traffic.',
  },
  {
    question: 'Is the oven backed up?',
    guessAnswer: 'Guessing... nah, should be fine!',
    correctTool: 'oven',
    realAnswer: 'Yes — 6 pizzas ahead of yours, about an 18 minute wait.',
  },
  {
    question: 'Do you still have gluten-free bases?',
    guessAnswer: 'Guessing... yeah, we usually do!',
    correctTool: 'stock',
    realAnswer: 'Out of stock since this morning — 0 left.',
  },
]
