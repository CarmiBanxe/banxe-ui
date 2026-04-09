Run full quality gate for banxe-ui:

npx tsc --noEmit -p apps/web/tsconfig.json

npx eslint packages/ui/src apps/web/src --ext .ts,.tsx --max-warnings 0

npx vitest run --coverage --reporter=verbose

semgrep --config .semgrep/banxe-ui-rules.yaml apps/web/src packages/ui/src --error

Report results as table with pass/fail for each step
