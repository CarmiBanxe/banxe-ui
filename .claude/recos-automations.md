## Claude Code Automation Recommendations — `banxe-ui`

### Codebase Profile
- **Type**: pnpm + Turbo monorepo, TS 5.4 strict
- **Apps**: web-next (Next.js 16), web-vite (React 18 + Vite 5), mobile (Expo SDK 53)
- **Stack**: Tailwind, Storybook v8, Vitest, jest-axe, MSW v2, Semgrep
- **Already configured**: MCPs (context7, figma, storybook), SessionStart + PreToolUse(inject-design-rules) + PostToolUse hooks, ~19 design/UI skills, 6 slash-commands
- **Biggest gap**: zero subagents (`.claude/agents/` отсутствует), нет post-edit typecheck/lint, нет money-safety guard

---

### 🤖 Subagents (highest leverage — пусто сейчас)

#### 1. `money-safety-reviewer`  *(I-05 invariant)*
**Why**: FCA non-negotiable — `parseFloat / Number / toFixed` на деньгах = compliance breach. Сейчас не enforced на ревью.
**Where**: `.claude/agents/money-safety-reviewer.md`
**Scope**: grep по `apps/**/src`, `packages/ui/src` → `parseFloat\(|Number\(.*amount|toFixed\(`, проверка что суммы остаются `string` до отображения, `font-mono` класс присутствует.

#### 2. `ai-content-reviewer`
**Why**: CLAUDE.md обязует `✦ AI` badge + `ConfidenceIndicator` + UNCERTAIN warning + static notice + audit log на каждом AI-блоке. Это легко пропустить вручную.
**Where**: `.claude/agents/ai-content-reviewer.md`
**Scope**: AIInsightCard usages, любые компоненты с AI-данными → checklist 5 пунктов из БЛОК 3.

---

### ⚡ Hooks

#### 1. PostToolUse: typecheck + ESLint changed file
**Why**: strict TS + `eslint-plugin-jsx-a11y` сконфигурированы, но post-edit прогоняется только `inject-design-rules`. Tight feedback loop = меньше "почему build red".
**Where**: `.claude/settings.json` → PostToolUse `Write|Edit`
```bash
pnpm exec tsc --noEmit --pretty false 2>&1 | tail -20 && pnpm exec eslint "$CLAUDE_FILE_PATHS" --max-warnings 0
```

#### 2. PreToolUse: I-05 money-safety guard
**Why**: блокирует commit запрещённых паттернов до того, как они попадают в код. Дешевле чем post-mortem ревью.
**Where**: `.claude/hooks/i05-guard.py` + PreToolUse `Write|Edit`
**Logic**: deny если в `new_string` есть `parseFloat(` / `\.toFixed\(` / `Number\(.*(amount|balance|price)` И путь под `apps/**/src/**|packages/ui/src/**`.

---

### 🎯 Skills

#### 1. `psd2-2step-confirm`  *(user-invocable)*
**Why**: PSD2 SCA — обязательный 2-step (review → confirm) на каждом payment flow. Сейчас нет шаблона — каждый раз пишется заново.
**Create**: `.claude/skills/psd2-2step-confirm/SKILL.md` + `templates/ReviewStep.tsx`, `ConfirmStep.tsx`
**Invocation**: `/psd2-2step-confirm <flow-name>`

#### 2. `money-safety-check`  *(Claude-only, `disable-model-invocation: false`, `user-invocable: false`)*
**Why**: то же I-05, но как callable knowledge — Claude автоматически сверяется при касании денежных полей вместо повторения правил в каждом промпте.

---

### 🔌 MCP Servers

#### 1. Playwright MCP
**Why**: W-01..W-06 экраны существуют, но E2E не упомянут. Banking flows (Send, AI, KYC) нуждаются в browser-driven smoke tests; Playwright MCP позволит Claude писать и гонять их вживую.
**Install**: `claude mcp add playwright npx '@playwright/mcp@latest'`

#### 2. GitHub MCP
**Why**: репо `CarmiBanxe/banxe-ui`, уже есть `/banxe-ui-review-pr` и PR-review automation. Нативный MCP даст Claude читать PR diffs/checks без bash-обёрток.
**Install**: `claude mcp add github -- gh-mcp-server` (требует `gh` CLI auth).

---

**Want more?** Скажи категорию — выдам ещё 3-5 опций (например, "ещё хуки" или "ещё subagents").
**Want help implementing?** Могу сразу написать любой из этих файлов — начни с `money-safety-reviewer` (самый высокий ROI: блокирует FCA-breach до review).
