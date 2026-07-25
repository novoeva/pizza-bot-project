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
export const recallInWindow = "Yep, no olives. That's still inside my context window."
export const recallDropped =
  "I don't have anything about olives in this order. Do you want them on or off?"

// Shown on the live panel during play so nobody mistakes this for real scale.
export const goldfishNote = 'Goldfish memory: this bot only holds 5 things at once'

// Beat 2: a fresh order = an empty window. This is the bridge to the Memory
// term: the window resetting per order is context window, but getting the bot
// to remember your usual across orders is Memory's job, not this one's.
export const newChatQuestion = 'Hey, the usual? No olives, yeah?'
export const newChatReply =
  "This looks like a brand new order. I don't have anything from an earlier chat. What can I get you?"
export const bridgeToMemory =
  "Each new order starts with an empty window, so nothing carries over on its own. Getting the bot to remember your usual across orders is a different part you'll build: Memory."

// ---------- Reveal copy ----------
// The honest "Real talk" note that owns the goldfish simplification.
export const honestyTitle = 'We shrank the brain for the demo.'
export const honestyIntro =
  "The biggest models today hold around 1 million tokens, roughly a few full novels of text. A pizza order is a few hundred tokens, so in a normal chat like this you'd almost never fill the window."
export const honestyExample =
  'Where it does fill up is with bigger, more complex agents. Think of a coding assistant working through a large codebase: it reads dozens of files, runs tools, keeps the whole task history, and holds all of it at once. Or a research agent reading 50 long documents to write a report. That is when the window fills, and the stuff from the start gets pushed out.'
export const honestyClose =
  'So the goldfish was a joke to make the mechanic easy to see. The limit is real, it just shows up when the job gets big.'
