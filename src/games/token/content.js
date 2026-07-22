// Self-contained content for this game only.
// "Dial it in": the bot is about to answer a real customer question. The
// temperature dial controls how it picks its next token — low temperature
// always grabs the top-probability token (same answer every time), high
// temperature is willing to gamble on a less-likely one (different answer
// every time, sometimes a weird one).

export const customerMessage = 'Is the Diavola spicy?'

// Five temperature settings, cold -> hot. Each one shows the probabilities
// the bot is choosing from for the same word position ("After 'Yes', what
// comes next?") and the full reply that results from that choice.
export const tempSteps = [
  {
    value: '0.0',
    label: 'Precise',
    tier: 'cold',
    desc: 'Always grabs the single most likely next token. Ask ten times, get the exact same reply ten times.',
    subtitle: 'After "Yes", what token is most likely?',
    tokens: [
      { word: '"—"', pct: 74 },
      { word: '","', pct: 14 },
      { word: '"!"', pct: 8 },
      { word: '"."', pct: 4 },
    ],
    reply: 'Yes — the Diavola is our spiciest pizza, made with spicy salami and chili oil.',
    tag: 'Same answer, every single time',
  },
  {
    value: '0.2',
    label: 'Precise',
    tier: 'cold',
    desc: 'Nearly always the top pick. There is a tiny bit of room to vary, but you will not notice it.',
    subtitle: 'After "Yes", what token is most likely?',
    tokens: [
      { word: '"—"', pct: 68 },
      { word: '","', pct: 18 },
      { word: '"!"', pct: 9 },
      { word: '"."', pct: 5 },
    ],
    reply: 'Yes — the Diavola is our spiciest pizza, made with spicy salami and chili oil.',
    tag: 'Basically the same every time',
  },
  {
    value: '0.5',
    label: 'Balanced',
    tier: 'warm',
    desc: 'Picks from a wider spread. Wording shifts run to run, but the answer stays correct and on-topic.',
    subtitle: 'After "Yes", what might follow?',
    tokens: [
      { word: '"—"', pct: 44 },
      { word: '", actually!"', pct: 28 },
      { word: '","', pct: 18 },
      { word: '"!"', pct: 10 },
    ],
    reply: 'Yes, actually! The Diavola brings a solid kick from spicy salami and chili oil.',
    tag: 'Sounds natural, still on-topic',
  },
  {
    value: '0.8',
    label: 'Creative',
    tier: 'warm',
    desc: 'The distribution is fairly flat now — several tokens are realistic picks. Tone and wording vary noticeably between runs.',
    subtitle: 'After "Yes", it could go a few ways',
    tokens: [
      { word: '"—"', pct: 30 },
      { word: '", for sure"', pct: 26 },
      { word: '"! It"', pct: 24 },
      { word: '", oh"', pct: 20 },
    ],
    reply: "Oh, it's got a real kick! Spicy salami and chili oil make sure of that.",
    tag: 'Different every time, still makes sense',
  },
  {
    value: '1.0+',
    label: 'Wild',
    tier: 'hot',
    desc: 'Nearly flat distribution — the bot picks almost randomly. Fun for creative writing, risky for anything that must stay on-message.',
    subtitle: 'After "Yes", almost anything could come next',
    tokens: [
      { word: '"Whew"', pct: 27 },
      { word: '"—"', pct: 25 },
      { word: '"Oh"', pct: 24 },
      { word: '"Honestly"', pct: 24 },
    ],
    reply:
      'Whew — hope you brought napkins! Chili oil, spicy salami, zero regrets... actually, have you considered the dessert calzone instead?',
    tag: 'Unpredictable — sometimes it wanders off-topic',
  },
]

// Round 2: apply the dial to two real messages the bot sends. Each has one
// correct bucket; the other two buckets each get their own funny/plausible
// consequence, so every pick has an immediate, specific outcome.
export const scenarios = [
  {
    id: 'confirmation',
    title: 'Order confirmation text',
    prompt:
      'This exact message goes out every time an order is placed. It has to state the right details, worded the same safe way, every single time.',
    correct: 'low',
    outcomes: {
      low: {
        verdict: 'good',
        text: '"Order confirmed: 1 large Pepperoni, delivery to Main St 42, ~25 min." Same, correct, every time.',
      },
      medium: {
        verdict: 'warn',
        text: '"Great news — your large Pepperoni is on its way to Main St 42!" Fine today. Tomorrow it might word the address differently, or quietly drop a detail.',
      },
      high: {
        verdict: 'bad',
        text: '"Your large Pepperoni pizza has begun its epic journey toward greatness (and possibly Main St 42, arrival time: soon, we believe)." Technically sent. Not what belongs on an order receipt.',
      },
    },
  },
  {
    id: 'caption',
    title: "Tonight's specials — Instagram caption",
    prompt:
      "A short, fun caption for tonight's special. It should feel fresh — a different vibe each night, not a copy-paste.",
    correct: 'high',
    outcomes: {
      low: {
        verdict: 'bad',
        text: '"Tonight\'s special is a large Pepperoni pizza. It is available for order." Technically true. Deeply boring — and it\'ll say the exact same thing tomorrow night too.',
      },
      medium: {
        verdict: 'warn',
        text: '"Don\'t miss tonight\'s Pepperoni special!" Fine. A little safe. Regulars will clock the pattern within a week.',
      },
      high: {
        verdict: 'good',
        text: '"Oven\'s blazing, Friday\'s calling, and tonight\'s Pepperoni is not messing around 🔥🍕" Different energy every night — exactly the point.',
      },
    },
  },
]
