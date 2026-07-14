# Volt — Phased Build Plan (Claude Code)

## KICKOFF PROMPT — paste this into Claude Code first

Paste only this block to start. It tells Claude Code how to use the rest of this
file — it does not start building anything by itself.

```
Read VOLT_BUILD_PLAN.md in this repo fully before doing anything.

This file contains a GLOBAL CONSTRAINTS block, followed by numbered phases
(Phase 0 through Phase 6), in order. Each phase is a complete, self-contained
task with its own ACCEPTANCE checklist and its own commit message.

Rules for how you work through this file:

1. Work ONE PHASE AT A TIME, in numeric order, starting at Phase 0. Never start
   a later phase before the current one is complete and verified.
2. The GLOBAL CONSTRAINTS block applies to every single phase without exception.
   Re-read it before starting each phase, don't rely on memory of it from earlier
   in the session.
3. Before writing any code for a phase, restate back to me in 2-4 sentences what
   that phase is asking for and flag anything ambiguous. Wait for my go-ahead if
   something is genuinely unclear — otherwise proceed. For Phase 0 specifically,
   this means: complete the file/section/CSS inventory FIRST and show it to me —
   that is a hard stop, not a formality. Do not scaffold or migrate anything until
   I've reviewed the inventory.
4. After implementing a phase, run the dev server yourself and walk through that
   phase's ACCEPTANCE checklist item by item. Tell me the result of each item
   explicitly — pass or fail — don't just say "done."
5. Do NOT commit until every acceptance item for that phase passes. Use the exact
   commit message given at the end of the phase.
6. After a phase's commit, STOP and tell me it's ready for review. Do not
   automatically continue to the next phase, even if it seems obvious what
   comes next. I will tell you when to proceed.
7. If completing a phase requires touching a file or convention that an earlier
   phase already established (e.g. lib/simulation.ts, the co-located CSS
   convention, the TypeScript strictness), you must match what already exists —
   never quietly relax a constraint to make a phase easier.
8. If at any point you cannot satisfy an acceptance item, say so plainly and
   explain why, rather than marking it as passing.

Confirm you've read the full file and tell me what Phase 0 will involve before
you start it.
```

---


**Project:** Volt — a local energy-sharing ledger. Neighbours with surplus rooftop
solar trade energy credits peer-to-peer instead of exporting to the grid at a low
feed-in rate while neighbours buy back at a high retail rate. Every trade is written
to a **real, in-browser hash chain**, making the local market **tamper-evident**.

**Status:** The current Volt prototype is **plain HTML/CSS/JS** — no framework, no
build tool, no TypeScript. CSS lives inside `<style>` tags in the HTML files.
There is working logic and a working demo here already; the goal of Phase 0 is to
**migrate it into Vite + React + TypeScript with proper co-located component
styling, without breaking or silently changing any existing behaviour.** Every
phase after Phase 0 assumes that migration is complete and verified.

---

## Global constraints — apply to EVERY phase

Paste this block at the top of every phase prompt. Claude Code drifts without it.

```
STACK (installed in Phase 0 — do not change, do not add further dependencies
without asking):
- Vite + React 18 + TypeScript
- Tailwind CSS with a custom token theme (theme/tokens.ts + tailwind.config)
- Zustand for shared state (store/useEnergyStore.ts)
- Framer Motion for animation
- Canvas 2D for the hero energy mesh
- js-sha256 for the hash chain (synchronous, deliberate)
- Lucide for icons, Fontsource for self-hosted fonts

FILE STRUCTURE RULES (strict):
- This is a TypeScript project. Logic files are .ts, components are .tsx.
  There are NO .js files. Do not create any.
- Every component gets its OWN co-located stylesheet, imported at the top of
  that component file. Example:
      components/sections/CarbonCounter.tsx
      components/sections/CarbonCounter.css
- NO inline style objects in JSX. NO styling logic buried in the component.
  Presentation lives in the .css file.
- Global tokens and base styles stay in the theme stylesheet. Component CSS
  consumes those tokens (CSS custom properties / Tailwind tokens) — it must not
  hardcode raw hex colours or magic pixel values that already exist as tokens.
- Logic layer stays PURE: lib/*.ts must not import React, must not import the
  store, must not touch the DOM.
- lib/hashChain.ts is load-bearing. Do not modify it unless a phase explicitly says to.

QUALITY BAR:
- Fully typed. No `any`. No non-null assertions to silence the compiler.
- Respect prefers-reduced-motion, as the existing app already does.
- Responsive — must not break the existing mobile layout.
- If a change breaks an existing call site, fix EVERY call site in the same pass.
  Never leave the build red.

BEFORE COMMITTING:
- Run the dev server, click through the whole demo, confirm nothing regressed:
  ledger writes, hero mesh animates, household cards open, tamper demo still
  fails validation correctly on tamper and passes on restore.
```

