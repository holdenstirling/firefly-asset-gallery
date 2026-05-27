# HOL-8 — Style preset import/export (JSON)

The Linear ticket the Cursor 201 live build will execute against. Copy
the body below into Linear before the demo (or use as-is if the
audience is fine with the markdown view).

The ticket is the natural follow-up to Style Studio (HOL-5) and the
Brand Palette Extractor (HOL-7) — both shipped — and exercises every
artifact in the new toolkit plugin: `/scope-ticket`, `linear-feature-flow`,
the three hooks, the design-tokens MCP server (in passing), `/review-pr`,
and `pr-summary`.

---

## Linear ticket body

**Title:** Style preset import/export — share Style Studio presets across
machines via JSON

**Problem**

Style Studio presets are persisted to the browser's `localStorage` via
the `useStyleStudioStore` (see `src/lib/store.ts`). That keeps the state
in one place, but it traps presets on whichever device created them. A
creative director who hand-tunes a campaign style on their laptop can't
hand it to a producer working in a different browser without rebuilding
it from scratch.

We need a portable, file-based exchange format so presets can travel
between machines, get shared in Slack, and live in version control if a
team chooses to ship a "brand-approved" set of starter styles.

**Acceptance criteria**

- AC1 — A user can download the currently-active preset as a `.json`
  file from the Style Studio page. The filename is derived from the
  preset name (slugged), e.g. `launch-glow.style.json`.
- AC2 — A user can import a preset by dragging a `.json` file onto a
  designated drop zone in Style Studio, OR by pasting JSON into a
  text area and clicking "Import." Both paths produce the same result.
- AC3 — Importing a valid preset adds it to the user's saved-presets
  list as a new entry (does not silently overwrite an existing
  preset of the same name — the import gets a suffixed name like
  `Launch Glow (imported)`).
- AC4 — Importing an invalid JSON document shows an inline error
  message describing what's wrong. Examples: "Not valid JSON",
  "Missing required field: name", "paletteId 'space' is not in the
  allowlist." The import is rejected and the user's existing presets
  are untouched.
- AC5 — The exported JSON includes all the fields needed to faithfully
  reconstruct a `StudioStyle` — `name`, `description`, `paletteId`,
  `typographyId`, and the full `parameters` object. It does NOT
  include `id`, `createdAt`, or `updatedAt` — those get regenerated
  on import.
- AC6 — Unit tests cover the export and import functions with at
  least: a happy-path round-trip, an invalid-JSON case, a missing-
  field case, a closed-enum-violation case (paletteId / typographyId
  not in the allowed values), and a name-collision case.

**Out of scope**

- No bulk export (one preset per file for this ticket — multi-preset
  export is a follow-up).
- No remote sharing surface (Slack message preview, URL-based share,
  etc.) — file download/upload only.
- No diffing or merging of imported presets against existing ones —
  always treated as a new entry.
- No backwards-compat versioning yet — current schema version is
  embedded in the file as `schemaVersion: "1.0"` so we have a hook
  for future migrations.

**Technical notes**

- Implementation should live in a new `src/lib/style-preset-io.ts`
  utility, with matching `src/lib/__tests__/style-preset-io.test.ts`.
- Reuse `buildStudioStyle` from `src/lib/style-studio.ts` for
  reconstructing the imported style — don't duplicate the ID and
  timestamp generation logic.
- The Style Studio page (`src/app/style-studio/page.tsx`) currently
  has a "Save preset" action; add Import and Export buttons next to
  it. Use the same shadcn-style button + dialog primitives already
  in use.
- For the file drop zone, a `<input type="file" accept="application/json">`
  inside a styled label is enough. Don't pull in a drag-and-drop
  library.
- Validation should fail loud and early. Use type guards in
  `style-preset-io.ts`; don't trust the JSON.

**Definition of done**

- [ ] AC1 through AC6 met
- [ ] `npm test` passes (vitest)
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] PR opened as draft with a `pr-summary`-formatted description

---

## Why this ticket was chosen for the 201 live build

- **Pure frontend, small scope.** Composer should finish in 3-5 min,
  fitting the runbook's section-5 budget.
- **Exercises every plugin artifact.** `/scope-ticket` for Ask,
  `linear-feature-flow` for Plan + Build, `afterFileEdit` hook on
  every Vitest write, `beforeShellExecution` hook if Composer
  attempts something destructive, `/review-pr` pre-PR, `pr-summary`
  for the body. The audience sees the four axes + the two scaling
  primitives fire in one task.
- **Builds on shipped work.** Style Studio (HOL-5) and palette
  extractor (HOL-7) are both in `main`. HOL-8 stitches them — the
  presets being imported/exported are the same `StudioStyle` shape
  HOL-5 introduced.
- **Adobe-flavored conclusion.** A creative director hand-tunes a
  style; an external collaborator imports it. That's the exact
  Creative Cloud workflow story the audience cares about.

## Hand-edit constraint for the live demo

Following the lesson from the 101 dry-run (constraints must ADD to
the ticket, not contradict it), the recommended Plan-mode hand-edit
inserts a Constraints section near the top of the generated
`plan.md`:

```markdown
## Constraints

- Import must run synchronously (no Promise.then chains) so a thrown
  error from the validator surfaces immediately as a React error
  boundary catch rather than an unhandled rejection.
- Validation must produce machine-readable error codes, not just
  English strings — downstream tooling (the planned Slack share
  workflow) needs them.
```

Both add detail the ticket doesn't speak to and both are verifiable
on stage when Composer's output contains those exact decisions.
