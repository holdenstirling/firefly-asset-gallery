# Firefly Asset Gallery

A team-internal tool for browsing, organizing, and remixing generative assets —
inspired by Adobe Firefly. Built with Next.js 16, TypeScript, Tailwind v4, and
shadcn-style UI primitives.

This repo doubles as a live-demo vehicle for showcasing Cursor's
**Ask → Plan → Build** workflow plus Cloud Agents and Bugbot.

![Firefly Asset Gallery](https://picsum.photos/seed/firefly-cover/1280/400)

## What's in here

| Page | Status | Purpose |
|------|--------|---------|
| `/` (Gallery) | working | Masonry asset grid, prompt bar, style filters, asset detail modal |
| `/collections` | working | Curated asset boards |
| `/prompts` | working | Recent prompt history |
| `/style-studio` | working | Define reusable Style presets with preview, apply, and token export |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # vitest run
npm run build        # production build
```

No environment variables are required. All "generated" imagery is mocked via
[Lorem Picsum](https://picsum.photos) — seeded URLs make the gallery
deterministic across reloads.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript** strict mode
- **Tailwind CSS v4** with HSL-token theme
- **Radix UI** primitives wrapped in shadcn-style components
- **Zustand** for client state
- **Vitest** + Testing Library

## Project structure

```
src/
├── app/                Routes (App Router)
├── components/         Feature components + UI primitives
└── lib/                Types, mock data, utils, picsum URL builder, stores
```

See `AGENTS.md` for full conventions and `.cursor/rules/` for the rules every
agent run picks up automatically.

## Live-demo flow

This repo is staged for a Cursor kickoff demo:

1. **Ask mode** — explore the codebase: "How does the gallery render assets?
   Where do parameters get stored?"
2. **Plan mode (Opus)** — generate a structured `plan.md` for the Style Studio
   feature.
3. **Edit `plan.md`** — add constraints, change scope, sign off.
4. **Build mode (Composer)** — execute the plan in the IDE.
5. **Cloud Agent (from Slack)** — fan out a separate task in parallel
   (e.g. "add Playwright e2e tests for the colors page").
6. **Bugbot** — review the resulting PR.
7. **Rules + Skills** — capture the workflow as a reusable Skill for the team.

## Intentional rough edges

One thing remains deliberately unfinished so it can be fixed live:

- Favorites don't persist across reloads.

This is documented in `AGENTS.md`.
