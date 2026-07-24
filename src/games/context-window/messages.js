// Self-contained content for the Context window game.
// The bot can only "see" what's inside its context window right now. Beat 1
// fills the window past capacity so the earliest line (a "no olives!!" that
// really matters) scrolls out of view and the bot can no longer recall it.
// Beat 2 opens a brand-new order to show each conversation starts empty.

export const WINDOW_SIZE = 5

// Sent oldest-first. The critical line is first, so it's first to scroll out.
export const order = [
  { id: 'm1', text: 'No olives!! I really hate them.', critical: true },
  { id: 'm2', text: 'One large pizza, please.' },
  { id: 'm3', text: 'Extra cheese on that.' },
  { id: 'm4', text: 'Add mushrooms too.' },
  { id: 'm5', text: 'Make the crust thin.' },
  { id: 'm6', text: 'Can it be ready by 7?' },
  { id: 'm7', text: 'Deliver to 12 Oak Street.' },
]

export const recallQuestion = 'No olives, right?'
export const recallInWindow = "Yep, no olives. It's still right here in our chat."
export const recallDropped =
  "I don't see anything about olives in our conversation. It scrolled out of my window a few messages ago."

// Beat 2: a fresh order = an empty window.
export const newChatQuestion = 'Hey, the usual? No olives, yeah?'
export const newChatReply =
  "This looks like a brand new order. I don't have anything from an earlier chat. What can I get you?"
