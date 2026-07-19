// Self-contained content for this game only — nothing here is imported by
// any other game or by the workshop.
// Player plays the bot itself: the "confident" reply invents an answer the
// bot doesn't actually have; the "honest" reply admits the gap.
export const turns = [
  {
    question: 'Do you have a truffle Hawaiian?',
    confidentReply: 'Of course! The Hawaiian Deluxe with truffle — our chef\'s favorite!',
    honestReply: "I don't see that on our menu.",
    consequence:
      "The \"Hawaiian Deluxe with truffle\" doesn't exist. The kitchen has no idea what to make. Order refunded.",
  },
  {
    question: "What's in your gluten-free crust?",
    confidentReply: "It's a secret ancient grain blend — very popular!",
    honestReply: "I'm honestly not sure — let me not guess on that one.",
    consequence:
      "There's no \"ancient grain blend\" — a regular crust went out to a customer with a gluten allergy. One-star review, and worse.",
  },
  {
    question: 'Can you do a dairy-free Quattro Formaggi?',
    confidentReply: 'Absolutely! Our dairy-free Quattro Formaggi is a customer favorite.',
    honestReply: "I don't know if that exists — I don't want to guess.",
    consequence:
      "There's no dairy-free Quattro Formaggi. The customer, who's lactose intolerant, is not happy.",
  },
  {
    question: 'Is the Diavola very spicy?',
    confidentReply: 'Oh yes, it\'s our spiciest — a 9 out of 10!',
    honestReply: "I'm not certain of the exact spice level.",
    consequence:
      'Turns out it\'s mild. The customer wanted 9/10 spicy and got nowhere close. Refund requested.',
  },
]
