#!/usr/bin/env bash
set -euo pipefail
echo "=== BANXE AI BANK — MCP Setup ==="

# Figma MCP (requires Figma account)
echo "Step 1: Figma MCP"
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp 2>/dev/null || echo "⚠️ Figma MCP — run manually: claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp"

# Context7 MCP (docs lookup)
echo "Step 2: Context7 MCP"
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest 2>/dev/null || echo "⚠️ Context7 MCP — run manually: claude mcp add context7 -- npx -y @upstash/context7-mcp@latest"

# Storybook MCP (requires running storybook on :6006)
echo "Step 3: Storybook MCP"
echo "Start Storybook first: cd storybook && npm run storybook"
echo "Then run: claude mcp add storybook-mcp --transport http http://localhost:6006/mcp --scope project"

echo "=== MCP Setup Complete ==="
echo "Note: Figma MCP requires FIGMA_API_TOKEN in environment"