---

## Phase order and why

Phase 0 migrates the existing plain HTML/CSS/JS prototype into Vite + React +
TypeScript. This is riskier than a fresh scaffold, because there is working logic
and a working demo to preserve — nothing else can run until this is done AND
verified to behave identically to the old version.

The sim rewrite (Phase 1) comes right after, before any feature work, even though
it feels like the "big" one.

Every counter in Phases 2–5 is a number *derived from simulation state*. Carbon
avoided depends on total kWh traded across a day. Grid dependence depends on total
daily demand. If the definition of "a day" changes underneath those counters, you
have to re-derive and re-verify all four. Build the day model correctly once, then
build each counter once on top of it.

| Phase | Feature | Touches | Risk |
|---|---|---|---|
| 0 | Migrate HTML/CSS/JS → Vite + React + TS | whole repo | High — real behaviour to preserve |
| 1 | Day model + day types | `lib/simulation.ts`, store | **High** — core engine |
| 2 | Carbon Avoided Counter | new component, read-only | Low |
| 3 | Grid Dependence Meter | new component, read-only | Low |
| 4 | Neighbourhood Autonomy Score | new component, read-only | Very low |
| 5 | Fairness Score | new component, read-only | Low |
| 6 | Proof Inspector | new component, reads hash chain | Low, **highest value** |

---

## PHASE 0 — Migrate plain HTML/CSS/JS → Vite + React + TypeScript

**Why this matters:** there's a real, working prototype right now — real HTML
structure, real CSS, real JS logic (including, per the project synopsis, hash
chain and simulation code that must keep working correctly). The danger in any
migration is silent behaviour drift: a click handler that stops firing, a CSS
selector that stops matching once the markup is restructured, an inline
`<script>` that assumed global scope and breaks inside a module. This phase is
structured to make that drift impossible to miss — inventory first, scaffold
alongside the old code without deleting it, migrate one piece at a time, and
verify behaviour at every step before moving forward.

