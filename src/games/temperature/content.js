// Self-contained content for the Temperature game.
// It reuses the Token game's core picture, the model choosing the next word
// from a ranked list of candidates, and adds the one setting that reshapes
// that list: temperature.
//   1. "Slide it", drag the temperature from low to high and watch the same
//      candidate words go from "always the safe one" to "anything can win".
//   2. "Pick the setting", match a real bot job to the right temperature.

// ---- Beat 1: the slider playground ----
// The blank the bot is about to fill in.
export const sliderContext = "Tonight's special is the"

// Candidate next words with their base probability at temperature 1.0
// (they sum to 1). Ordered safe -> wild so the bars keep a stable order while
// the slider reshapes their heights.
export const candidates = [
  { word: 'classic', base: 0.4 },
  { word: 'pepperoni', base: 0.27 },
  { word: 'four-cheese', base: 0.15 },
  { word: 'spicy honey', base: 0.1 },
  { word: 'dill pickle', base: 0.05 },
  { word: 'marshmallow', base: 0.03 },
]

// Slider range for the temperature dial, and the zones we label it with.
export const TEMP_MIN = 0.2
export const TEMP_MAX = 2.0

export const zones = [
  {
    id: 'low',
    max: 0.6,
    label: 'Predictable',
    note: 'Low temperature: the bot plays it safe. It picks the most likely word almost every time, so it says nearly the same thing on every roll.',
  },
  {
    id: 'balanced',
    max: 1.2,
    label: 'Balanced',
    note: 'Middle temperature: mostly sensible, with a bit of room to surprise you. This is where most everyday assistants sit.',
  },
  {
    id: 'wild',
    max: Infinity,
    label: 'Wild',
    note: 'High temperature: the long-shot words get a real chance to win. Great for fresh ideas, but the output changes every time, so whenever you turn it up, cross-check what comes back before you trust it.',
  },
]

// ---- Beat 2: pick the setting ----
// One clear right answer per round: low when the output must be identical,
// high when you actually want variety. Alternating so the pattern is felt,
// not memorised, and each `why` reinforces the concept from a new angle.
export const taskRounds = [
  {
    task: 'Print the allergy disclaimer at the bottom of every receipt.',
    detail: 'It has to read exactly the same, word for word, every single time. A creative rewrite here is a lawsuit.',
    answer: 'low',
    why: 'When the wording has to be identical every time, you turn the temperature down. The bot then reaches for the safest, most likely word.',
  },
  {
    task: "Brainstorm 12 fun names for this week's mystery pizza.",
    detail: 'You want variety and a few surprises, not the same three safe names on every try.',
    answer: 'high',
    why: 'When you want fresh, varied ideas, you turn the temperature up. Less likely, more surprising words then get a real chance to win.',
  },
  {
    task: 'Read the order back and the total before charging the card.',
    detail: 'The bot must repeat the exact items and the exact price. "That\'s about twenty-something dollars" is not an option.',
    answer: 'low',
    why: 'Anything with money or a hard fact in it needs the same exact wording every time. Keep the temperature low and let the safe answer win.',
  },
  {
    task: "Write three different captions for today's special on social.",
    detail: 'You want three genuinely different takes to choose from, not the same sentence reworded three times.',
    answer: 'high',
    why: 'You want real options to choose from here. A higher temperature gives you that, instead of three versions of the same line.',
  },
  {
    task: 'Tell a customer what time the shop closes tonight.',
    detail: 'There is exactly one correct answer, and it had better be the same one every single time someone asks.',
    answer: 'low',
    why: 'A question with one right answer should never wander. Turn the temperature down and the same answer comes out every time.',
  },
  {
    task: "Dream up wild topping combos for this month's mystery pizza.",
    detail: 'Half the fun is the unexpected pairing. Safe and obvious defeats the whole point.',
    answer: 'high',
    why: 'Surprise is the whole goal here. Turn the temperature up and the unlikely, unexpected ideas get a chance to be picked.',
  },
]
