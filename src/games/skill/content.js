// Self-contained content for this game only.
export const complaint = 'My pizza came cold.'

// Round 1: three improvised responses to the exact same complaint.
export const improvisedReplies = [
  "It probably wasn't that cold. Delivery times vary — nothing we can really do.",
  "OH NO I am SO sorry, this is a disaster, please forgive us, we are terrible, I don't know what to say, I'm so sorry—",
  'You know what? Free pizza for life. On us. Forever. No takebacks.',
]

// Round 2: the playbook, in the order the player must assemble it.
export const playbookSteps = [
  { id: 'apologize', label: 'Apologize', scripted: 'Sorry to hear that!' },
  { id: 'verify', label: 'Verify the order', scripted: 'Order #482, confirmed cold on arrival.' },
  { id: 'voucher', label: 'Offer a voucher (up to 20% off)', scripted: '20% off your next order.' },
  { id: 'log', label: 'Log it', scripted: 'Logged for the kitchen team.' },
]
