# PASS B — UX/Compliance Validation Report
**Date:** 2026-04-11  
**Auditor:** Claude Sonnet 4.6 (automated audit)  
**Scope:** banxe-ui monorepo — apps/web-next + apps/mobile  
**Commit:** `3c4c559` (main)

---

## Executive Summary

| Area | Status | Risk |
|------|--------|------|
| PSD2 SCA Flows | ✅ PASS | Low |
| KYC Screens | ⚠️ PARTIAL | Medium |
| GDPR Consent | ⚠️ PARTIAL | Medium |
| Web/Mobile Parity | ⚠️ PARTIAL | Medium |
| Accessibility (WCAG 2.1 AA) | ✅ PASS | Low |
| Session Timeout | ❌ FAIL | **High** |
| Card Data / PAN Exposure | ✅ PASS | Low |
| I-05 Monetary Invariant | ⚠️ PARTIAL | Medium |

**Critical blockers:** 1 (Session timeout not enforced)  
**Medium findings:** 4 (KYC parity, GDPR mobile, I-05 violations, PSD2 mobile consent)

---

## 1. PSD2 SCA Flows ✅ PASS

### Web-Next — `apps/web-next/app/transfers/page.tsx`

Full 3-step PSD2 flow implemented:

| Step | Implementation | File:Line |
|------|---------------|-----------|
| Step 1: Form | IBAN + amount + reference input with validation | transfers/page.tsx:20–60 |
| Step 2: Review + Consent | Transfer summary + explicit PSD2 checkbox (blocking) | transfers/page.tsx:155–180 |
| Step 3: Success | Confirmation with masked IBAN + amount | transfers/page.tsx:211–225 |

- IBAN validation: `/^[A-Z]{2}\d{2}[A-Z0-9]+$/` (line 25)
- Consent checkbox has `aria-required="true"` and blocks submission when unchecked (line 174)
- Button disabled when `!psd2Consent` (line 179)
- Step 2 aria-label: "Confirm transfer — Step 2 of 2" (WCAG step indicator)

### Mobile — `apps/mobile/app/(tabs)/transfers.tsx`

2-step flow with biometric SCA:

| Step | Implementation | File:Line |
|------|---------------|-----------|
| Step 1: Form | IBAN + amount + reference input | transfers.tsx:72–155 |
| Step 2: Biometric Confirm | expo-local-authentication, falls back to PIN | transfers.tsx:159–188 |
| Step 3: Success | Haptic feedback + confirmation | transfers.tsx:201 |

⚠️ **Gap:** Mobile SCA is biometric-only — no explicit written consent checkbox (web-next requires one). PSD2 Article 97 strictly requires strong authentication but the consent acknowledgment model differs between platforms.

**Recommendation:** Add a simple consent checkbox to mobile Step 2 before biometric prompt.

---

## 2. KYC Screens ⚠️ PARTIAL

### Mobile — `apps/mobile/app/kyc/index.tsx` ✅

Full 3-step KYC flow:

| Step | Implementation |
|------|---------------|
| Step 1: ID Document | Camera capture via expo-image-picker |
| Step 2: Selfie | Front camera portrait capture |
| Step 3: Liveness | Alert simulation (production: Onfido/Jumio SDK) |

- GDPR Art. 9 notice for biometric data (kyc/index.tsx:126–137)
- FCA CASS + UK AML Regulations 2017 citations (line 15–17)
- accessibilityLabel on step indicators (line 69–78)

### Web-Next ❌ MISSING

No KYC route exists in `apps/web-next/app/`. Web users cannot complete identity verification.

**Recommendation:** Build `apps/web-next/app/kyc/page.tsx` with equivalent document upload flow using `<input type="file" accept="image/*" capture="environment">`.

---

## 3. GDPR Consent ⚠️ PARTIAL

### Web-Next — `apps/web-next/app/auth/login/page.tsx` ✅

- Blocking consent: form rejects submission if checkbox unchecked (lines 18–21)
- Text references GDPR Art. 6(1)(b) — lawful basis for processing (line 43)
- Links to `/legal/privacy` and `/legal/psd2` (lines 41–43)
- `aria-required="true"` on consent checkbox (line 40)

```typescript
// login/page.tsx:18–21
if (!gdprConsent) {
  setError("You must consent to data processing to continue.")
  return
}
```

### Mobile — `apps/mobile/app/auth/onboarding.tsx` ❌

Onboarding carousel goes directly to dashboard with no GDPR consent checkpoint.

**Recommendation:** Add a consent screen as Step 4 (last) of the onboarding carousel before `router.replace('/(tabs)')`.

---

## 4. Web/Mobile Parity ⚠️ PARTIAL

| Feature | Web-Next | Mobile | Status |
|---------|----------|--------|--------|
| Auth/Login | ✅ `/auth/login` (email + PIN) | ✅ `/auth/onboarding` (carousel) | ⚠️ Different model |
| Dashboard | ✅ `/dashboard` (server-side real API) | ✅ `/(tabs)/` (client-side + fallback) | ✅ Equivalent |
| Transfers (PSD2) | ✅ `/transfers` (3-step + consent checkbox) | ✅ `/(tabs)/transfers` (2-step + biometric) | ⚠️ Consent model differs |
| KYC | ❌ Missing | ✅ `/kyc` (full 3-step) | ❌ **Gap** |
| Settings | ✅ `/settings` (GDPR section) | ✅ `/(tabs)/settings` | ✅ Equivalent |
| Transactions | ✅ `/transactions` (planned) | ✅ `/(tabs)/transactions` | ⚠️ Web planned |
| Statement | ✅ `/statement?account=` (link) | ❌ Missing | ⚠️ Web only |