```
TASK — migrate the existing plain HTML/CSS/JS Volt prototype into a proper
Vite + React + TypeScript project with co-located component styling.

STEP A — INVENTORY FIRST. Do this before writing any new code.
   - List every .html, .css, and .js file that currently exists.
   - For each JS file: what does it do, what DOM elements does it touch, does it
     rely on globals or on script load order, does it use any timers/intervals.
   - For each HTML file: what are its distinct visual/functional SECTIONS (e.g.
     header/nav, hero graph, household cards, ledger view, tamper demo, etc).
     Each section is a candidate React component.
   - For each <style> block: which HTML elements does it target, and which
     section does it belong to. Flag any CSS that is truly global (resets, fonts,
     colour tokens, layout primitives) vs CSS that belongs to one section only.
   - Present this inventory to me before proceeding to Step B. I want to see the
     section breakdown before you start converting anything.

STEP B — SCAFFOLD THE NEW PROJECT ALONGSIDE THE OLD ONE.
   - Do NOT delete or overwrite the existing HTML/CSS/JS files yet. Scaffold the
     new Vite + React + TS project in a way that the old files remain on disk and
     runnable until migration is verified complete (e.g. keep old files in a
     legacy/ or old/ folder, or on a separate branch — pick one and tell me which).
   - Initialise with: npm create vite@latest . -- --template react-ts
   - Install: tailwindcss (configured against a NEW theme/tokens.ts you create by
     extracting the real colour/spacing/font values out of the OLD <style> blocks
     — do not invent new values, pull the real ones out of what already exists),
     zustand, framer-motion, js-sha256 (synchronous API — this is deliberate, do
     not substitute Web Crypto), lucide-react, @fontsource.
   - TypeScript strict mode ON. No `any` anywhere.

STEP C — MIGRATE SECTION BY SECTION, using the Step A inventory as the checklist.
   For EACH section identified in Step A:
     1. Create Component.tsx + Component.css, co-located, CSS imported at the
        top of the .tsx file.
     2. Port that section's markup into JSX.
     3. Move that section's CSS out of the HTML <style> block and into
        Component.css. Update selectors to target the new component's actual
        class names — do not assume old selectors still match.
     4. Convert that section's JS logic to TypeScript:
        - Give every function, prop, and piece of state a real type. No `any`.
        - If the JS touched the DOM directly (querySelector, addEventListener),
          replace that with proper React state/effects — do not keep imperative
          DOM manipulation inside a React component.
        - If the JS was pure calculation with no DOM/browser dependency (e.g.
          simulation math, hash chain logic), it belongs in src/lib/ as a typed,
          framework-free .ts module — NOT inside the component.
     5. After each section is migrated, run it and manually confirm it behaves
        the same as the old HTML/CSS/JS version before moving to the next
        section. Do not batch multiple sections before checking.

STEP D — GLOBAL STYLES.
   - Anything flagged in Step A as truly global (resets, font-face, colour
     tokens, spacing scale) goes into ONE theme stylesheet imported once at the
     app root, backed by theme/tokens.ts as the single source of truth.
   - No component CSS may redefine a raw hex colour or pixel value that already
     exists as a token — it must reference the token.

STEP E — FILE STRUCTURE, enforced from this point forward:
     src/
       lib/            (pure logic only — hash chain, simulation math, etc.
                         no React, no DOM, no store import)
       store/
       components/
         sections/
         ui/
       theme/
         tokens.ts
   - No .js files anywhere in src/. TypeScript only.
   - No inline style objects in JSX. No inline style attributes carried over
     from the old HTML.

STEP F — PARITY CHECK, once every section from Step A is migrated:
   - Go through the OLD prototype and the NEW app side by side, section by
     section, and confirm every interactive behaviour still works identically
     (clicks, animations, the tamper demo failing validation correctly, any
     timers/intervals still running at the same cadence).
   - Only once parity is confirmed for every section: remove the old
     HTML/CSS/JS files (or the legacy/ folder), since they're now fully
     superseded.

CONSTRAINTS:
- Do not "improve" logic while porting it (e.g. don't change how the hash chain
  or simulation math works during this migration — that's what later phases are
  for). This phase changes WHERE code lives and WHAT LANGUAGE it's in, not what
  it does. Behaviour must be identical, not better.
- Do not skip Step A. Migrating section-by-section without an inventory is how
  something silently gets missed.
- Do not delete the old files until Step F parity is confirmed.

ACCEPTANCE:
- Step A inventory was presented and reviewed before any component was built.
- `npm run dev` runs with zero errors, `npm run build` type-checks clean.
- Every section from the inventory exists as its own Component.tsx + Component.css.
- No .js files remain in src/. No `any` types.
- Every old <style> block has been accounted for — either migrated into a
  component's co-located CSS or the shared theme stylesheet. None left behind
  in an HTML file.
- Side-by-side parity check (Step F) passed for every section before old files
  were removed.

Commit (in stages, not one giant commit):
  chore: scaffold Vite + React + TypeScript project alongside legacy prototype
  feat(migrate): <section name> ported to TypeScript component with co-located CSS
  ...(one commit per section)...
  chore: remove legacy HTML/CSS/JS prototype after verified parity
```

