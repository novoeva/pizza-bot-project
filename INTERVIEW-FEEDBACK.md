# Usability interview — feedback → feature requests

> Feedback z customer/usability interviews přeložený do feature requestů.
> **Interview #1: uzavřeno.** Každý FR je psaný tak, aby ho zvládl vzít a udělat kterýkoliv chat/agent bez znalosti téhle konverzace.

## Jak číst FR
- 🔴 = vysoká priorita · 🔁 = systémové (objevilo se ve víc hrách / týká se víc míst)
- **📍 Kde** = kotva v kódu (soubor[:řádek]) nebo obrazovka
- **✅ Hotovo když** = akceptační kritérium, podle kterého se pozná dokončení
- Cesty jsou relativní k repu `pizza-bot/`. Řádky jsou orientační (kód se posouvá) — hledej podle názvu.

## Zdroje pravdy v kódu (orientace)
- Router / vstup appky: `src/App.jsx` (`/` → `Workshop`, `/game/:termId` → `GameScreen`)
- Sdílený úvod hry (levý panel = orientace): `src/components/GameIntro.jsx`
- Texty her (definice, role, atd.): `src/content/terms.json`
- Layout hry (2 sloupce): `src/components/GameStage.jsx`; akční tlačítka: `src/components/GameActions.jsx`
- Barevné tokeny: `src/theme/tokens.css` (CSS proměnné) + `tailwind.config.js` (mapování na `bg-*`)
- Jednotlivé hry: `src/games/<term>/index.jsx` (12 her)

---

## 🗺️ Priorizovaný souhrn / roadmapa

Interview #1 dalo 18 FR. Nejsilnější vzorec: **tři systémové nedostatky = přesně tři kroky rámce her** (definice / simulace / shrnutí). Pár sdílených komponentů posbírá většinu hodnoty napříč celou hrou.

> ### 🎨 Design-system workstream — řeší se v samostatném chatu
> Tolik requestů spadá do design systému, že se řeší jako **oddělený balík v jiném chatu bez tohoto kontextu** (čistší audit). Prompt: [`design-system-audit.md`](./design-system-audit.md). Výstup (`COMPONENT-AUDIT.md`) se vrátí sem a napojí se na tyto FR.
> **Patří sem:** **FR-18** (audit) · **FR-17** (barevný jazyk) · **FR-10/16** (SelectableCard) · **FR-13** (TermReveal) · **FR-9** (definice panel) · **FR-11** (zelená na špatných volbách).
> **Zbytek roadmapy (mimo design systém) běží nezávisle zde:** FR-1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 15.

**Vlna 0 — rychlé výhry (malé, dají se pustit hned, paralelně)**
| FR | Co | Odhad |
|----|----|-------|
| FR-7 | Přejmenovat label „Log it" (čte se jako „logit") | triviální |
| FR-11 | Špatné volby na Prompt výsledkovce nedávat zeleně | malé |
| FR-12 | Jasně říct, že postup není blokovaný | malé |
| FR-2 | Přidat „co se tu naučíš" do úvodu her | malé |
| FR-14/15 | Temperature: highlightovat hozené slovo, navést experiment | malé–střední |

**Vlna 1 — základ design systému (odemyká zbytek)**
| FR | Co | Odhad |
|----|----|-------|
| FR-18 | Audit komponent *(běží v samostatném chatu)* | střední–velké |
| FR-17 | Kodifikovat barevný jazyk (zelená přetížená) | střední |
| FR-10/16 | Jeden sdílený `SelectableCard` (klikatelnost) | střední |
| FR-13 | Jeden sdílený `TermReveal` (checklist místo zdi textu) | střední |
| FR-9 | Sdílený „definice" panel před hrou | střední |

**Vlna 2 — první dojem**
| FR | Co | Odhad |
|----|----|-------|
| FR-1 | Landing page (context setting) | střední–velké |
| FR-3 | Pizza ilustrace / „pizza guy" | malé–střední |
| FR-5 | Volitelný avatar *(nice-to-have)* | střední |

