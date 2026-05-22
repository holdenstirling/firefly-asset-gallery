# Brand Palette Extractor (HOL-7) — Plan

## Goal

Ship a `/palette-extractor` workflow where an operator pastes an image URL, extracts a 3, 5, or 7 color brand palette client-side via `<canvas>` + `getImageData()`, copies swatch hex values, and saves the result as a new Style preset. Saved extracted styles must appear in Style Studio immediately and apply through the existing Style Studio "Apply" path. No new runtime dependencies — only standard Web APIs.

## Constraints

- **Performance budget — extraction must complete in under 100ms on a 1024×1024 source image.** Implementation: in [`src/app/palette-extractor/page.tsx`](src/app/palette-extractor/page.tsx), after the source image loads, draw it to an offscreen canvas sized to a max of 96×96 (preserving aspect ratio — scale the longer edge to 96, scale the other proportionally), then call `getImageData()` on that downsampled canvas and pass the result to `extractDominantColors`. The pure utility's signature is unchanged; downsampling is a page-level responsibility so the histogram only ever processes ≤9,216 pixels regardless of source size.

## Decisions baked in

1. **Type extension** — [`src/lib/types.ts`](src/lib/types.ts) gains optional `customPalette: { swatches: string[] }` on `StudioStyle`. `StyleCard` in [`src/app/style-studio/page.tsx`](src/app/style-studio/page.tsx) branches on its presence: when set, render inline-style hex chips (`<span style={{ backgroundColor: hex }}>`) and a `Custom palette · N swatches` label; when unset, keep today's `palette.swatchClasses` token-backed render. Inline `style` is a justified exception to the "no inline style" guidance because the value is user-derived palette data, not a brand color choice — call this out in the PR description.
2. **Out of scope (HOL-7)** — Style picker in `PromptBar`. Saved extracted palettes apply through the existing Style Studio "Apply" path only. The original ticket text "selectable in the Gallery prompt bar" is narrowed accordingly; revisit in a follow-up ticket.

## Files to change

- [`src/lib/types.ts`](src/lib/types.ts) — extend `StudioStyle` with an optional `customPalette: { swatches: string[] }` field. Non-breaking for seeded styles and built-in palettes (they never set `customPalette`).
- [`src/lib/style-studio.ts`](src/lib/style-studio.ts) — thread `customPalette` through `buildStudioStyle` (accept it as an optional input, pass through). Update `styleToJsonTokens` and `styleToCssTokens` so that, when `customPalette` is present, the exported `palette.primary/secondary/accent` and `--style-*-color-*` values come from `customPalette.swatches[0..2]` instead of the built-in `paletteId` token values.
- [`src/lib/store.ts`](src/lib/store.ts) — add `addStyleFromPalette({ name, swatches })` to `useStyleStudioStore`. It is the single persistence path for the extractor page: builds a `StudioStyle` via `buildStudioStyle` with `paletteId: "firefly"`, `typographyId: "product"`, `parameters: DEFAULT_GENERATION_PARAMETERS`, and `customPalette: { swatches }`, then upserts it (reusing the existing `saveStyle` upsert behavior) and sets it as the active style.
- [`src/app/style-studio/page.tsx`](src/app/style-studio/page.tsx) — `StyleCard` branches on `style.customPalette`. When present, render swatches as inline-style hex chips (`<span style={{ backgroundColor: hex }}>`) and label the card with the swatch count instead of the built-in palette name. When absent, keep the existing `palette.swatchClasses` token-backed render.
- [`src/components/layout/sidebar.tsx`](src/components/layout/sidebar.tsx) — append `{ href: "/palette-extractor", label: "Palette Extractor", icon: Palette, badge: "New" }` to `NAV`. Style Studio already uses the `Palette` icon; keep the duplicate per the ticket's explicit instruction.

## Files to create

- [`src/lib/palette-extraction.ts`](src/lib/palette-extraction.ts) — pure utility:
  - `extractDominantColors(imageData: ImageData, k: number): string[]`
  - Algorithm: iterate `ImageData.data` (RGBA), skip pixels with `a < 128`, quantize each channel to a coarse bucket (5-bit quantization → 32 buckets per channel), key by `r|g|b` bucket, accumulate count + summed RGB, then sort buckets by count descending, take top `k`, and format the average bucket color as `#rrggbb` (lowercase, zero-padded). Pure function, no DOM access — easily unit-testable with synthetic `ImageData`.