---

## PHASE 1 — Full 24-hour day model + selectable day types

**Why this matters:** the sim currently produces a narrow repeating slice of the day.
That hides the single most important dynamic in the entire system — **the evening
gap**, where household demand peaks at exactly the hour solar generation has fallen
to zero. That gap is the whole reason batteries and local trading exist. Right now
your demo cannot show it. Fix that and the rest of the project has something to
stand on.

```
TASK — rewrite the day model in lib/simulation.ts.

1. FULL 24-HOUR CYCLE, hour 0 → 23.

   solarCurve(hour, dayType):
     - zero overnight
     - ramps from ~06:00
     - peaks ~12:00–13:00
     - decays to zero by ~18:30
     - bell-shaped, NOT flat, NOT a repeating block

   demandCurve(hour, household, dayType):
     - has its OWN independent shape — it is NOT derived from solar
     - low overnight baseload
     - morning bump ~06:00–09:00
     - midday dip
     - LARGE evening peak ~18:00–22:00
     The evening peak must visibly land where solar is already at zero.

2. DAY TYPES — add a DayType union:
     'sunny-weekday' | 'cloudy' | 'weekend' | 'heatwave'

     sunny-weekday → baseline
     cloudy        → generation scaled down hard (~40–50% of baseline),
                     demand roughly unchanged
     weekend       → demand shape shifts: higher midday occupancy,
                     less sharp evening spike
     heatwave      → demand sharply elevated midday→evening (cooling load),
                     generation normal-to-high

   Export DAY_TYPES as a typed const array so the UI can enumerate it without
   hardcoding strings.

3. HARD CONSTRAINT — DETERMINISM. Read this twice.

   Simulation state must be a PURE FUNCTION of (dayType, hour, householdId).
   It must NOT be accumulated by mutating forward through ticks.

   - Any randomness must come from a SEEDED PRNG keyed on those inputs.
   - Querying hour 14 twice must return byte-identical values.
   - Hour 9 must be computable WITHOUT having first computed hours 0–8.

   This is a prerequisite for the Replay Timeline feature later. Building it
   deterministically now costs almost nothing. Retrofitting it later means
   rewriting the engine a second time. Do not skip this.

4. STORE WIRING — store/useEnergyStore.ts
   - dayType becomes selectable state with a setter.
   - The sim loop reads dayType from the store.
   - Changing dayType cleanly recomputes the day. No stale state, no half-old
     half-new hybrid.
   - Battery state must still behave sanely across the change.

5. UI — a minimal day-type selector.
   - New component with its own co-located .css file.
   - Enumerates DAY_TYPES; does not hardcode the four strings.
   - Keep it visually consistent with the existing token theme.

CONSTRAINTS:
- lib/simulation.ts stays pure. No React, no store import.
- Do NOT touch lib/hashChain.ts.
- Keep existing exported signatures working, or update every call site in the
  same pass. Nothing may be left broken.

ACCEPTANCE — verify each one by hand:
- Ledger, hero mesh, household cards, battery sim, tamper demo all still work.
- Switching to 'cloudy' visibly reduces generation across all households.
- The evening demand peak is clearly visible with zero solar behind it.
- Calling the sim for an arbitrary hour in isolation returns stable values.
- Switching day type twice and back returns to identical state.

Commit:
feat(sim): full 24h generation/demand curves with selectable day types
```

---

## PHASE 2 — Carbon Avoided Counter

**Why:** cheapest real feature on the board. Roughly an hour. It is a good first
counter precisely because it proves the Phase 1 data pipeline works end to end
before you build three more things on top of it.

