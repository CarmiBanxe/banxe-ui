## Рекомендуемые MCP для banxe-ui

**Уже подключены и работают:**
- ✓ **context7** — свежие доки React/Next/Tailwind/Expo (используй `use context7` в промпте)
- ✓ **figma** — чтение дизайн-токенов и компонентов из Figma
- ✓ **storybook** — компоненты `@banxe/ui` как контекст (анти-галлюцинация)
- ✓ **Notion** — документация, IL-записи, спеки

**Требуют авторизации (стоит подключить):**
- ! **Atlassian Rovo** — если используете Jira/Confluence для тикетов
- ! **Google Drive** — если там лежат регуляторные доки (FCA/PSD2)

## Приоритет по задачам UI-репо

| Задача | MCP |
|--------|-----|
| Новый экран (W-01..W-06) | storybook + figma + context7 |
| Компонент `@banxe/ui` | storybook + context7 |
| Дизайн-токены | figma |
| Next.js 16 / Expo SDK 53 миграция | context7 (критично — свежие API) |
| Спеки экранов / IL-записи | Notion |

## Чего **не хватает** под ваш стек

- **Supabase MCP** — если бэкенд banxe-emi-stack на Postgres (есть skill `supabase-postgres-best-practices`, но MCP даст live-схему)
- **Vercel MCP** — для деплоев `web-next` (сейчас через CLI/skills)
- **Playwright/Chrome DevTools MCP** — для a11y-аудита экранов в браузере (WCAG 2.1 AA — non-negotiable)

Хочешь — настрою недостающие через `/setup-mcp` или вручную в `.claude/settings.json`?
