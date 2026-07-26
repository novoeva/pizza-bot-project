// Self-contained content for this game only.
//
// The premise is flipped from an order form: the player is BUILDING the bot,
// not writing the order. The customer stays vague on purpose (that's what real
// customers do). What the player writes is the bot's instructions (the prompt),
// and that is what decides whether the bot invents an order or asks for what's
// missing. Same customer every round; only the bot's instructions change.
export const customerRequest = "Ugh, I'm starving. Just get me a pizza, something good."

// Round 1: every instruction is missing the one thing that matters: what to do
// when the order is incomplete, so any pick lands on the same disaster.
export const round1Options = [
  { label: '"You take pizza orders."' },
  { label: '"You take pizza orders. Be friendly and fast."' },
  { label: '"You take pizza orders. The customer is always right."' },
]

export const round1Result =
  "Your bot doesn't know anything's missing, so it fills every blank itself and commits. One large pineapple-anchovy pizza, extra jalapeños, fires off to the kitchen. The customer never asked for any of that."

// Round 2: add a single rule. Only one turns "invent" into "ask".
export const round2Options = [
  {
    label: '"Never leave a detail blank, pick whatever sounds tastiest."',
    correct: false,
    result:
      'Worse. Your bot confidently invents a mushroom-and-olive pizza and calls it done. You told it to fill blanks, so it did, with its own taste.',
  },
  {
    label: '"If size, crust, or toppings are missing, ask before ordering."',
    correct: true,
    result:
      'Now your bot pauses instead of guessing: "Happy to help! What size, and are you feeling any particular toppings?" Same starving, vague customer. Completely different bot.',
  },
  {
    label: '"Always default to a large, to be safe."',
    correct: false,
    result:
      'Your bot slaps together a large... something, without asking. Less chaotic, but the customer never got a say. A silent default is still a guess.',
  },
]

// Round 3: assemble the bot's full instructions. Each row has one right choice
// and two plausible-but-worse behaviors.
export const round3Categories = [
  {
    name: 'Role',
    options: ['Tony, the pizza shop’s assistant', 'A pizza expert who knows best', 'Whatever the customer wants'],
    correct: 'Tony, the pizza shop’s assistant',
  },
  {
    name: 'When info is missing',
    options: ['Ask one quick question at a time', 'Guess the most popular option', 'Demand everything up front'],
    correct: 'Ask one quick question at a time',
  },
  {
    name: 'When they truly don’t care',
    options: ['Suggest the house favorite', 'Pick something random to surprise them', 'Keep asking until they decide'],
    correct: 'Suggest the house favorite',
  },
  {
    name: 'Guardrail',
    options: ['Only order what’s on the menu', 'Add a free topping to be generous', 'Upsell a large every time'],
    correct: 'Only order what’s on the menu',
  },
]

export const round3Result =
  'Your bot: "Starving, got it. Want to keep it easy: medium pepperoni, thin crust? Or tell me what you’re craving." Customer: "yeah, perfect." Order’s in. Nobody had to write a perfect order. The bot carried the conversation.'

// One short line per option, so the result screen can explain every choice
// instead of just gating on it. Keyed by the option label.
export const round3Effects = {
  'Tony, the pizza shop’s assistant': 'has a clear job: order on the shop’s behalf',
  'A pizza expert who knows best': 'overrides the customer and decides for them',
  'Whatever the customer wants': 'agrees with anything, so it won’t catch a bad order',
  'Ask one quick question at a time': 'keeps it a friendly conversation',
  'Guess the most popular option': 'is just inventing all over again',
  'Demand everything up front': 'fires questions at the customer instead of chatting',
  'Suggest the house favorite': 'offers a way forward they can still decline',
  'Pick something random to surprise them': 'gambles with someone’s dinner',
  'Keep asking until they decide': 'traps a customer who already said they don’t mind',
  'Only order what’s on the menu': 'can’t invent food that doesn’t exist',
  'Add a free topping to be generous': 'changes the order without asking',
  'Upsell a large every time': 'serves the shop, not the customer',
}