```
TASK — add a Carbon Avoided Counter.

LOGIC (lib/, pure):
- Add a carbon calculation to the logic layer (new lib/carbon.ts, or extend an
  existing pure module — do not put this in a component).
- Carbon avoided = total kWh traded LOCALLY × grid emissions factor.
- Put the emissions factor in a single named, exported, documented constant
  (India grid average ≈ 0.71 kg CO2/kWh — cite it in a comment so the number is
  defensible to a judge, and so it can be swapped for another region in one line,
  exactly like the CURRENCY constant already is).
- Be precise about what is being claimed: this is emissions avoided by consuming
  local solar INSTEAD OF grid electricity. It is not a claim about total emissions.

UI:
- New component + its own co-located .css file.
- Animated count-up (Framer Motion), respecting prefers-reduced-motion.
- Show kg CO2 avoided, plus one human-scale equivalence (e.g. "≈ N trees for a day").
  Keep the equivalence honest and label it as an approximation.
- Must update live as trades settle, and must respond to day-type changes.

ACCEPTANCE:
- Switching to 'cloudy' reduces local trading, which visibly reduces carbon avoided.
  If it does not move, the wiring is wrong.

Commit:
feat(metrics): carbon avoided counter derived from local trade volume
```

---

## PHASE 3 — Grid Dependence Meter

**Why:** the honest counterweight to the whole pitch. It shows what the system does
*not* solve, which is exactly the kind of thing that wins credibility with judges.

```
TASK — add a Grid Dependence Meter.

LOGIC (lib/, pure):
- Grid dependence = share of total neighbourhood demand still met by grid import,
  AFTER solar self-consumption, battery discharge, and local peer trades.
- Compute it over the full day (Phase 1's 24h model), not a single instant.
- Also expose the instantaneous value for the current hour — the two are different
  and both are interesting.

UI:
- New component + own co-located .css file.
- A single clear bar or gauge, plus the percentage.
- Break the bar into its contributing sources so it is legible at a glance:
  solar direct / battery / local trade / grid import.
- Colour-code using EXISTING theme tokens only.

ACCEPTANCE:
- Sunny weekday → grid dependence noticeably lower.
- Cloudy → grid dependence noticeably higher.
- The four contributions must sum to 100%. Assert this in dev; a meter that does
  not sum is worse than no meter, and a judge will do this arithmetic.

Commit:
feat(metrics): grid dependence meter with source breakdown
```

---

## PHASE 4 — Neighbourhood Autonomy Score

**Why:** your headline number. Nearly free once Phase 3 exists — it is largely the
complement of grid dependence, packaged as the one figure a judge remembers.

```
TASK — add the Neighbourhood Autonomy Score.

LOGIC (lib/, pure):
- Autonomy = share of total demand met WITHOUT grid import
  (i.e. solar direct + battery + local trade).
- Reuse the Phase 3 computation. Do NOT duplicate the maths in a second place —
  derive both numbers from one shared pure function so they can never disagree.

UI:
- Prominent headline component + own co-located .css file.
- Large percentage, short plain-English subtitle explaining what it means.
- Animated transition when day type changes (respect reduced-motion).

ACCEPTANCE:
- Autonomy + grid dependence == 100%, always, on every day type. If they ever
  disagree, the two numbers are being computed twice and Phase 4 has failed.

Commit:
feat(metrics): neighbourhood autonomy score
```

---

## PHASE 5 — Fairness Score

**Why:** adds the social dimension. A local energy market that enriches one household
with a big roof and leaves everyone else out is not a good outcome, and showing you
thought about that is a differentiator.

```
TASK — add a Fairness Score.

LOGIC (lib/, pure):
- Measure how evenly the benefit of local trading is spread across the 10 households.
- START SIMPLE: net benefit (currency saved/earned) per household, then report the
  spread — highest-benefiting vs lowest-benefiting household, and the ratio between them.
- ONLY IF the simple version works cleanly, optionally upgrade to a Gini coefficient
  over per-household net benefit. Do not start with Gini.
- Whichever measure is used, the component must state plainly what it measures.
  A metric a judge cannot interpret scores zero points.

UI:
- New component + own co-located .css file.
- Show the distribution across households, not just one scalar — a small bar per
  household is more persuasive than an abstract index.
- Highlight the best- and worst-off household.

ACCEPTANCE:
- Fairness visibly changes between day types.
- Numbers reconcile with the per-household data already shown in the household cards.
  If the fairness panel and the household cards disagree, one of them is lying.

Commit:
feat(metrics): fairness score across neighbourhood households
```

