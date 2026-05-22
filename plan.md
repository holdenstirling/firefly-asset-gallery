# Brand Palette Extractor — Plan

## Goal
Ship the Brand Palette Extractor as a new route at `/palette-extractor`. The
operator pastes an image URL (Picsum by default), the page renders the source
image alongside an extracted N-color palette (3, 5, or 7 swatches, default 5),
and "Save as Style" persists the palette as a new entry in the existing Style
Studio store. Extraction runs entirely client-side via `<canvas>` and
`getImageData()` with no new runtime dependencies.

## Constraints
- Color extraction must run in under 100ms on a 1024×1024 image. Downsample
  the source to a max of 96×96 with an offscreen canvas before histogram
  bucketing so the work stays bounded regardless of input size.

## Files to change
- `src/components/layout/sidebar.tsx` — add the `/palette-extractor` nav entry
  with `Palette` Lucide icon and `New` badge.
- `src/lib/types.ts` — extend `StudioStyle` with an optional
  `customPalette?: string[]` field so extracted hex palettes can live next to
  the existing `paletteId` curated swatches without breaking the closed union.
- `src/lib/store.ts` — add `addStyleFromPalette({ name, palette })` to
  `useStyleStudioStore` (and surface it in `StyleStudioState`) so the page
  doesn't duplicate persistence logic.
- `src/lib/style-studio.ts` — extend `buildStudioStyle` (or add a sibling
  builder) to accept a `customPalette: string[]` and stamp it onto the style.
- `src/lib/__tests__/style-studio.test.ts` — assert that the new builder
  pathway round-trips the custom palette into the stored style.
- `src/app/style-studio/page.tsx` — render `customPalette` swatches when
  present on the active style (read-only; editing is out of scope).

## Files to create
- `src/lib/palette-extraction.ts` — pure module exporting
  `extractDominantColors(imageData: ImageData, k: number): string[]` plus
  helpers: `downsampleToMax(image, max)` (returns ImageData via offscreen
  canvas) and `rgbToHex(r, g, b)`. Histogram bucketing in a 5-bit-per-channel
  space (32×32×32 buckets), sort by count, return top-K as `#rrggbb` lowercase.
- `src/lib/__tests__/palette-extraction.test.ts` — Vitest coverage:
  - returns exactly N colors for N = 3, 5, 7
  - returns `#rrggbb` hex strings
  - returns dominant-first ordering by frequency
  - handles empty pixel data without throwing (returns `[]`)
  - clamps `k` to the number of distinct buckets when fewer exist
- `src/app/palette-extractor/page.tsx` — client component:
  1. URL input (default to a curated Picsum URL via `picsumUrl()`)
  2. Swatch-count selector (3/5/7, default 5) using the existing `Select`
     primitive
  3. "Extract palette" button → loads image with `crossOrigin="anonymous"`,
     draws into hidden canvas, calls `extractDominantColors`
  4. Renders source image alongside the swatch row with hex value + a
     copy-to-clipboard button per swatch (Lucide `Copy`/`Check` icons)
  5. Loading skeleton (`shimmer` utility class) during image load + extraction
  6. Error state when load/CORS/decoding fails — show a clear message and a
     "Try again" button
  7. "Save as Style" opens the existing `Dialog` primitive for a name input,
     then calls `addStyleFromPalette({ name, palette })` and shows a confirmation
     toast/inline message linking to Style Studio

## Implementation steps
1. Add `palette-extraction.ts` + unit tests; iterate until tests pass.
2. Extend types + store + style-studio helper; update style-studio tests; run
   `npm test` to confirm no regressions.
3. Add the sidebar entry and verify the existing layout renders.
4. Build the page: URL input + extract pipeline + render swatches.
5. Add loading skeleton + error state + retry.
6. Wire "Save as Style" dialog → store.
7. Surface `customPalette` swatches inside the Style Studio style card so the
   saved palette is visible there.
8. Run `npm run lint`, `npm test`, and `npm run build`.

## Tests
- **Unit:** `src/lib/__tests__/palette-extraction.test.ts` for the extractor
  (count, hex format, ordering, empty data, k clamping).
- **Unit:** `src/lib/__tests__/style-studio.test.ts` — `buildStudioStyle`
  carries `customPalette` through to the stored object when supplied.
- **No new e2e:** Playwright work continues on HOL-6's PR.

## Acceptance criteria check
- [ ] New route at `/palette-extractor` accessible from the left sidebar with a `New` badge.
- [ ] Image URL input with an "Extract palette" button. Default to a curated Picsum URL.
- [ ] Renders source image alongside extracted palette. Layout responsive.
- [ ] Color extraction runs client-side via `<canvas>` + `getImageData()`. No new runtime dependencies.
- [ ] Swatch count selector with options 3, 5, 7. Default 5.
- [ ] Each swatch shows hex value and copy-to-clipboard affordance.
- [ ] "Save as Style" creates a new Style in the Style Studio store.
- [ ] Loading skeleton during image load / extraction.
- [ ] Error state on invalid / blocked / failing image URL.
- [ ] Vitest coverage for the extraction utility.
- [ ] All existing tests still pass.
