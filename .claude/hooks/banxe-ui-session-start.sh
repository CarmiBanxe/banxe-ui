#!/usr/bin/env bash
echo "BANXE AI BANK | Branch: $(git branch --show-current)"
echo "Dark theme: #0D1B2A/#2563EB/#F59E0B | Use Tremor + Storybook MCP"
if [ -f .claude/sprint-context.md ]; then
  cat .claude/sprint-context.md
else
  echo "No sprint context"
fi