- [`src/lib/__tests__/palette-extraction.test.ts`](src/lib/__tests__/palette-extraction.test.ts) — Vitest coverage (see Tests section).
- [`src/app/palette-extractor/page.tsx`](src/app/palette-extractor/page.tsx) — `"use client"` page. Owns local state for URL, swatch count (3/5/7, default 5), load status (`idle | loading | ready | error`), extracted swatches, save name input, and saved confirmation. Uses an `HTMLImageElement` with `crossOrigin="anonymous"` and an offscreen `<canvas>` (via `useRef`) sized per the Constraints section to drive `getImageData`. Default URL is a curated `picsumUrl({ seed: "palette-extractor-hero", width: 1024, height: 768 })`.

## Implementation steps

1. Extend `StudioStyle` with optional `customPalette: { swatches: string[] }` in [`src/lib/types.ts`](src/lib/types.ts). Confirm `npm run build` and `npm test` still pass with no other changes — guarantees the new field is non-breaking.
2. Build [`src/lib/palette-extraction.ts`](src/lib/palette-extraction.ts) with `extractDominantColors`. Add [`src/lib/__tests__/palette-extraction.test.ts`](src/lib/__tests__/palette-extraction.test.ts) covering the cases below. Run `npm test`.
3. Thread `customPalette` through `buildStudioStyle`, `styleToJsonTokens`, and `styleToCssTokens` in [`src/lib/style-studio.ts`](src/lib/style-studio.ts). Add a test asserting that token export prefers `customPalette.swatches` when present and falls back to `paletteId` token values when absent. Run `npm test`.
4. Add `addStyleFromPalette` to `useStyleStudioStore` in [`src/lib/store.ts`](src/lib/store.ts). Reuse the existing upsert semantics — call `buildStudioStyle` with the defaults above and route through the same code path as `saveStyle`. Set the new style as `activeStyleId` so it shows up selected in Style Studio's saved list.
5. Branch `StyleCard` in [`src/app/style-studio/page.tsx`](src/app/style-studio/page.tsx) on `style.customPalette`. For custom palettes, render hex swatches via inline `backgroundColor`, derive a small footer label (`"Custom palette · N swatches"`), and skip the built-in `palette.name` chip. Built-in styles render exactly as today.
6. Build `/palette-extractor`:
   - Two-column responsive layout: source image on the left, palette + controls on the right; collapses to single column under `lg`.
   - Controls: URL `<Input>`, swatch count segmented buttons (3/5/7 — reuse the existing aspect-ratio button pattern from Style Studio for visual consistency), "Extract palette" button.
   - On extract: set status `loading`, attach an `Image()` with `crossOrigin="anonymous"` and `src = url`, on `load` draw to a hidden offscreen canvas **sized per Constraints** (`min(96, naturalWidth)` × proportionally-scaled height, preserving aspect ratio), call `getImageData`, run `extractDominantColors`, set `status = "ready"`. The full-resolution `Image` is only used as the `drawImage` source; the operator-facing source preview still renders the original URL via `next/image` for fidelity.
   - On `error` (`onerror`, or canvas read throws because of CORS taint), set `status = "error"` with a clear message that distinguishes "couldn't load" vs "blocked by CORS".
   - Skeleton: `animate-pulse` panels for the image and the swatch row while status is `loading`.
7. Render the palette: one row of swatches, each with an inline `backgroundColor`, the hex value below in mono, and a copy-to-clipboard button (`navigator.clipboard.writeText`) with a transient "Copied" affordance, mirroring the existing Style Studio copy UX.
8. Save flow: text `<Input>` for the style name (default `"Extracted Palette"`), "Save as Style" `<Button>` that calls `addStyleFromPalette({ name, swatches })`. On success, show an inline confirmation that links to `/style-studio` and explicitly tells the operator: "Available in Style Studio. Use Apply there to push it to the gallery."
9. Add the sidebar nav entry in [`src/components/layout/sidebar.tsx`](src/components/layout/sidebar.tsx).
10. Run `npm run lint`, `npm test`, and `npm run build`. Fix any failures before declaring done.

