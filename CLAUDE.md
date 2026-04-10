# BANXE AI BANK — UI Monorepo

## Repository architecture

```
banxe-ui/
  packages/
    design-tokens/  — BANXE brand tokens (Style Dictionary → CSS vars + JS)
    ui/             — Shared React components (Atomic Design: atoms/molecules/organisms)
    shared/         — TypeScript types + API client (@banxe/shared)
  apps/
    web-vite/       — React + Vite prototype (preserved, no changes)
    web-next/       — Next.js 16 App Router — PRODUCTION web
    mobile/         — Expo SDK 53 — iOS + Android
  storybook/        — Component documentation
```

## Package manager
**pnpm only.** Never use npm or yarn.

```bash
pnpm install                          # root install
pnpm --filter @banxe/web-next dev     # run specific package
pnpm build                            # turbo: build all
pnpm test                             # turbo: test all
```

## Brand tokens (light theme — APPROVED 2026-04-10)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1A2B6B` | Buttons, links, headers |
| Accent | `#00C6AE` | CTAs, success states |
| Background | `#F5F7FA` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Text primary | `#1A1A2E` | Headings, body |
| Error | `#E53E3E` | Errors, destructive |
| Success | `#38A169` | Confirmations |

## Banking constraints (FCA/PSD2/GDPR — NON-NEGOTIABLE)

1. **I-05 — No floats for money.** All amounts stored and displayed as Decimal strings.
   Never use `parseFloat()`, `Number()`, or `toFixed()` on monetary values.
2. **PSD2 SCA.** Every payment flow requires a 2-step confirmation: review → confirm.
3. **GDPR consent.** Required checkbox on: login, registration, data-collection screens.
4. **Session timeout.** Warning at 4:30 min, auto-logout at 5:00 min.
5. **Biometric auth.** Expo: `expo-local-authentication`. Web: WebAuthn (future).
6. **No raw card numbers client-side.** Ever.
7. **KYC screens** must match the regulatory-approved flow (ID → selfie → liveness).
8. **Accessibility.** WCAG 2.1 AA minimum. All interactive elements need `aria-label`.

## Conventional Commits format
```
feat(web-next): add PSD2 transfer confirmation step
fix(mobile): correct IBAN validation regex
chore(design-tokens): rebuild after brand update
```

## Multi-agent handoff
- Claude Code: primary orchestrator
- OpenClaw/MetaClaw: reads .ai/registries/
- Ruff: Python quality in banxe-emi-stack (separate repo)
