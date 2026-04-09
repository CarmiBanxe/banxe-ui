#!/usr/bin/env python3
"""
BANXE AI BANK — Design Rules Injection Hook
Fires on file write/edit to enforce design + security constraints.
"""
import json
import sys

data = json.load(sys.stdin)
filepath = data.get("tool_input", {}).get("file_path", "") or data.get("tool_input", {}).get("path", "")

# Block .env modification (allow .env.example)
if ".env" in filepath and ".env.example" not in filepath:
    print(json.dumps({"decision": "block", "reason": ".env modification blocked — use .env.example"}))
    sys.exit(0)

# Payment / transaction security reminder
if any(p in filepath for p in ("src/features/payments", "src/api/transactions", "src/screens/Send")):
    print("SECURITY: Payment file — ensure parameterized queries, no amount logging, EMI compliance.")
    sys.exit(0)

# Default: design system reminder
print("DESIGN: Dark theme #0D1B2A, primary #2563EB, gold #F59E0B. Use Tremor. WCAG 2.2 AA.")
sys.exit(0)
