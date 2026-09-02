# Usability interview — feedback → feature requests

> Živý dokument. Sbírá feedback z customer/usability interviews a překládá ho do feature requestů.
> Stav: **rozpracováno** — Eva mě ještě provede zbytkem interview #1.

---

## Interview #1 — first-impression test

**Setup:** účastnice poprvé přistála na aplikaci (PizzaBlock), měla říct první dojem a zkusit si to projít. Je to nerodilá mluvčí angličtiny (čeština).

### Onboarding & srozumitelnost

**FR-1 — Landing page pro context setting (než uživatel spadne do „workshopu")** 🔴
Účastnice: *„Nejsem si jistá, co přesně mám udělat."* Teď se spadne rovnou do workshopu; chybí landing page, která nastaví kontext, o co ve hře jde.
→ Přidat landing page **před** workshopem. Konkrétní požadavky:
  - Vysvětlit, o co ve hře jde.
  - Obrázek **„pizza guy"** = majitel pizzerie, který si chce vyrobit agenta.
  - Vysvětlit narativ: *abychom takového agenta vyrobili, musíme nejdřív pochopit základní AI pojmy.*
  - CTA na konci ve smyslu **„pojď se učit se mnou"** → link do workshopu.
  - **Rámování:** je to *learning path*, kterým by prošel majitel pizzerie — postupně se musí naučit různé AI pojmy, aby si mohl postavit agenta.
→ **Reference (Evina Word Learning App / „Vocabulary"):** landing rychle vysvětlí benefit hry. Struktura k převzetí:
  - Velký headline s benefitem (např. *„Learn the words you'll actually use."*).
  - Krátký podtext „co to je".
  - Primární CTA („Get started").
  - Živý náhled/demo karty vedle textu.
  - Sekce **„WHY THIS ONE"** = 3 benefit karty (ikona + titulek + 1–2 věty).
  - Nahoře **přepínač jazyka Čeština / English** → viz **FR-6**.

**FR-2 — Není jasný learning objective u her**
Na konci nebylo jasné, co se vlastně měla naučit / jaká byla ta „skill".
→ U každé hry explicitně říct „co se tu naučíš".

### Vizuál & branding

**FR-3 — Přidat pizzu / vizuální identitu tématu**
Jmenuje se to PizzaBlock, ale žádná pizza na první obrazovce není — čekala ji a chyběla.
→ Tematická ilustrace pizzy na intro/landing.
→ *Podnápad:* „AI/umělá" pizza (odkapává něco umělého místo sýra) — hned signalizuje, že jde o AI, ne o skutečné jídlo.
→ Souvisí s **FR-1** (postava „pizza guy" = majitel na landing page).

**FR-4 — Působí to „hodně AI-generovaně" / málo dopilovaně**
Strohý, „vyprodukovaný" web. Je vidět práce, ale ne úroveň komerčního produktu (přirovnala k přihlášení do banky). Zaujalo ji to, ale polish chybí.
→ Zvýšit vizuální řemeslo/detail, aby to nepůsobilo jako generický AI web.

**FR-5 — Volitelný panáček / avatar**
Nápad: možnost si vybrat nebo customizovat postavičku.
→ Personalizace na začátku (možná součást onboardingu z FR-1).

### Jazyk

**FR-6 — Angličtina je největší bariéra** 🔴
*„Největší problém asi ta angličtina."* Pro českého mluvčího hlavní překážka; chtěla by pomalejší/srozumitelnější.
→ Zvážit českou lokalizaci nebo přepínač jazyka / zjednodušit texty.
→ **Reference:** Word Learning App už má přepínač **Čeština / English** vpravo nahoře — stejný vzor.

### Obsah & pedagogika

**FR-7 — Odborný žargon je moc (konkrétně „logit")**
Nerozuměla pojmu *logit*. Termíny jsou moc technické.
→ Vysvětlovat termíny lidsky, nebo je změkčit/vyhnout se jim.

**FR-8 — Ujištění „tohle je těžký pro všechny"**
Sama řekla, že je to náročné pro všechny a člověk neví, co říct. Uklidnění by snížilo zastrašení.
→ Přidat povzbudivou/ujišťující copy.

---

### Otevřené / k doplnění
- [ ] Zbytek interview #1 (Eva provede znovu)
- [ ] Ukázka Word Learning App jako reference pro onboarding (FR-1)
