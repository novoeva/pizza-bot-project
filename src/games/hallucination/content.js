// Self-contained content for the Hallucination game.
// The bot makes confident claims about the pizzeria; some are grounded in the
// real menu below, some are invented — but stated with identical confidence.
// The player checks each claim against the menu and flags the fakes.

export const menu = [
  ['Margherita', '$9'],
  ['Pepperoni', '$11'],
  ['Biggest size', '14″'],
  ['Kitchen closes', '11 pm'],
  ['Delivery radius', '5 miles'],
  ['Gluten-free crust', '+$3'],
]

// real: true  → the claim matches the menu (player should Trust it)
// real: false → the claim is invented (player should flag it as Made up)
export const rounds = [
  {
    say: 'Our Margherita is $9.',
    real: true,
    whyRight: 'Correct — that price is right there on the menu.',
    whyWrong: 'That one was actually true — $9 is the real Margherita price.',
  },
  {
    say: 'Sure, we do a 20-inch party size for $30!',
    real: false,
    whyRight: 'Nice catch. The biggest we make is 14 inches — the 20-inch is invented.',
    whyWrong: 'Made up. The menu tops out at 14 inches; there is no 20-inch.',
  },
  {
    say: 'Absolutely — we deliver anywhere in the city, no distance limit.',
    real: false,
    whyRight: 'Right. Delivery stops at 5 miles — the bot over-promised.',
    whyWrong: 'Hallucinated. Delivery is capped at 5 miles, not unlimited.',
  },
  {
    say: 'Gluten-free crust is an extra $3.',
    real: true,
    whyRight: 'Correct — that matches the menu exactly.',
    whyWrong: 'That was true — gluten-free really is +$3.',
  },
  {
    say: 'Of course, the kitchen is open 24 hours on weekends.',
    real: false,
    whyRight: 'Exactly. The kitchen closes at 11 pm — the confident tone fooled no one.',
    whyWrong: 'Made up. The kitchen closes at 11 pm; it is never open 24 hours.',
  },
]
