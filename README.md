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

## Run the app locally, step by step

No environment variables are required. All "generated" imagery is mocked via
[Lorem Picsum](https://picsum.photos) — seeded URLs make the gallery
deterministic across reloads.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install the Playwright browser runtime**

   Run this once on a new machine, or whenever Playwright reports that a browser
   executable is missing.

   ```bash
   npx playwright install --with-deps chromium
   ```

3. **Start the frontend dev server**

   ```bash
   npm run dev
   ```

   The site runs at [http://localhost:3000](http://localhost:3000). Keep this
   terminal open while reviewing UI changes.

4. **Open and manually review the frontend**

   Yes — for UI changes, we should showcase the frontend locally before calling
   the work done. Use the browser to check the affected route and capture a
   screenshot or short demo if the change is visual. Common routes are:

   - [http://localhost:3000](http://localhost:3000) — Gallery
   - [http://localhost:3000/collections](http://localhost:3000/collections) — Collections
   - [http://localhost:3000/prompts](http://localhost:3000/prompts) — Prompt history
   - [http://localhost:3000/style-studio](http://localhost:3000/style-studio) — Style Studio

   For the gallery page, a quick smoke review is:

   1. Type in the search box and confirm the asset grid narrows.
   2. Click a style chip and confirm only matching assets remain.
   3. Click **clear** and confirm the full grid returns.
   4. Click an asset card and confirm the detail modal opens.
   5. Close the modal and confirm focus returns to the card you opened.

5. **Run automated checks**

   ```bash
   npm test
   npm run lint
   npm run build
   npm run test:e2e
   ```

   Use the focused command first while iterating, then run the full set before
   opening or updating a PR.

6. **Preview the production build locally, if needed**

   ```bash
   npm run build
   npm run start
   ```

   This serves the optimized app at [http://localhost:3000](http://localhost:3000).
   Stop the dev server first if it is already using port 3000.

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
