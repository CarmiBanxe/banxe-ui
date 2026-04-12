# AGENTS.md — banxe-ui

**Repository:** `~/banxe-ui/`
**Version:** 1.0 | 2026-04-12
**Purpose:** BANXE UI/UX prototype platform (Next.js + Vercel)
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Vercel

---

## Core mission

UI prototypes and design system for BANXE AI Bank.
Production deployment on Vercel. Compliance UI components with EU AI Act Art.52 disclosures.

---

## Four-Partner Swarm

| # | Partner | Role |
|---|---------|------|
| 1 | **Claude Code** | Architect, reviewer, orchestrator |
| 2 | **Aider CLI** | Component executor |
| 3 | **MiroFish** | UI scenario simulator |

---

## Instruction hierarchy

1. Explicit user instruction
2. `CLAUDE.md` — Next.js + Vercel context
3. `AGENTS.md` — this file
4. `~/.claude/CLAUDE.md` — global defaults

---

## Critical rules

| Rule | Details |
|------|---------|
| **I-05** | Financial amounts: `string`, never `number` |
| EU AI Act Art.52 | AI disclosure headers on all compliance UI |
| Vercel deploy | `vercel --prod` only after QA pass |

---

## Development commands

```bash
pnpm dev          # local dev server
pnpm test         # Vitest
pnpm build        # production build
pnpm lint         # biome check
pre-commit run --all-files
```

---

## Repository structure

```
banxe-ui/
├── apps/           ← Next.js applications
├── docs/           ← Design system docs
├── mocks/          ← Mock data for UI testing
└── coverage/       ← Test coverage reports
```

---

## Deployment

- Production: Vercel (web-next-ruby-iota.vercel.app)
- Deploy: push to `main` → Vercel auto-deploy via GitHub integration

---

## Definition of done

- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds (no TypeScript errors)
- [ ] Compliance disclosure headers present
- [ ] Vercel preview URL reviewed
