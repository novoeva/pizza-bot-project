// Self-contained content for the MCP game only.
//
// Role frame: you're the OWNER, and you have one bot. It needs to reach the
// systems your pizzeria runs on. The old way, each one is a custom
// integration you build by hand, five fiddly steps a piece, and maintain
// forever. You DO those steps (PIZZA-23): pick the format, map the field
// names, copy the access key, run a test, fix what broke. Twice, in full.
// Then MCP: one shared standard every system speaks, so the same systems
// connect in one tap each, and a tool a stranger built connects too.

export const BOT = { name: 'Pizza Bot', icon: 'smart_toy' }

// The data formats you can pick from in step 1. Each system sends exactly one.
export const FORMATS = ['CSV file', 'XML', 'JSON', 'Spreadsheet']

// The systems your pizzeria already runs on, that your bot needs to reach.
// `fields` are in the order the wizard asks for them ("your bot's `name` is
// Menu's..."); `theirs` are the names the system uses, guessable but not
// obvious, so the mapping is real work. `keys` holds the right key plus two
// look-alikes, the way a real access key gets mistyped.
export const NEEDED = [
  {
    id: 'menu',
    name: 'Menu',
    icon: 'menu_book',
    desc: "today's pizzas and prices",
    format: 'XML',
    key: 'MN-7Q2-K',
    keys: ['MN-7O2-K', 'MN-7Q2-K', 'NM-7Q2-K'],
    fields: [
      { ours: 'name', theirs: 'itm_nm', hint: 'the item name' },
      { ours: 'price', theirs: 'prc_czk', hint: 'the price in CZK' },
      { ours: 'in stock', theirs: 'avail_flg', hint: 'the available flag' },
    ],
    testFail: 'Menu sent the price as the text "129 Kč". Your bot expects a number.',
    fixes: [
      { label: 'Strip the "Kč" and turn it into a number', ok: true },
      { label: 'Ask Menu to change their format', why: "They won't. It's their system, not yours." },
      { label: 'Ignore it', why: 'Your bot would quote every pizza at 0 Kč.' },
    ],
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: 'local_shipping',
    desc: 'dispatch a driver',
    format: 'JSON',
    key: 'DL-4K9-Z',
    keys: ['DL-4K9-Z', 'DL-4K9-2', 'DL-4KG-Z'],
    fields: [
      { ours: 'driver', theirs: 'drv_id', hint: 'the driver' },
      { ours: 'arrival time', theirs: 'eta_min', hint: 'the arrival time in minutes' },
      { ours: 'address', theirs: 'addr_ln1', hint: 'the address line' },
    ],
    testFail: 'Delivery sent the arrival time as "25-30". Your bot expects one number.',
    fixes: [
      { label: 'Promise the customer 25', why: 'Half the drivers arrive late. Angry customers.' },
      { label: 'Take the larger number, 30, so the promise is safe', ok: true },
      { label: 'Ask Delivery to change their format', why: "They won't. It's their system, not yours." },
    ],
  },
  {
    id: 'bookings',
    name: 'Bookings',
    icon: 'event_seat',
    desc: 'table reservations',
    format: 'CSV file',
    key: 'BK-2R8-M',
    keys: ['BK-2R8-M', 'BK-2RB-M', 'BK-2R8-N'],
    fields: [
      { ours: 'table', theirs: 'tbl_no', hint: 'the table number' },
      { ours: 'time', theirs: 'slot_ts', hint: 'the time slot' },
      { ours: 'guests', theirs: 'pax', hint: 'the number of guests' },
    ],
    testFail: 'Bookings sent the time as "19h". Your bot expects a clock time.',
    fixes: [{ label: 'Turn "19h" into 19:00', ok: true }],
  },
]

// The extra tool you decide you want partway through, still the old, custom way.
export const EXTRA = { id: 'loyalty', name: 'Loyalty app', icon: 'loyalty', desc: 'points and rewards' }

// The brand-new tool a stranger built last month, that already speaks MCP.
export const STRANGER = {
  id: 'stock',
  name: 'Stock tracker',
  icon: 'inventory_2',
  desc: 'live ingredient levels, built by another company',
}

// The five manual steps every custom integration takes, in order. The wizard
// walks step 1 to 5 for Menu and Delivery in full; Bookings is one tap that
// stands for all five, once you have felt them twice.
export const STEPS = ['Data format', 'Field names', 'Access key', 'Test', 'Fix']

// How long each hand-built integration costs, so the friction is a real number
// that keeps climbing as you connect more systems.
export const WEEKS_PER_CONNECTOR = 3
