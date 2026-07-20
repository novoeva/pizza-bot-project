// Self-contained content for this game only.
export const sessionOneLines = [
  { speaker: 'customer', text: 'Hi! Same as always please — the usual.' },
  {
    speaker: 'bot',
    text: 'You got it! One large pepperoni, extra cheese — and no anchovies, right? I remember you\'re allergic.',
  },
  { speaker: 'customer', text: "Ha, yes exactly. You're the best." },
]

export const resetLines = [
  { speaker: 'customer', text: 'Hi! The usual, please.' },
  { speaker: 'bot', text: "Welcome, stranger! What's a \"usual\"?" },
  { speaker: 'customer', text: "...it's me. Anna. I order every week." },
  { speaker: 'bot', text: 'I have no memory of any Anna. What would you like today?' },
]

export const facts = [
  { id: 'order', label: 'Usual order (large pepperoni, extra cheese)' },
  { id: 'address', label: 'Delivery address (12 Oak Street)' },
  { id: 'allergy', label: 'Allergy: anchovies' },
  { id: 'joke', label: 'Favorite joke (a pizza pun)' },
  { id: 'birthday', label: 'Birthday (March 3rd)' },
]

export const FACTS_TO_SAVE = 3
