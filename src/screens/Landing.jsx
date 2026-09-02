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

/**
 * The front door. Users used to drop straight into the Workshop with no idea
 * what they were looking at; this page sets the premise first:
 *
 *   You run a pizzeria. You want a bot that takes customers' pizza orders
 *   straight from a chat (like WhatsApp). To set it up properly you first have
 *   to understand how it works — so you learn the 11 AI terms one at a time,
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

const COPY = {
  en: {
    nav: 'Pizza Bot',
    eyebrow: "For pizzeria owners who don't know AI (yet)",
    title: ['Build your own pizza agent', 'and learn AI at the same time.'],
    sub: 'You run a pizzeria and you want a bot that takes pizza orders straight from a chat — like a WhatsApp message. To set one up, you first learn how it works: 11 AI terms, one small game each. As you go, a robot — your bot — gets built on screen.',
    cta: 'Learn with me',
    ctaNote: '11 terms · one game each · no maths',
    buddy: "Meet your bot — you'll build me",
    howTitle: 'How it works',
    howSub: "You learn beside an owner who doesn't know AI either. No experience needed.",
    steps: [
      {
        label: 'Your role',
        title: "You're the owner",
        text: "You want a bot for your pizzeria. You've never done AI — that's fine.",
      },
      {
        label: 'The lessons',
        title: '11 terms, 11 scenarios',
        text: 'Each term is a small game set in your shop.',
      },
      {
        label: 'On screen',
        title: 'Build the bot',
        text: 'Every term adds a part to the robot you see.',
      },
    ],
    whyTitle: 'Why this one',
    whySub: 'These concepts are hard for everyone. Here they finally click.',
    cards: [
      {
        icon: 'local_pizza',
        title: 'One idea at a time',
        text: 'Each term is its own small game. Play one, get it, move on. Nothing piles up.',
      },
      {
        icon: 'science',
        title: 'Learn it, then try it',
        text: 'First the plain-words definition, then you use it in a real pizzeria scenario. That is what makes it stick.',
      },
      {
        icon: 'sentiment_very_satisfied',
        title: 'No maths, no code',
        text: "You're the owner, not a programmer. Just play — no setup, no equations.",
      },
    ],
    footer: 'Learn AI the pizza way',
  },
  cs: {
    nav: 'Pizza Bot',
    eyebrow: 'Pro majitele pizzerie, co ještě neznají AI',
    title: ['Postav si vlastního pizza agenta', 'a nauč se u toho AI.'],
    sub: 'Vedeš pizzerii a chceš bota, který bere objednávky na pizzu rovnou z chatu — třeba jako zpráva na WhatsAppu. Než ho nastavíš, nejdřív pochopíš, jak funguje: 11 pojmů z AI, ke každému jedna malá hra. Jak postupuješ, na obrazovce se staví robot — tvůj bot.',
    cta: 'Pojď se mnou učit',
    ctaNote: '11 pojmů · ke každému hra · žádná matematika',
    buddy: 'Tohle je tvůj bot — mě postavíš',
    howTitle: 'Jak to funguje',
    howSub: 'Učíš se po boku majitele, který AI taky neumí. Nic neumět je v pohodě.',
    steps: [
      {
        label: 'Tvoje role',
        title: 'Jsi majitel',
        text: 'Chceš bota do pizzerie. AI jsi nikdy nedělal — to nevadí.',
      },
      {
        label: 'Lekce',
        title: '11 pojmů, 11 scénářů',
        text: 'Každý pojem je malá hra ze tvé pizzerie.',
      },
      {
        label: 'Na obrazovce',
        title: 'Postav bota',
        text: 'Každý pojem přidá díl robotovi, kterého vidíš.',
      },
    ],
    whyTitle: 'Proč právě tohle',
    whySub: 'Tyhle pojmy jsou těžké pro každého. Tady ti konečně zapadnou.',
    cards: [
      {
        icon: 'local_pizza',
        title: 'Jeden pojem po druhém',
        text: 'Každý pojem je malá hra. Zahraješ si, pochopíš, jdeš dál. Nic se nehromadí.',
      },
      {
        icon: 'science',
        title: 'Nauč se ho a hned vyzkoušej',
        text: 'Nejdřív definice srozumitelně, pak ho použiješ v reálné situaci z pizzerie. Díky tomu ti zůstane.',
      },
      {
        icon: 'sentiment_very_satisfied',
        title: 'Žádná matematika, žádný kód',
        text: 'Jsi majitel, ne programátor. Prostě si hraješ — žádné nastavování, žádné rovnice.',
      },
    ],
    footer: 'Uč se AI vařením pizzy',
  },
}

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
            <Link
              to="/workshop"
              className="press inline-flex items-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-5 py-3 font-label text-sm text-white shadow-pop"
            >
              <span className="material-symbols-rounded" aria-hidden="true">
                rocket_launch
              </span>
              {t.cta}
            </Link>
            <p className="font-label text-[10px] text-text-dim">{t.ctaNote}</p>
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
                    <span className="font-label text-[10px] text-tertiary">{s.label}</span>
                    <h3 className="text-lg leading-tight md:text-xl">{s.title}</h3>
                    <p className="max-w-[38ch] text-sm leading-relaxed text-text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why this one */}
        <section className="border-t-[3px] border-neutral bg-muted/50">
          <div className="mx-auto w-full max-w-desktop px-4 py-12 lg:px-8 lg:py-16">
            <div className="mb-8 flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl">{t.whyTitle}</h2>
              <p className="max-w-[52ch] text-sm text-text-muted md:text-base">{t.whySub}</p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {t.cards.map((c) => (
                <article
                  key={c.title}
                  className="press flex flex-col gap-3 rounded-lg border-[3px] border-neutral bg-surface p-5 shadow-card"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-neutral bg-primary text-white">
                    <span className="material-symbols-rounded" aria-hidden="true">
                      {c.icon}
                    </span>
                  </span>
                  <h3 className="text-lg">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-text-muted">{c.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                to="/workshop"
                className="press inline-flex items-center gap-2 rounded-md border-[3px] border-neutral bg-primary px-5 py-3 font-label text-sm text-white shadow-pop"
              >
                {t.cta}
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </div>
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
