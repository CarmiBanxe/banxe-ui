# BANXE AI BANK — Technical Architecture

## Stack
| Layer | Technology |
|-------|-----------|
| Web | React 18, TypeScript strict, Tailwind 3, Tremor, Vite |
| Mobile | React Native 0.74, Expo SDK 52 |
| State | React Context + custom hooks |
| Routing | React Router v6 (lazy-loaded) |
| API | REST typed client (src/api/client.ts) |
| Testing | Vitest, Testing Library, axe-core |
| CI/CD | GitHub Actions quality-gate.yml |
| Security | Semgrep, pre-commit, Claude Code hooks |

## Directory Structure

## Security
- NEVER commit .env or credentials
- NEVER log financial data
- Parameterized queries only
- All async in try/catch
- Payment flows: progressive disclosure (max 3 fields)