---

## 5. Accessibility (WCAG 2.1 AA) ✅ PASS

### Contrast Ratios

- **Primary `#1A2B6B` on white `#FFFFFF`:** ratio ≈ **9.5:1** ✅ (exceeds AAA 7:1)
- **Accent `#00C6AE` on white:** ratio ≈ **2.8:1** ⚠️ (fails AA 4.5:1 — avoid for small text)

### Web-Next

- `aria-label` usage: **99 instances** across web-next components
- Focus visible: `outline: 2px solid var(--color-border-focus); outline-offset: 2px` (globals.css:47–50) ✅
- Semantic landmarks: `<main>`, `<nav>`, `<header>`, `<section aria-labelledby>` throughout
- Form ARIA: `aria-required`, `aria-invalid`, `aria-describedby` on inputs (input.tsx component)
- Transfer step 2: `<main aria-label="Confirm transfer — Step 2 of 2">` ✅

### Mobile

- `accessibilityLabel` usage: **64 instances** across mobile screens
- `accessibilityRole` set on buttons, alerts, toolbar groups
- KYC: step indicators with `accessibilityLabel` (kyc/index.tsx:69–78)
- Transfers: `accessibilityLabel="Confirm payment with biometrics (PSD2 SCA)"` (transfers.tsx:208)

### Minor Gaps

- `#00C6AE` accent on white fails AA for small text (avoid as text color)
- One emoji in KYC without `aria-hidden` (kyc/index.tsx:139)
- Tab labels could be more descriptive (e.g., "Send, tab 1 of 4, selected")

---

## 6. Session Timeout ❌ FAIL (High Priority)

**Finding:** Session timeout is mentioned in UI text only. No enforcement code exists.

- Web settings page: "5 minutes of inactivity" (settings/page.tsx:55)
- Mobile settings: same display
- **No timer, middleware, or inactivity detection implemented**

**Required implementation:**

```typescript
// Next.js middleware approach (apps/web-next/middleware.ts)
// Check cookie expiry on every request
// Redirect to /auth/login if session expired
```

**Recommendation (Priority: P0):**  
Implement session timeout in Next.js middleware using JWT `exp` claim validation. For mobile, use an `AppState` change listener + `expo-secure-store` TTL check.

---

## 7. Card Data / PAN Exposure ✅ PASS

- No `cardNumber`, `card_number`, `pan`, or `PAN` fields in any business logic
- No 16-digit number patterns exposed in UI
- IBAN display uses API-masked format: `"GB29****1234"` (dashboard:166)
- Transfers use IBAN-only — no card processing in frontend

---

## 8. I-05 Monetary Invariant ⚠️ PARTIAL

**I-05 rule:** All monetary amounts must remain as `string` (Decimal). Never use `parseFloat()` or `Number()` on amounts.

### Violations

| File | Line | Code | Impact |
|------|------|------|--------|
| `apps/web-next/app/transfers/page.tsx` | 30 | `if (parseFloat(v) <= 0)` | Low (validation only) |
| `apps/mobile/app/(tabs)/transfers.tsx` | 82 | `if (Number(v) <= 0)` | Low (validation only) |
| `apps/mobile/app/(tabs)/send.tsx` | 50 | `const numAmount = parseFloat(amount \|\| '0')` / `numAmount > 30` | **Medium** (business logic: PIN threshold) |

### Compliant Code (reference)

```typescript
// dashboard/page.tsx — correct I-05 pattern:
// I-05: balance is a Decimal string from API — display directly, never parseFloat
<p aria-label={`${currency} ${balance}`}>{currencySymbol}{balance}</p>
```

### Recommended Fix (send.tsx:50)

```typescript
// BEFORE (violation):
const numAmount = parseFloat(amount || '0')
const requiresPin = numAmount > 30

// AFTER (I-05 compliant — compare as string decimal):
import Decimal from 'decimal.js'
const requiresPin = new Decimal(amount || '0').greaterThan(30)
```

Or without adding dependencies:
```typescript
// Simple regex check for zero/negative (avoids parsing):
const requiresPin = /^\d+(\.\d+)?$/.test(amount) && 
  parseInt(amount.split('.')[0] ?? '0') > 30
```

---

## Action Items

### P0 — Critical (block EMI compliance sign-off)

- [ ] **Session timeout enforcement** — implement Next.js middleware + mobile AppState listener
- [ ] **Mobile GDPR consent** — add consent screen to onboarding carousel (before dashboard)

### P1 — High (address before public beta)

- [ ] **Web-next KYC** — build `app/kyc/page.tsx` with document upload
- [ ] **Mobile PSD2 consent checkbox** — add to transfer Step 2 before biometric prompt
- [ ] **I-05 fix in send.tsx:50** — replace `parseFloat` with Decimal comparison for PIN logic

### P2 — Medium (polish)

- [ ] **Web-next transactions page** — build `app/transactions/page.tsx`
- [ ] **Mobile statement** — link from dashboard to PDF/CSV download
- [ ] **Accent color** — do not use `#00C6AE` as small text color (WCAG AA fail)
- [ ] **Emoji aria-hidden** — add `aria-hidden="true"` to decorative emojis in KYC

---

*Generated by automated PASS B audit — banxe-ui commit `3c4c559`*
