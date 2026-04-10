# MCP Integration Guide — BANXE AI BANK

## Quick Setup
```bash
bash .claude/mcp-setup.sh
bash .claude/plugins-setup.sh
```

## Figma MCP
```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```
Required: `FIGMA_API_TOKEN` in environment (figma.com → Settings → Personal access tokens)

## Context7 MCP
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```
Provides instant library docs lookup (React, Tailwind, Tremor, etc.)

## Storybook MCP
```bash
cd storybook && npm run storybook
claude mcp add storybook-mcp --transport http http://localhost:6006/mcp --scope project
```
Requires Storybook running on :6006 with `experimental_componentManifest: true`

## Verification
```bash
claude mcp list
claude plugin list
```

## Plugins
| Plugin | Purpose | Install |
|--------|---------|---------|
| Pro-Workflow | Session memory across conversations | `claude plugin install rohitg00/pro-workflow` |
| BMAD Method | Agile AI-driven development workflow | `npx bmad-method install` |
