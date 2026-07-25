// Self-contained content for this game only.
export const sessionOneLines = [
  { speaker: 'customer', text: 'Hi! Can I get a large pepperoni with extra cheese?' },
  {
    speaker: 'bot',
    text: 'You got it! One large pepperoni, extra cheese. Anything else?',
  },
  { speaker: 'customer', text: "That's it. Oh, and no anchovies, please, I'm allergic." },
  {
    speaker: 'bot',
    text: "Noted, no anchovies. So that's a large pepperoni, extra cheese, hold the anchovies. Back in 20!",
  },
  { speaker: 'customer', text: 'Perfect, thanks!' },
]

export const resetLines = [
  { speaker: 'customer', text: 'Hi! The usual, please.' },
  { speaker: 'bot', text: 'Welcome, stranger! What\'s a "usual"?' },
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
