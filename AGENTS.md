# Firefly Asset Gallery — Agent Instructions

A team-internal tool for browsing, organizing, and remixing generative assets.
Built with Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 +
shadcn-style UI primitives.

## Project conventions

- **Language:** TypeScript, strict mode. Avoid `any`. Prefer `unknown` and
  narrow with type guards.
- **Components:** Function components only. Co-locate component files under
  `src/components/<feature>/`. Use `"use client"` only when the component
  truly needs client-side state, effects, or browser APIs.
- **Styling:** Tailwind utilities via `cn()` from `@/lib/utils`. CSS variables
  in `src/app/globals.css` are the source of truth for color tokens. Never
  hardcode hex colors in components.
- **State:** Local UI state with `useState`. Cross-component client state with
  Zustand stores in `@/lib/store.ts`.
- **Data:** Mock data lives in `@/lib/mock-data.ts`. Image URLs come from
  `picsumUrl()` in `@/lib/picsum.ts` — never inline picsum URLs in components.
- **Icons:** `lucide-react` only.
- **Tests:** Vitest + Testing Library. Co-locate tests under
  `src/<area>/__tests__/` mirroring the source structure.

## What lives where

```
src/
├── app/                 # Next.js App Router routes
│   ├── page.tsx         # Gallery (home)
│   ├── collections/
│   ├── prompts/
│   └── style-studio/    # Style preset definition + token export (shipped HOL-5)
├── components/
│   ├── layout/          # Sidebar, top nav
│   ├── gallery/         # AssetCard, AssetGrid, AssetDetail, GalleryToolbar
│   ├── prompt/          # PromptBar, PromptHistory
│   ├── parameters/      # ParameterPanel
│   └── ui/              # shadcn-style primitives
└── lib/
    ├── types.ts         # Asset, Collection, GenerationParameters, etc.
    ├── mock-data.ts     # Seed data
    ├── picsum.ts        # Image URL builder (Lorem Picsum)
    ├── store.ts         # Zustand stores
    └── utils.ts         # cn(), formatRelativeTime()
```

## Known intentional rough edges

These exist on purpose so they can be addressed during a live demo:

1. **Parameter panel does not feed into generation.** The panel updates the
   Zustand store, but `PromptBar.handleGenerate()` only logs the values.
2. **Favorites are not persisted.** `useFavoritesStore` is in-memory only;
   reload resets state.

## Commands

```bash
npm run dev    # start dev server (Turbopack)
npm run build  # production build
npm test       # run Vitest once
npm run test:watch
npm run lint
```

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
