# Otevřené produktové otázky

> Otázky, na které je potřeba odpovědět dřív, než se z nich dá udělat feature request. Nejsou v Lineru záměrně: Linear je pro věci, které se dají udělat. Jakmile je otázka rozhodnutá, zapsat rozhodnutí sem a případný FR založit v Lineru (tým Pizza Bot, `PIZZA`).
>
> Všechny feature requesty a bugy z interview #1–#3 jsou v Lineru: https://linear.app/genaiacademy/team/PIZZA/all. Přepisy interview: [`interviews/`](./interviews/).

## 1. Je cíl naučit pojmy, nebo postavit agenta?

Eva během interview #2: *„já vlastně jakoby nechci stavět toho agenta“*, ale meta-hra „postav si bota“ slibuje přesně to. Lada to tak i přečetl. Rozpor mezi rámcem (stavíš bota) a cílem (naučíš se slovíčka) stojí za rozhodnutí, protože ovlivňuje landing (FR-33, FR-35), pojmenování na workshopu (FR-37) i to, co se ukáže na konci (FR-38).

- [ ] Rozhodnuto:

## 2. Patří do produktu druhá, neherní cesta?

Lada (#2, mimo personu): *„Give me the knowledge a nechci si procvičovat.“* Nechce klikat a být hodnocen; chce vyřešené příklady. *„Za ten čas, co tady ten jeden se udělá, tak bych jich viděl pět.“* Evin nápad z toho: druhý button „summary for people who don't wanna learn through games“, vzít existující příklady a ukázat je vyřešené (with skill / without skill).

Nina (#3, v personě) to nebere jako problém produktu: je to hra, každý je jiný learner, téhle skupině to prostě nesedne. Slabší varianta „přeskočit příklad“ je v Lineru jako FR-49.

Otázka: je to součást tohohle produktu, nebo jiný produkt? Před akcí potvrdit od někoho v personě.

- [ ] Rozhodnuto:

## 3. Učení od konce (Lada, P-1)

Lada chce vidět hotového bota v akci a pak se doptávat na to, čemu nerozumí. Odkazoval na n8n flow: *„máš tady nějakej input, tady máš něco, co ho zpracuje, tady je ten AI model […] a u toho se dějou ty věci.“* To je opak současného rámce (definice → simulace → shrnutí). n=1, mimo personu. Eva to během interview pojmenovala: *„ty nejseš v tomhle úplně ten target user.“* Souvisí s flow-board draftem (n8n-style flow místo robota).

- [ ] Rozhodnuto:

## 4. Nezatěžovat začátečníky omezeními (Lada, P-3)

*„Oni hlavně potřebujou vytvořit něco, co vůbec něco dělá. A až když máš chatbota, kterej umí odpovědět, tak mu řekneš: hele, na tohle neodpovídej.“* Argument proti guardrails brzy v pořadí. Ovlivňuje pořadí pojmů (FR-41), pokud se rozhodne, že pořadí má sledovat „jak se bot reálně staví“.

- [ ] Rozhodnuto:

## 5. Kdo je persona po interview #2?

Lada zmínil profil „Nina“: člověk, co AI umí, ale potřebuje si doplnit terminologii, aby v oboru pracoval. To je jiná persona než „busy AI user“ z [`PROJECT-PIZZA-BOT-BRIEF.md`](./PROJECT-PIZZA-BOT-BRIEF.md) §2. Zatím nerozhodovat, sledovat v dalších interview. Stav: Klára ✅ v personě, Lada ⚠️ mimo, Nina ✅ v personě (zatím nejblíž).

- [ ] Rozhodnuto:

## 6. Scope v1: účty a sběr dat

FR-30 (login + sběr e-mailů) ruší vědomou limitaci z briefu („No accounts, no backend, no data collection in v1“). Detail a doporučení (e-maily teď, login v2) jsou v Lineru u FR-30; tady jen připomínka, že jde o rozhodnutí o scope, ne o feature.

- [ ] Rozhodnuto:

---

## Hygiena testování (pro interview #4+)

- **Otevírat v anonymním okně.** Lada přistál na rozehraném stavu 9/12 z cookies a ztratil tím dvě minuty.
- **Nedávat mluvené intro.** V #3 Eva vysvětlila ústně, že jde o hru, a tím zabila první dojem (*„jsem tě biasla moc“*). Ostrý uživatel dostane jen obrazovku; test musí začít stejně.
- **Přepis dělá Wispr Flow**, v přepisu jsou zkomolené anglické texty z obrazovky (*„Peppermint, break some tooth“*). Citace z UI ověřovat v kódu, ne v přepisu.
- **Ukládat přepisy** do `interviews/` jako `RRRRMMDDInterview_Jméno.md`.
- **Rozlišovat, co je z persony a co ne.** U nálezů mimo personu to psát k nim.
- **Nálezy → Linear.** Každý FR/bug z interview zakládat rovnou jako issue v týmu Pizza Bot (Zdroj · Co změnit · Kde · Hotovo když), ne do markdownu.

## Přehled interview

| # | Kdo | Datum | Persona? | Typ | Přepis |
|---|-----|-------|----------|-----|--------|
| 1 | Klára | ~červenec 2026 | ✅ nerodilá mluvčí AJ, netechnická | First-impression test | bez přepisu (nálezy jsou v Lineru, FR-1 až FR-18) |
| 2 | Lada | 2026-09-03 | ⚠️ ne, samouk/builder | Walkthrough + reakce na koncept | [`20260903Interview_Lada.md`](./interviews/20260903Interview_Lada.md) |
| 3 | Nina | 2026-09-04 | ✅ netechnická, nerodilá mluvčí AJ | Usability walkthrough | [`20260904Interview_Nina.md`](./interviews/20260904Interview_Nina.md) |