**Vlna 3 — větší sázky**
| FR | Co | Odhad |
|----|----|-------|
| FR-6 | Lokalizace / i18n (CS/EN) | velké |
| FR-4 | Vizuální polish (proti „AI-generovanému" dojmu) | velké / průběžné |

> **Doporučené pořadí:** Vlna 0 hned (levné, viditelné). Vlna 1 je páteř — nejdřív audit (FR-18) → barvy (FR-17) → sdílené komponenty. Vlna 2 řeší onboarding (nezávislé, dá se dělat paralelně). Vlna 3 jsou dlouhodobé investice.

---

## Interview #1 — first-impression test

**Setup:** účastnice (Klára) poprvé přistála na aplikaci (PizzaBlock), měla říct první dojem a zkusit si to projít. Nerodilá mluvčí angličtiny (čeština).

### 🧭 Rámec každé hry (zastřešující design princip)
Každou hru držet ve třech krocích — tři systémové FR níže jsou přesně tyto tři kroky:
1. **Vysvětlit, co budeme učit** — definice pojmu na začátku (→ **FR-9**).
2. **Simulace** — samotné cvičení/hra.
3. **Připomenout na konci** — znovu definice + jasně **co dělat a co nedělat** (→ **FR-13**).

---

### Onboarding & srozumitelnost

**FR-1 — Landing page pro context setting (než uživatel spadne do „workshopu")** 🔴
Klára: *„Nejsem si jistá, co přesně mám udělat."* Teď se spadne rovnou do workshopu; chybí landing page, která nastaví kontext.
Požadavky na obsah:
- Vysvětlit, o co ve hře jde; rámovat jako **learning path majitele pizzerie**, který se musí naučit AI pojmy, aby si postavil agenta.
- Obrázek **„pizza guy"** = majitel (viz **FR-3**).
- CTA **„pojď se učit se mnou"** → do workshopu.
Reference layout (Evina *Word Learning App / „Vocabulary"*): velký headline s benefitem · krátký podtext „co to je" · primární CTA · živá demo karta vedle textu · sekce **„WHY THIS ONE"** = 3 benefit karty · přepínač **Čeština/English** nahoře (→ **FR-6**).
- **📍 Kde:** `src/App.jsx` (přidat novou routu, např. `/` → `Landing`, workshop přesunout na `/workshop`); nový `src/screens/Landing.jsx`. Dnes `/` míří rovnou na `Workshop`.
- **✅ Hotovo když:** první návštěva appky ukáže landing (ne workshop); je tam narativ majitele + pizza obrázek + 3 benefit karty; CTA vede do workshopu; přepínač jazyka je viditelný (funkčnost jazyka řeší FR-6).

**FR-2 — Není jasný learning objective u her**
Na konci nebylo jasné, co se vlastně měla naučit / jaká byla ta „skill".
- **📍 Kde:** `src/components/GameIntro.jsx` + `src/content/terms.json`. **Pozor na záměr:** `term.about` je dnes schválně *napínák*, plná `term.definition` je odměna až po hře — objective přidat tak, aby tenhle záměr nezrušil (spíš „co se tu naučíš" než prozrazení definice). Souvisí s **FR-9** (definice) a **FR-13** (shrnutí).
- **✅ Hotovo když:** na úvodní obrazovce každé hry je jednou větou řečeno, jakou dovednost si hráč odnese.

### Vizuál & branding

**FR-3 — Přidat pizzu / vizuální identitu tématu**
Jmenuje se to PizzaBlock, ale žádná pizza na první obrazovce není — Klára ji čekala.
*Podnápad:* „AI/umělá" pizza (odkapává něco umělého místo sýra) — signalizuje AI, ne skutečné jídlo. Souvisí s **FR-1** (pizza guy).
- **📍 Kde:** landing/intro z **FR-1**; dnes v repu žádné pizza ilustrace nejsou (bude potřeba asset).
- **✅ Hotovo když:** na landingu/intru je tematická pizza ilustrace, která drží styl appky.

**FR-4 — Působí to „hodně AI-generovaně" / málo dopilovaně**
Strohý, „vyprodukovaný" web; přirovnala k přihlášení do banky. Zaujalo ji to, ale polish chybí.
- **📍 Kde:** globální — vizuální vrstva (`src/theme/tokens.css`, `src/index.css`, sdílené komponenty). Nejlépe řešit **až po FR-18** (audit) na sjednoceném základu.
- **✅ Hotovo když:** (měkké) landing + aspoň 1 hra působí dopilovaně — konzistentní spacing, hierarchie, mikro-detaily; ne generická plochost. Vhodné validovat na dalším uživateli.

**FR-5 — Volitelný panáček / avatar**
Nápad: možnost vybrat/customizovat postavičku. Personalizace na začátku (nejspíš součást onboardingu z **FR-1**).
- **📍 Kde:** onboarding z FR-1; dnes žádný avatar systém neexistuje.
- **✅ Hotovo když:** na začátku si hráč zvolí avatara, který se pak drží v UI. *(Nice-to-have, ne blocker.)*

### Jazyk

**FR-6 — Angličtina je největší bariéra** 🔴
*„Největší problém asi ta angličtina."* Pro českého mluvčího hlavní překážka.
- **📍 Kde:** dnes **žádné i18n** — texty jsou natvrdo anglicky napříč `src/` (hlavně `src/content/*.json` a `src/games/*/index.jsx`). Reference: Word App má přepínač CS/EN. → větší kus (zavést i18n vrstvu + překlady).
- **✅ Hotovo když:** existuje přepínač CS/EN a aspoň onboarding + jedna hra jsou plně česky; přepnutí mění jazyk bez reloadu.

### Obsah & pedagogika

**FR-7 — Nejasný label „Log it" (čte se jako nesmyslné „logit")**
Vyjasněno: nešlo o ML termín „logit", ale o **button „Log it"** (playbook step) ve Skill hře — Klára ho přečetla jako jedno slovo „logit" a nedávalo jí smysl. Je to problém **dvojznačného labelu**, ne žargonu.
- **📍 Kde:** `src/games/skill/content.js:16` — `{ id: 'log', label: 'Log it', ... }`.
- **✅ Hotovo když:** label je přeformulovaný tak, aby byl jednoznačný (např. „Log the complaint" / „Record it" / „Zaznamenat"); nedá se přečíst jako jedno nesmyslné slovo.
- **Obecné poučení:** projít krátké labely her, jestli se nedají přečíst chybně / nejsou žargon.

**FR-8 — Ujištění „tohle je těžký pro všechny"**
Klára řekla, že je to náročné pro všechny a člověk neví, co říct. Uklidnění by snížilo zastrašení.
- **📍 Kde:** copy — vhodné do `GameIntro` / úvodu her (`src/content/terms.json`) nebo do zpětné vazby při chybě (`src/content/failure-lines.json`).
- **✅ Hotovo když:** hráč někde v toku vidí povzbudivou/normalizující větu („tohle mate skoro každého…").

---

### Hry — systémové nálezy (napříč všemi) 🔁

**FR-9 — Levá strana hry: zarámovat jako „definici" a vysvětlit PŘED hraním** 🔴 🔁 *(krok 1 rámce; potvrzeno obecně + Skill)*
Levý/orientační panel je moc textový a málo vizuální; u **Skill** Klára nepochopila, co „skill" je, protože se rovnou skočilo do hry.
- **📍 Kde:** `src/components/GameIntro.jsx` (ukazuje `term.name`, `term.about`, `term.role`) + `src/content/terms.json`. **Záměr k respektování:** `about` = napínák, `definition` = odměna po hře — „definice na začátku" udělat tak, aby nezabila payoff (např. vizuální rámeček „Co se tu učíš" místo prozrazení celé definice).
- **✅ Hotovo když:** úvodní panel je vizuálně jasně olabelovaný jako „definice/co se učíš", je čitelný na první pohled a je *před* startem hry; řešeno jedním sdíleným panelem napříč hrami.

**FR-10 — Výběrové karty/buttony nevypadají klikatelně** 🔴 🔁 *(krok 2; potvrzeno 3×)*
Klára nepochopila, že jednu z možností má vybrat kliknutím — nevypadají jako volba.
**Dnes to NENÍ sdílený komponent** — 3 duplikované implementace téhož:
- `ChoiceCard` — `src/games/prompt/index.jsx:29` (velké ikonové karty ROLE / WHEN INFO IS MISSING)
- `CategoryPicker` — `src/games/prompt/index.jsx:51` (malé „pill" buttony, round 3 „You build the bot")
- Guardrails inline `<button>` — `src/games/guardrails/index.jsx:224` (LIMIT 1–4, viz **FR-16**)
- **📍 Kde:** viz výše → vytvořit nový `src/components/SelectableCard.jsx` a nahradit jím všechna tři místa.
- **✅ Hotovo když:** existuje jeden sdílený `SelectableCard` s jasnou affordance (hover + selected stav, radio/checkbox ikona, mikrocopy „vyber jednu"); používají ho Prompt (obě místa) i Guardrails; na první pohled je zřejmé, že jde o volbu.

**FR-13 — Finální „You just learned the term…" obrazovka: méně textu, checklist** 🔴 🔁 *(krok 3; potvrzeno Prompt + Guardrails)*
Zeď textu, málo zapamatovatelného. Co udělat jinak: znovu **konkrétní definice** · **„co je důležité vědět"** jako jednoduché **checkmarks** (ne odstavce) · volitelně **„co nedělat"**.
- **📍 Kde:** reveal blok je dnes **naklikaný zvlášť v každé hře** (např. `src/games/temperature/index.jsx:294`+, používá `term.definition` a `term.whyYouCare`). → vytáhnout do jednoho sdíleného komponentu (např. `src/components/TermReveal.jsx`). Data v `src/content/terms.json`.
- **✅ Hotovo když:** jeden sdílený komponent závěrečné obrazovky používají všechny hry; obsah je definice + checklist „co je důležité" (+ volitelně „co nedělat"), ne zeď textu; vypadá stejně napříč hrami.

**FR-17 — Barevný/vizuální jazyk je nekonzistentní; kodifikovat ho** 🔴 🔁 *(design systém)*
**Zelená je přetížená** — nese aspoň tři významy: (1) chat zpráva zákazníka, (2) instrukční/kontejner box (Skill part 2: YOUR PLAYBOOK), (3) výsledkové karty na Prompt výsledkovce — navíc na *reálně špatných* volbách (viz **FR-11**).
- **📍 Kde:** tokeny `src/theme/tokens.css` + mapování `tailwind.config.js`; použití rozeseté inline v `src/games/*/index.jsx`. Navazuje na existující *visual archetypes* (message=bublina, choice=karta, result=tint).
- **✅ Hotovo když:** existuje krátký zapsaný „slovník" (co znamená každá barva/tint: zpráva vs. volba vs. instrukce vs. výsledek správně/špatně) a je důsledně aplikovaný; zelená už neznamená zároveň „chat" i „výsledek". *(Provádí se přes FR-18.)*

**FR-18 — Audit komponent a jejich sjednocení** 🔴 🔁 *(design systém — akční úkol pod FR-17)*
> **Stav: řeší se v samostatném chatu (varianta „A" — inventář komponent).** Tady vedeno jen jako zapsaný feedback.
Projít **všechny** komponenty: **na co se používá → dává to smysl? → sjednotit / vytvořit sdílený komponent.**
- **📍 Kde (rozsah):** krabicové styly (`shadow-pop`, `border-[3px]`, `bg-danger-bg`, `bg-success-bg`, `bg-muted`, `bg-accent-soft`, `bg-cheese`) jsou **inline ve všech 12 hrách**; sdílená vrstva skoro chybí (jen `GameStage`/`GameActions`/`GameIntro` + per-hra helpery `ChoiceCard`, `CategoryPicker`, `Feedback`, panely). → větší kus, ne kosmetika.
Komponenty zachycené Klárou (ověřit *všechny*, tohle je ukázka): Prompt/fill-in box (zelený tint) · zákaznická bublina (zelený tint + avatar) · instruction card (bílá + modrý ikonový panel) · problem/error callout (červený tint) · action card (bílá + cheese ikonový panel + „+ ADD").
- **✅ Hotovo když:** existuje tabulka *komponent → sémantická role → kde se používá → konzistentní? → návrh sjednocení*, a z ní sada sdílených komponentů, na které se pak napojí **FR-10** (SelectableCard), **FR-13** (TermReveal), **FR-9** (definice panel).

---

### Hra: Prompt (konkrétní nálezy)

**FR-11 — Na výsledkovce jsou všechny odpovědi zelené, i když jsou špatně** 🔴 *(instance FR-17)*
Souhrn „You picked … → Better: …", ale „Better" návrhy jsou zelené — i špatná volba vypadá zeleně. Navíc je to **stejná zelená jako chat bublina zákazníka**.
- **📍 Kde:** výsledková obrazovka Prompt hry — fáze `round3-result` / `reveal` v `src/games/prompt/index.jsx`. Barvy viz **FR-17**.
- **✅ Hotovo když:** špatně vybraná volba je vizuálně odlišená (červená/neutrální), zeleně jen skutečně správná/doporučená; zelená se nepřekrývá s chat bublinou.

**FR-12 — Není jasné, že se dá pokračovat i bez správného vyplnění**
Klára nepochopila, že může jít dál, i když nevybrala správně.
- **📍 Kde:** stejná Prompt výsledkovka / `match` fáze v `src/games/prompt/index.jsx`.
- **✅ Hotovo když:** UI zřetelně říká, že postup není blokovaný (a/nebo nabídne opravu před pokračováním).

---

### Hra: Temperature (konkrétní nálezy)

**FR-14 — Favorit („classic") se posunem slideru nemění; pointa vysoké teploty není vidět** 🔴
*Ověřeno v kódu (`reshape`, `src/games/temperature/index.jsx:332`): simulace je věcně správně* — temperature mění šance, ne pořadí, takže nejpravděpodobnější slovo zůstává #1 (classic ~87 % dole → ~28 % nahoře). Problém je **prezentace**, ne matematika.
- **📍 Kde:** `src/games/temperature/index.jsx` — highlight „top" slova (`isTop`, cca ř. 121+ a 45); distribuce ř. 114+.
- **✅ Hotovo když:** UI nezvýrazňuje trvale favorita jako „správnou odpověď" (např. highlightuje až *hozené* slovo po rollu) a vizuálně komunikuje, že se náskok favorita při vysoké teplotě hroutí.

**FR-15 — „Roll again" jen mění větu; není jasné, k čemu je** 🔴
Roll losuje slovo z rozdělení, ale UI nevede ke srovnání „dole pořád stejné × nahoře pokaždé jiné" a hozené slovo se nepropojí zpět s pravděpodobnostmi.
- **📍 Kde:** `src/games/temperature/index.jsx` — `roll()` (cca ř. 49), `sampleWord` (ř. 339), věta se sampled slovem (ř. 66+).
- **✅ Hotovo když:** po rollu je hozené slovo zvýrazněné i v seznamu pravděpodobností; hráč je naveden hodit dole vs. nahoře a rozdíl je patrný (volitelně tally posledních hodů).

---

### Hra: Guardrails (konkrétní nálezy)

**FR-16 — Výběrové karty nevypadají klikatelně** 🔴 🔁 *(= FR-10)*
U LIMIT 1–4 Klára nepochopila, že má u každého limitu vybrat volbu.
- **📍 Kde:** `src/games/guardrails/index.jsx:224` (inline `<button>`).
- **✅ Hotovo když:** nahrazeno sdíleným `SelectableCard` z **FR-10** (řešit společně, ne zvlášť).

---

### Otevřené / navazující
- [ ] **Component audit (FR-18, varianta A)** — probíhá v samostatném chatu.
- [x] ~~Ověřit žargon z FR-7~~ → vyjasněno: šlo o label **„Log it"** ve Skill hře (`src/games/skill/content.js:16`).
- [ ] Priorizovaný souhrn / roadmapa (na požádání).
- [ ] Další interview (#2+) — přidávat jako nové sekce.
