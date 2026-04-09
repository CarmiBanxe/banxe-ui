# CLAUDE.md — BANXE AI BANK UI Workspace
**Repo:** CarmiBanxe/banxe-ui | **Plane:** Developer | **Updated:** 2026-04-09 (IL-063)

---

## БЛОК 0: КОНТЕКСТ И ТЕРРИТОРИЯ

Это **Developer Plane** репозиторий UI-прототипов.
- Production код → `~/banxe-emi-stack/` (отдельный терминал)
- Архитектурные решения → `~/banxe-architecture/docs/`
- Никогда не смешивать этот репо с product plane

**Перед любой UI-работой прочитай:**
```bash
cat ~/banxe-architecture/docs/BANXE-UI-UX-SYSTEM.md      # дизайн-система
cat ~/banxe-architecture/docs/BANXE-SCREEN-INVENTORY.md   # целевые экраны
cat ~/banxe-ui/packages/ui/src/index.ts                    # что уже есть
```

---

## БЛОК 1: ТЕХНОЛОГИЧЕСКИЙ СТЕК

```
Язык:         TypeScript 5.4 (strict mode, noImplicitAny)
Web:          React 18 + Vite 5 + React Router v6
Стили:        Tailwind CSS (только классы из tailwind.config.ts)
Компоненты:   packages/ui/src/ (@banxe/ui)
Mobile:       React Native + Expo SDK 51 + Expo Router
Тесты:        Vitest + Testing Library + jest-axe (a11y)
Storybook:    v8 — каждый компонент имеет story
Мокирование:  MSW v2 (handlers в mocks/handlers/)
```

**Запрещено:**
- Инлайн-стили (`style={{...}}`) — только Tailwind
- Хардкод цветов (`#080C14`) — только классы из tailwind.config.ts
- `parseFloat()` для денег — I-05 invariant (Decimal/string)
- Компоненты без story в Storybook
- Loading state без skeleton (не spinner-only)

---

## БЛОК 2: ДИЗАЙН-СИСТЕМА

### Цвета (Tailwind-классы → hex):
```
bg-bg-base (#080C14)        ← страница
bg-surface (#0F1520)        ← карточка, панель
bg-elevated (#16202E)       ← модал, дропдаун
bg-overlay (#1E2A3A)        ← hover, selected

text-primary (#E8EDF5)      ← заголовки
text-secondary (#8DA0B5)    ← подписи
text-brand-primary (#1A7FD4) ← CTA, ссылки

text-success (#22C55E)      ← получено, confirmed
text-warning (#F59E0B)      ← pending, review
text-error (#EF4444)        ← failed, blocked
text-ai-accent (#7C3AED)    ← AI-контент, ОБЯЗАТЕЛЬНО
```

### Шрифты:
```
font-sans  → Inter, DM Sans   ← текст
font-mono  → JetBrains Mono   ← суммы, IBAN, references (ВСЕГДА)
```

### Компоненты (импорт из @banxe/ui):
```tsx
import {
  BalanceWidget, TransactionRow, StatusChip,
  AmountInput, AIInsightCard, ComplianceFlag,
  Button, Input, Dialog, Skeleton,
  TransactionRowSkeleton, BalanceWidgetSkeleton,
} from '@banxe/ui'
```

---

## БЛОК 3: ПРАВИЛА СОЗДАНИЯ КОМПОНЕНТОВ

### Перед написанием нового компонента:
1. Проверь `packages/ui/src/index.ts` — не изобретай существующее
2. Напиши spec-комментарий в начале файла (Purpose, Props, States)
3. Реализуй ВСЕ states: loading → skeleton, error → inline, empty → CTA

### AI-контент — ОБЯЗАТЕЛЬНЫЕ правила:
- Каждый AI-ответ должен иметь `--color-ai-accent` badge (`✦ AI`)
- Каждый AI-ответ должен иметь `ConfidenceIndicator` (HIGH|MEDIUM|UNCERTAIN)
- При UNCERTAIN: показать `⚠ I am not certain — verify with account details`
- Static notice: `AI cannot initiate payments or change settings`
- Все AI-взаимодействия логируются (FCA audit trail)

### Финансовые суммы:
- Всегда `font-mono`
- Никогда `parseFloat()` — остаются как string до отображения
- Положительные (IN): `text-success`
- Отрицательные (OUT): `text-primary` (нейтральный)

### Accessibility (обязательно для каждого компонента):
- ARIA labels на всех interactive элементах
- `role="status"` для loading states
- `role="alert"` для error states
- `aria-live="polite"` для динамического контента
- Contrast: минимум WCAG AA (axe-core тест в CI)

---

## БЛОК 4: ЭКРАНЫ (W-01..W-06, M-01..M-06)

Реализованы в `apps/web/src/screens/` и `apps/mobile/app/(tabs)/`.

| ID | Маршрут | Файл | Статус |
|----|---------|------|--------|
| W-01 | `/` | screens/Dashboard | ✅ |
| W-02 | `/transactions` | screens/Transactions | ✅ |
| W-03 | `/wallets` | screens/Wallets | ✅ |
| W-04 | `/send` | screens/Send | ✅ |
| W-05 | `/ai` | screens/AIAssistant | ✅ |
| W-06 | `/settings` | screens/Profile | ✅ |

Для создания нового экрана: `/new-screen`

---

## БЛОК 5: MCP-ИНСТРУМЕНТЫ (доступны в Claude Code)

### Context7 MCP — актуальная документация
Добавь `use context7` к любому промпту — получишь свежую документацию React/Tailwind/Expo.
```
Пример: "How to use useNavigate in React Router v6? use context7"
```

### Figma MCP — семантическое чтение дизайна
Подключён к Figma API. Читает цветовые токены, компоненты, Auto Layout напрямую.
```
Пример: "Get color tokens from Figma frame ID: XXXXX"
```

### Storybook MCP — компоненты как контекст
Claude Code видит реальные компоненты из Storybook — не галлюцинирует их.
```
Пример: "List all available @banxe/ui components"
```

---

## БЛОК 6: SLASH-КОМАНДЫ

| Команда | Действие |
|---------|----------|
| `/new-screen` | Создать новый экран (spec → code → story → test) |
| `/gsd-quick "задача"` | Атомарная UI-задача |
| `/gsd-health` | Проверка системы (tokens + storybook + a11y) |

---

## БЛОК 7: ЗАПУСК

```bash
# Установить deps:
npm install

# Dev server (web):
npm -w @banxe/web run dev        # http://localhost:5173

# Storybook:
npm run storybook                 # http://localhost:6006

# Тесты:
npm -w @banxe/ui run test        # component unit tests

# Build tokens:
npm run build:tokens

# Full quality gate:
bash scripts/banxe-build.sh --stage quality-gate
```

---

## БЛОК 8: ПРОДВИЖЕНИЕ В PRODUCT PLANE

Код из `banxe-ui/` никогда не копируется напрямую в `banxe-emi-stack/`.
Только через явное одобрение CEO + IL-запись + gate review.

Чек-лист продвижения:
- [ ] Все экраны W-01..W-06 реализованы
- [ ] Quality gate PASS (axe-core 0 critical)
- [ ] Storybook stories для всех компонентов
- [ ] Vitest 100% pass
- [ ] CEO review
- [ ] IL-запись в banxe-architecture

<!-- EXECUTION ORDER: See БЛОК 0 above -->
<!-- Territory Rules: See БЛОК 0 above -->
<!-- GSD Framework: See БЛОК 1 above -->
