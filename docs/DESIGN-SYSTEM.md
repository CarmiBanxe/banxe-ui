# BANXE AI BANK — Design System

## Colors
| Token | Hex | Usage |
|-------|-----|-------|
| navy | #0D1B2A | Background |
| electric-blue | #2563EB | Primary actions |
| gold | #F59E0B | Accent, warnings |
| surface | #1B2838 | Card bg |
| surface-hover | #243447 | Card hover |
| text-primary | #F8FAFC | Primary text |
| text-secondary | #94A3B8 | Secondary text |
| success | #10B981 | Positive |
| error | #EF4444 | Negative |

## Typography
- UI: Inter 400/500/600/700, 12-18px
- Headings: Inter 700, 20-32px
- Amounts: JetBrains Mono 600, 14-24px

## Rules
- Dark mode ONLY
- Amounts: 2 decimals + currency (1,234.56 EUR)
- Contrast: 4.5:1 minimum (WCAG 2.2 AA)
- Keyboard nav on all interactive elements
- ARIA labels on all icons

## Tremor Components
- BalanceCard: Card + Metric (dark, gold accent)
- SpendingChart: AreaChart (navy/blue gradient)
- WalletChart: BarChart (fiat=blue, crypto=gold)
- TransactionTable: Table + category badges
- InsightCard: Card + confidence indicator
