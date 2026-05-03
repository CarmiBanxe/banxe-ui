Проверил репо: pnpm-monorepo (web-next/web-vite/mobile + ui/shared/design-tokens), turbo, vitest, semgrep, jest-axe. Уже есть 4 workflow: `claude.yml`, `quality-gate.yml`, `factory-guard.yml`, `confluence-sync.yml`. Ниже — что реально стоит добавить/починить, отсортировано по ROI.

## Критичные баги в существующих workflow

**1. `quality-gate.yml` — поломан под pnpm-репозиторий**
- `cache: 'npm'` + `npm ci`, но проект `packageManager: pnpm@10.33.0` и есть только `pnpm-lock.yaml` → CI либо падает, либо ставит мусор.
- `|| true` на ESLint и Semgrep — гейт ничего не блокирует. I-05 (`parseFloat` на деньгах) сейчас не enforced.
- TS-чек только для `packages/ui`, игнорирует `web-next`, `web-vite`, `mobile`, `shared`.
- Нет turbo cache → каждый PR строит всё с нуля.

**Фикс (минимально):**
```yaml
- uses: pnpm/action-setup@v4
  with: { version: 10.33.0 }
- uses: actions/setup-node@v4
  with: { node-version: '20', cache: 'pnpm' }
- run: pnpm install --frozen-lockfile
- run: pnpm typecheck    # turbo run typecheck — все пакеты
- run: pnpm lint         # без || true
- run: pnpm test         # без || true
- run: pnpm semgrep      # уже есть в scripts, без || true
```
Плюс turbo remote cache (`TURBO_TOKEN`/`TURBO_TEAM` в secrets) — экономит 60–80% времени на повторных PR.

**2. `claude.yml` — нет permissions, нет sticky-комментов**
Добавить `permissions: { contents: read, pull-requests: write, issues: write }` (least privilege) и закрепить модель `claude-opus-4-7` в action inputs. Сейчас action бежит с дефолтными правами токена — потенциальный риск.

## Новые workflow, которые реально нужны

**3. `pr-review.yml` — авто-ревью без @-mention**
Сейчас Claude отвечает только на `@claude` в комменте. Для системного PR-review нужен второй workflow на `pull_request: [opened, synchronize]`, запускающий Claude с фокусом «I-05, PSD2 SCA flow, AI-badge на AI-контенте, font-mono на суммах». Это закрывает блок 3 из вашего CLAUDE.md (правила для AI/денег/a11y) автоматически.

**4. `build-check.yml` — отдельный matrix-build**
`pnpm build` сейчас не запускается в CI вообще. Matrix по `[web-next, web-vite, storybook, design-tokens]` с path-filter (`paths-ignore: ['docs/**', '*.md']`) — ловит сломанный Next.js build до merge, плюс собирает Storybook как артефакт для дизайн-ревью (можно деплоить на Vercel preview).

**5. `a11y.yml` — отдельный гейт по jest-axe**
`pnpm test:a11y` уже есть в scripts, но не вызывается в CI. Вынести в отдельный job (не падающий весь quality-gate) с PR-комментом по нарушениям WCAG AA — закрывает требование «axe-core 0 critical» из БЛОКа 8.

**6. `dependency-review.yml` — встроенный GitHub action**
`actions/dependency-review-action@v4` — блокирует PR с GPL/AGPL зависимостями и known CVE. Для FCA-регулируемого продукта это must-have, конфигурится в 5 строк.

**7. `bundle-size.yml`**
`@next/bundle-analyzer` или `pkg-size-action` — алерт при росте бандла >5%. Banking UI с N клиентов — bundle bloat = реальные деньги в CDN/perf.

## Чего НЕ делать (антипаттерны для этого репо)

- **Не добавлять Playwright/Cypress сейчас** — нет E2E happy-path определённого, mocks через MSW, прототип-режим. Сначала нужен один golden-flow per screen, потом E2E.
- **Не включать auto-merge от Claude** — banking, FCA audit trail требует человеческого approval на merge.
- **Не дублировать semgrep как отдельный workflow** — уже в quality-gate, нужен только фикс `|| true`.

## Рекомендуемый порядок

1. Починить pnpm + убрать `|| true` в `quality-gate.yml` (15 мин, разблокирует I-05)
2. Добавить `permissions:` в `claude.yml` (2 мин, безопасность)
3. Добавить `pr-review.yml` для авто-ревью (закрывает CLAUDE.md правила без @-mention)
4. Добавить `dependency-review.yml` (FCA-релевантно)
5. `build-check.yml` с turbo cache
6. `a11y.yml` + `bundle-size.yml` — когда основа стабильна

Хочешь — применю #1 и #2 сразу (это явные баги), остальное по твоему сигналу?
