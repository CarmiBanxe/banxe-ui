# apps/web-next — BANXE Production Web App

## Stack
- Next.js 16 App Router (no pages/ dir)
- TypeScript strict
- Tailwind CSS v4 (no tailwind.config.js — uses @theme in globals.css)
- Components: packages/ui components + components/ui/ (shadcn-style)
- Design tokens: @banxe/design-tokens CSS vars

## Design tokens usage
```tsx
// Use CSS vars via Tailwind arbitrary values:
className="bg-[--color-primary] text-[--color-text-inverse]"
// Or direct CSS:
style={{ color: "var(--color-text-primary)" }}
```

## Banking constraints (non-negotiable)
- All monetary amounts displayed as Decimal strings — NEVER parseFloat()
- PSD2 SCA: every payment page MUST have two-step flow (review + confirm)
- GDPR consent checkbox required on: login, registration, data-collection pages
- Session timeout: show warning modal at 4:30 min, log out at 5:00 min
- Accessibility: all interactive elements need aria-label + keyboard navigation
- WCAG 2.1 AA: min contrast 4.5:1 for body text, 3:1 for large text

## Routing
- / → redirect /auth/login
- /auth/login — email + PIN + GDPR consent
- /dashboard — balance, 5 transactions, quick actions
- /transfers — PSD2 two-step IBAN transfer
- /settings — security, notifications, GDPR management

## Do NOT
- Use pages/ directory
- Use tailwind.config.js (v4 doesn't use it)
- Use next/image for SVG logos (use inline or img)
- Store any financial amounts as JS number/float
- Hardcode hex colors — use CSS vars from @banxe/design-tokens
- Skip ARIA labels on interactive elements
