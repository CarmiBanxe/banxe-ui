#!/usr/bin/env bash
set -euo pipefail
echo "=== BANXE AI BANK — Headless Build Pipeline ==="

echo "Step 1: Install dependencies"
npm ci

echo "Step 2: TypeScript check"
npx tsc --noEmit -p apps/web/tsconfig.json

echo "Step 3: ESLint"
npx eslint packages/ui/src apps/web/src --ext .ts,.tsx --max-warnings 0

echo "Step 4: Vitest"
npx vitest run --coverage --reporter=verbose

echo "Step 5: Semgrep"
pip install semgrep 2>/dev/null || true
semgrep --config .semgrep/banxe-ui-rules.yaml apps/web/src packages/ui/src --error

echo "Step 6: Build"
cd apps/web && npx vite build && cd ../..

echo "=== BUILD COMPLETE ==="
