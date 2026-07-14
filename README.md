# Volt — Local Energy Ledger

A peer-to-peer rooftop-solar trading demo for a ten-household microgrid
(Nolambur, Chennai): a live simulated energy market settled through a
real, in-browser SHA-256 hash chain, with a tamper demo that shows the
chain visibly break and re-seal.

## Status

Migrating from a plain HTML/CSS/JS prototype into Vite + React +
TypeScript, per `legacy/VOLT_BUILD_PLAN.md`. The original prototype is
preserved under `legacy/` until the migration's parity check passes.

## Development

```
npm install
npm run dev      # http://localhost:5173 — "/" (landing) and "/ledger" (live dashboard)
npm run build    # type-check + production build
```

## Structure

- `src/lib/` — pure logic (hash chain, simulation math, formatting). No React, no DOM.
- `src/store/` — Zustand shared state.
- `src/components/sections/` — one page-section component + co-located CSS each.
- `src/components/ui/` — small reusable pieces.
- `src/theme/` — `tokens.ts` (design tokens) + the one global stylesheet.
- `src/pages/` — route-level composition (`/` and `/ledger`).
- `legacy/` — the original Claude Design HTML/CSS/JS prototype and build plan, kept until migration parity is verified.
