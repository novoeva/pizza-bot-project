import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import pizzaGuy from '../assets/pizza-guy.jpg'
import ownerThinking from '../assets/owner-thinking-cutout.png'
import BottomNav from '../components/BottomNav.jsx'
import BotCanvas from '../components/BotCanvas.jsx'
import terms from '../content/terms.json'

// Static, derived once: the term names (step-2 chips) and the full id list that
// drives a fully-assembled BotCanvas for the step-3 illustration.
const TERM_NAMES = [...terms].sort((a, b) => a.order - b.order).map((term) => term.name)
const ALL_TERM_IDS = terms.map((term) => term.id)
// The number of terms is never typed into copy: it is read from terms.json so
// the landing page always promises exactly what the Workshop delivers.
const TERM_COUNT = terms.length
// Czech counts 2-4 differently from 5+: '2 pojmy' vs '12 pojmů'.
const csPlural = (n, few, many) => (n >= 2 && n <= 4 ? few : many)

/**
 * The front door. Users used to drop straight into the Workshop with no idea
 * what they were looking at; this page sets the premise first:
 *
 *   You run a pizzeria. You want a bot that takes customers' pizza orders
 *   straight from a chat (like WhatsApp). To set it up properly you first have
 *   to understand how it works — so you learn the AI terms one at a time,
 *   each a small game/scenario, and each one adds a part to the robot on
 *   screen (your bot, visualized).
 *
 * Honesty note: the app teaches the concepts and assembles a *robot mascot* as
 * you go — it does NOT ship a working order-taking bot. Copy must not claim you
 * walk away with a real working bot.
 *
 * Design ported from the Lovable draft (its cartoon and layout), mapped onto
 * this app's design tokens and react-router. The single CTA drops the (now
 * oriented) user into the Workshop.
 *
 * i18n: the app has no i18n framework, so copy lives here as a small CS/EN
 * dictionary and a local toggle swaps between them. The choice is remembered in
 * localStorage but scoped to this page — the rest of the app is English-only.
 */

const LANG_KEY = 'pb-lang'

const copyFor = (n) => ({
  en: {
    nav: 'Pizza Bot',
    eyebrow: "For pizzeria owners who don't know AI (yet)",
    title: ['Build your own pizza agent', 'and learn AI at the same time.'],
    // 1.3 (Nina): say why you learn the terms, and whether you must. Short
    // sentences, one idea each.
    sub: `You run a pizzeria. You want a bot that takes pizza orders in chat, like on WhatsApp. For the bot to work, you should learn ${n} AI terms. Each term is a small scenario-based game. Each game adds a part of your bot to the screen.`,
    cta: 'Play the game',
    ctaNote: `${n} terms · one game each`,
    buddy: "Meet your bot. You'll build me.",
    howTitle: 'How it works',
    howSub: "You learn beside an owner who doesn't know AI either. No experience needed.",
    steps: [
      {
        title: "You're the owner",
        text: "You want a bot for your pizzeria. You've never done AI, and that's fine.",
      },
      {
        title: `${n} terms, ${n} scenarios`,
        text: 'Each term is a small game set in your shop.',
      },
      {
        title: 'Build the bot',
        text: 'Every term adds a part to the robot you see.',
      },
    ],
    footer: 'Learn AI the pizza way',
  },
  cs: {
    nav: 'Pizza Bot',
    eyebrow: 'Pro majitele pizzerie, co ještě neznají AI',
    title: ['Postav si vlastního pizza agenta', 'a nauč se u toho AI.'],
    sub: `Vedeš pizzerii. Chceš bota, který bere objednávky na pizzu v chatu, třeba na WhatsAppu. Aby bot fungoval, je potřeba se naučit ${n} ${csPlural(n, 'pojmy', 'pojmů')} z AI. Každý pojem je malá hra se scénářem. Každá hra přidá na obrazovku jeden díl tvého bota.`,
    cta: 'Zahraj si hru',
    ctaNote: `${n} ${csPlural(n, 'pojmy', 'pojmů')} · ke každému hra`,
    buddy: 'Tohle je tvůj bot. Mě postavíš.',
    howTitle: 'Jak to funguje',
    howSub: 'Učíš se po boku majitele, který AI taky neumí. Nic neumět je v pohodě.',
    steps: [
      {
        title: 'Jsi majitel',
        text: 'Chceš bota do pizzerie. AI jsi nikdy nedělal, a to nevadí.',
      },
      {
        title: `${n} ${csPlural(n, 'pojmy', 'pojmů')}, ${n} ${csPlural(n, 'scénáře', 'scénářů')}`,
        text: 'Každý pojem je malá hra ze tvé pizzerie.',
      },
      {
        title: 'Postav bota',
        text: 'Každý pojem přidá díl robotovi, kterého vidíš.',
      },
    ],
    footer: 'Uč se AI vařením pizzy',
  },
})

