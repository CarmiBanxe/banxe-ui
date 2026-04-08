# banxe-ui — BANXE AI BANK UI Prototype Workspace

**Plane:** Developer | **Status:** Prototype (not production) | **Created:** 2026-04-08

---

## What This Is

Prototype and design system workspace for BANXE AI BANK.
Contains: design tokens, component library, web app prototype, mobile app prototype, Storybook, tests.

This is **Developer Plane** work. Code is promoted to Product Plane (`banxe-emi-stack`) only after:
- UI quality gate PASS
- Accessibility: 0 critical violations
- CEO review + IL entry in `banxe-architecture/INSTRUCTION-LEDGER.md`

---

## What This Is NOT

- Not production banking code
- Not a source of financial logic (business logic lives in `banxe-emi-stack/services/`)
- Not authorized for real customer data or real API keys

---

## Architecture Docs (read these first)

All authoritative UI/UX design decisions live in `banxe-architecture/docs/`:

| Doc | Purpose |
|-----|---------|
| `BANXE-UI-UX-RESEARCH.md` | Tool landscape — what is safe and recommended |
| `BANXE-UI-UX-SYSTEM.md` | Design system: colors, typography, components, UX flows |
| `BANXE-SCREEN-INVENTORY.md` | All target screens and their states |
| `BANXE-UI-ARCHITECTURE.md` | Repo structure, component strategy, quality gates |
| `BANXE-CLAUDE-CODE-WORKFLOW.md` | How to use Claude Code for UI work |
| `BANXE-HEADLESS-PIPELINE.md` | 8-stage automated pipeline |
| `UI-PLANE-OPERATING-MODEL.md` | Governance and promotion rules |

---

## Running the Pipeline

```bash
# Full pipeline (from banxe-ui root):
bash scripts/banxe-build.sh

# Resume from stage 4:
bash scripts/banxe-build.sh --from-stage 4

# Single stage:
bash scripts/banxe-build.sh --stage 3

# Quality gate only:
bash scripts/banxe-build.sh --stage quality-gate
```

---

## Required Inputs

Before running:
1. Read `banxe-architecture/docs/BANXE-UI-UX-SYSTEM.md` — design decisions
2. Run `cd packages/design-tokens && npm run build` — build tokens first
3. Install deps: `npm install` (from root)

---

## Outputs

| Output | Location |
|--------|---------|
| Design tokens (CSS) | `packages/design-tokens/build/css/variables.css` |
| Design tokens (JS) | `packages/design-tokens/build/js/tokens.ts` |
| Design tokens (RN) | `packages/design-tokens/build/rn/tokens.ts` |
| Component library | `packages/ui/src/` |
| Web app | `apps/web/src/` |
| Mobile app | `apps/mobile/` |
| Storybook | `storybook/storybook-static/` (after build) |
| Pipeline reports | `.pipeline/stage*.json` |
| Quality gate report | `.pipeline/stage8-report.json` |

---

## What Remains Manual

- Figma design files (reference only — not source of truth for code)
- Stakeholder demo (present Storybook or Figma prototype)
- Promotion decision (CEO + IL entry)
- Mobile device testing (Expo Go app)
- Chromatic visual baseline approval

---

## What Is Optional / Experimental

- v0.dev for rapid structural exploration (Developer Plane only, never promoted)
- Chromatic visual regression (cloud screenshots — acceptable for non-sensitive UI)
- Figma MCP for token extraction

---

## Relation to BANXE Governance

```
banxe-architecture/   Architecture Plane — UI/UX specs, docs, governance
banxe-ui/             Developer Plane — this repo (prototype)
banxe-emi-stack/      Product Plane — production code (promoted only)
```

GSD commands for UI work:
```
/gsd-quick "implement BalanceWidget loading state"
/gsd-health  ← includes token build + Storybook check
```

---

## Component Scaffold (Current)

```
packages/ui/src/financial/
├── BalanceWidget/index.tsx   ← Primary balance display
└── TransactionRow/index.tsx  ← Transaction list item

mocks/data/
├── transactions.json         ← 5 realistic mock transactions (FAKE_ prefix)
└── wallets.json              ← 2 mock wallets (GBP + EUR)
```

Next: add StatusChip, AmountInput, AIInsightCard, Dashboard screen.