## Tests

- **Unit — [`src/lib/__tests__/palette-extraction.test.ts`](src/lib/__tests__/palette-extraction.test.ts):**
  - returns `k` colors when given a synthetic `ImageData` with at least `k` distinct buckets (cases for 3, 5, 7).
  - returns `#rrggbb` lowercase strings (regex assertion).
  - returns `[]` (or fewer than `k`) when given empty pixel data / fully transparent pixels.
  - sorts results by frequency: a synthetic image dominated by red returns red first.
- **Unit (extension) — [`src/lib/__tests__/style-studio.test.ts`](src/lib/__tests__/style-studio.test.ts):**
  - `buildStudioStyle` round-trips `customPalette` when supplied.
  - `styleToJsonTokens` and `styleToCssTokens` use `customPalette.swatches` for the primary/secondary/accent slots when present, and fall back to `paletteId` token values when absent.
- **Component:** no dedicated component test for `/palette-extractor` in v1. The page is mostly browser canvas/clipboard orchestration that's awkward to mock; manual verification + the pure-utility unit tests cover the risky logic. If `StyleCard` grows complexity from the branching, extract it and add a render test asserting both branches.
- **E2E:** not planned for HOL-7 v1. Manual verification checklist:
  1. Page loads with the curated default URL and renders an extracted palette.
  2. Swapping the URL to another valid Picsum URL updates the palette.
  3. Switching swatch count between 3/5/7 re-extracts.
  4. Each swatch's copy button writes the hex to the clipboard.
  5. "Save as Style" creates a new style; navigating to `/style-studio` shows it in the saved list with hex swatches and the "Apply" button works.
  6. Invalid URL → error state. Cross-origin URL that taints the canvas → error state with a CORS-specific message.
  7. **On a 1024×1024 Picsum URL the extraction completes in under 100ms.** Measure with `performance.now()` around the `getImageData` + `extractDominantColors` block during manual verification; log the elapsed ms to the console and record the figure in the PR description.

## Out of scope

- File upload — URL input only for v1.
- Saving the source image to the asset library.
- Color harmony generation (complementary, triadic, analogous, etc.).
- WCAG contrast checking on extracted palettes.
- **Style picker in `PromptBar`.** Per kickoff decision: saved extracted palettes apply through the existing Style Studio "Apply" path only. The original ticket AC mentions "selectable in the Gallery prompt bar" — that's been narrowed to the Style Studio Apply path for HOL-7. Re-add a prompt-bar style picker in a follow-up ticket if there's user demand.
- k-means or perceptual color clustering. Histogram bucketing in RGB space is sufficient for a 5-swatch palette and runs in milliseconds — keep it simple.

## Acceptance criteria check

- [ ] New route at `/palette-extractor` accessible from the left sidebar with a `New` badge.
- [ ] Image URL input with an "Extract palette" button. Defaults to a curated Picsum URL so the page isn't empty on first load.
- [ ] Renders the source image alongside the extracted palette. Layout responsive.
- [ ] Color extraction runs client-side via `<canvas>` + `getImageData()`. No new runtime dependencies.
- [ ] Swatch count selector with options 3, 5, 7. Default 5.
- [ ] Each swatch shows its hex value and copy-to-clipboard affordance.
- [ ] "Save as Style" button prompts for a name and creates a new Style in the existing Style Studio store via `addStyleFromPalette`.
- [ ] Saved extracted styles appear in Style Studio immediately and are applied through the existing Style Studio "Apply" path. *(Narrowed from the ticket's "selectable in the Gallery prompt bar" — see Out of scope.)*
- [ ] Loading skeleton while the image loads or extraction runs.
- [ ] Error state when the image URL is invalid, blocked by CORS, or fails to load.
- [ ] Extraction completes in under 100ms on a 1024×1024 source image (96×96 offscreen downsample before histogram bucketing).
- [ ] Vitest coverage for `extractDominantColors`: returns N colors, returns hex strings, handles empty pixel data.
- [ ] All existing tests still pass (`npm test`, `npm run build`).