const COPY = copyFor(TERM_COUNT)

function readLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'cs' || saved === 'en') return saved
  } catch {
    /* private mode / storage blocked — fall through to default */
  }
  return 'en'
}

export default function Landing() {
  const [lang, setLang] = useState(readLang)
  const t = COPY[lang]

  const changeLang = useCallback((code) => {
    setLang(code)
    try {
      localStorage.setItem(LANG_KEY, code)
    } catch {
      /* storage blocked — the toggle still works for this session */
    }
  }, [])

  return (
    // The app shell locks the window (body overflow: hidden) and normally only
    // #app-scroll scrolls. The landing sits outside <Layout>, so it owns its own
    // scroll here. pb clears the fixed bottom nav.
    <div
      lang={lang}
      className="h-full overflow-y-auto overscroll-y-contain bg-bg pb-28 text-text"
    >
      {/* Top bar: brand + language toggle */}
      <header className="sticky top-0 z-20 w-full border-b-[3px] border-neutral bg-bg">
        <div className="mx-auto flex w-full max-w-desktop items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <span className="flex items-center gap-2 font-display text-2xl font-extrabold text-primary">
            <span className="material-symbols-rounded fill" aria-hidden="true">
              local_pizza
            </span>
            {t.nav}
          </span>
          <div
            className="flex items-center overflow-hidden rounded-full border-[3px] border-neutral bg-surface"
            role="group"
            aria-label="Language / Jazyk"
          >
            {['cs', 'en'].map((code) => {
              const active = lang === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeLang(code)}
                  aria-pressed={active}
                  className={
                    'px-3 py-1 font-label text-[11px] transition-colors ' +
                    (active ? 'bg-primary text-white' : 'text-text-muted hover:bg-muted')
                  }
                >
                  {code === 'cs' ? 'Čeština' : 'English'}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-desktop grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
          <div className="flex flex-col items-start gap-5">
            <span className="rounded-full border-2 border-neutral bg-accent-soft px-3 py-1 font-label text-[10px] text-text">
              {t.eyebrow}
            </span>
            <h1 className="text-3xl leading-[1.05] md:text-5xl lg:text-6xl">
              {t.title[0]}
              <span className="block text-primary">{t.title[1]}</span>
            </h1>
            <p className="max-w-[52ch] text-base leading-relaxed text-text-muted md:text-lg">
              {t.sub}
            </p>
            {/* 1.1 (Nina): the page read as a presentation, not a game; she
                scrolled instead of clicking. So the CTA is a start button:
                big, full-width on phones, a play icon, and it says "Play". */}
            <div className="flex w-full flex-col items-start gap-2 sm:w-auto">
              <Link
                to="/workshop"
                className="press inline-flex w-full items-center justify-center gap-3 rounded-lg border-[3px] border-neutral bg-primary px-8 py-4 font-label text-lg text-white shadow-card sm:w-auto"
              >
                <span className="material-symbols-rounded fill text-3xl" aria-hidden="true">
                  play_arrow
                </span>
                {t.cta}
              </Link>
              <p className="font-label text-[10px] text-text-dim">{t.ctaNote}</p>
            </div>
          </div>

          {/* the pizza guy cartoon */}
          <div className="relative">
            <div
              className="absolute inset-0 -rotate-2 rounded-lg border-[3px] border-neutral bg-accent-soft"
              aria-hidden="true"
            />
            <div
              className="relative overflow-hidden rounded-lg border-[3px] border-neutral bg-muted shadow-card"
              style={{
                backgroundImage: 'radial-gradient(var(--color-pegboard-dot) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <img
                src={pizzaGuy}
                width={1024}
                height={1024}
                alt="Pizzeria owner holding a pizza peel, standing next to his pizza-shaped robot"
                className="h-auto w-full mix-blend-multiply"
              />
            </div>
            <div className="absolute -bottom-4 left-4 -rotate-3 rounded-md border-[3px] border-neutral bg-surface px-3 py-1.5 font-label text-[10px] shadow-pop">
              {t.buddy}
            </div>
          </div>
        </section>

        {/* How it works — the scenario, painted with illustrations: the owner
            wondering how to build a bot, the pile of terms he has to learn, and
            the robot those terms assemble into. */}
        <section className="border-t-[3px] border-neutral bg-surface">
          <div className="mx-auto w-full max-w-desktop px-4 py-12 lg:px-8 lg:py-16">
            <div className="mb-10 flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl">{t.howTitle}</h2>
              <p className="max-w-[60ch] text-sm text-text-muted md:text-base">{t.howSub}</p>
            </div>
            <ol className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
              {t.steps.map((s, i) => (
                <li key={s.title} className="flex flex-col items-center gap-4 text-center">
                  {/* the visual for this step */}
                  <div className="flex h-52 w-full items-center justify-center">
                    {i === 0 && (
                      <img
                        src={ownerThinking}
                        alt="Luigi the pizzeria owner wondering how to build a bot"
                        loading="lazy"
                        className="h-full w-auto max-w-full object-contain"
                      />
                    )}
                    {i === 1 && (
                      <div className="flex max-w-[24rem] flex-wrap items-center justify-center gap-2">
                        {TERM_NAMES.map((term, ti) => (
                          <span
                            key={term}
                            style={{ boxShadow: '2px 2px 0 0 var(--color-neutral)' }}
                            className={
                              'rounded-full border-2 border-neutral px-3 py-1 font-label text-xs ' +
                              (ti % 3 === 0
                                ? 'bg-primary text-white '
                                : ti % 3 === 1
                                  ? 'bg-surface text-text '
                                  : 'bg-accent-soft text-text ') +
                              (ti % 2 === 0 ? '-rotate-2' : 'rotate-2')
                            }
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    )}
                    {i === 2 && (
                      // The same robot the app assembles in the Workshop, drawn
                      // fully built — reuses BotCanvas (SVG) instead of a heavy
                      // raster, so it always matches the in-app bot.
                      <BotCanvas
                        completedTerms={ALL_TERM_IDS}
                        sizeClassName="mx-auto block h-full w-auto"
                      />
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-neutral bg-primary font-display text-sm font-extrabold text-white shadow-pop">
                      {i + 1}
                    </span>
                    {/* 1.5 (Nina/Eva): the tiny eyebrow labels ("Your role",
                        "The lessons", "On screen") meant nothing to her; the
                        numbered titles carry the step on their own. */}
                    <h3 className="text-lg leading-tight md:text-xl">{s.title}</h3>
                    <p className="max-w-[38ch] text-sm leading-relaxed text-text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Bottom of the page: one more "Play the game", nothing else. The
            three "Why this one" cards were cut after Nina's interview (1.6):
            the simpler the page, the better; keep only what has a function. */}
        <section className="border-t-[3px] border-neutral bg-muted/50">
          <div className="mx-auto flex w-full max-w-desktop justify-center px-4 py-12 lg:px-8 lg:py-16">
            <Link
              to="/workshop"
              className="press inline-flex w-full items-center justify-center gap-3 rounded-lg border-[3px] border-neutral bg-primary px-8 py-4 font-label text-lg text-white shadow-card sm:w-auto"
            >
              <span className="material-symbols-rounded fill text-3xl" aria-hidden="true">
                play_arrow
              </span>
              {t.cta}
            </Link>
          </div>
        </section>

        <footer className="border-t-[3px] border-neutral bg-bg px-4 py-6 text-center font-label text-[10px] text-text-muted">
          Pizza Bot · {t.footer}
        </footer>
      </main>

      {/* The bottom menu, pinned to the viewport. */}
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <BottomNav active="home" />
      </div>
    </div>
  )
}
