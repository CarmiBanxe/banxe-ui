#!/usr/bin/env bash
set -euo pipefail
echo "=== BANXE AI BANK — Plugins Setup ==="

# Pro-Workflow (session memory)
echo "Step 1: Pro-Workflow"
claude plugin install rohitg00/pro-workflow 2>/dev/null || echo "⚠️ Pro-Workflow — install manually: claude plugin install rohitg00/pro-workflow"

# BMAD Method (Agile AI-Driven Development)
echo "Step 2: BMAD Method"
npx bmad-method install 2>/dev/null || echo "⚠️ BMAD — install manually: npx bmad-method install"

echo "=== Plugins Setup Complete ==="