---

## PHASE 6 — Proof Inspector *(highest value — do not let this get squeezed out)*

**Why:** this is the feature that makes your central claim *visible*. Everything else
is a number on a dashboard; this is the one that proves the ledger is real. Without
it, "we used a blockchain" is an assertion. With it, a judge watches the hash get
recomputed in front of them.

```
TASK — add the Proof Inspector.

UI/LOGIC:
- For any selected transaction in the ledger, display:
    • the block's STORED hash
    • the hash RECOMPUTED live from the block's current contents
    • the PREVIOUS block's hash, and the previous-hash field stored in this block
    • an explicit MATCH / MISMATCH status for each comparison
- Recomputation must be REAL — call the existing lib/hashChain.ts, in the browser,
  at inspect time. Do not cache, do not fake, do not read a stored "isValid" flag.
- Show truncated hashes by default (shortHash) with the full hash available on demand.

INTEGRATION WITH THE TAMPER DEMO:
- When a block is tampered, the Proof Inspector must show EXACTLY where the chain
  breaks: the tampered block's recomputed hash diverges from its stored hash, AND
  every subsequent block's previous-hash link fails.
- Make the cascade visible. The fact that tampering one block invalidates everything
  after it IS the argument for the hash chain. Show that, don't just say it.

CONSTRAINTS:
- Read-only over lib/hashChain.ts. Do not modify the chain logic.
- New component + own co-located .css file.

ACCEPTANCE:
- Tamper a block → inspector shows the mismatch and the downstream cascade.
- Restore → everything returns to green.
- Nothing about the validation result is precomputed or hardcoded.

Commit:
feat(ledger): proof inspector with live hash recomputation
```

---

## Terminology — fix this before you pitch

Your synopsis says the ledger is **"tamper-proof"** and that **"disputes are impossible."**
Neither is true, and a judge who knows the space will go straight at it.

What you actually have is **tamper-evident**. Nothing stops someone editing a block —
the hash chain makes the edit *detectable* on re-validation. And because the chain is
client-side with no distribution and no consensus, it is closer to an append-only log
with a cryptographic integrity guarantee than to a distributed ledger.

That is completely fine for a prototype. But say it yourself, first, in the
"why not just a database?" section — and you convert their best attack into another
point you have already scored.

- ❌ "tamper-proof" → ✅ "tamper-evident"
- ❌ "disputes are impossible" → ✅ "disputes are resolvable — any party can independently re-verify the chain"

---

## Remaining roadmap (after Phase 6)

Deliberately deferred. Each one touches the sim engine, which is where demo-day
fragility comes from.

- **Replay Timeline** — scrub through the day. Phase 1's determinism constraint is
  what makes this cheap. Highest-value remaining feature.
- **Outage Mode** + **Critical Load Priority** — a pair. Cost them as one feature.
- **Smart Match Explanation** — requires `matchTrades()` to emit reasoning alongside results.
- **Anomaly Detection** — flags impossible trades. Honest caveat: this is *validation
  logic*, not blockchain. Do not let the pitch blur the two; a judge who catches the
  blur will hit you harder than if you had never built it.

## Ship checklist

- [ ] Verify on localhost — full click-through, every section
- [ ] Deploy live (Vercel / Netlify)
- [ ] **Record a backup demo video** — do this the moment the build is stable, not the night before. Live demos fail.
- [ ] README + submission write-up
- [ ] Rehearse the 3-minute pitch:
      problem → live graph → log a trade → tamper → **proof inspector shows the break** →
      restore → "why not just a database?"

Code is ~60% of the score. The pitch and the submission polish are the rest.
