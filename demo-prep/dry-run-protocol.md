# Dry-run protocol — HOL-7 (Brand Palette Extractor)

**STATUS: Dry-run completed Thursday afternoon. Fallback branch captured. See "Dry-run results" section at bottom.**

The single highest-leverage pre-Friday task. Goal: rehearse the IDE block end-to-end on a clean branch, time each phase against a clock, surface failure modes, and capture the resulting state as a `dry-run/hol-7-prebuilt` fallback branch.

**Target:** `dry-run/hol-7` branch (pushed, has the merged dry-run work).

**Fallback:** `dry-run/hol-7-prebuilt` (pushed, identical to `dry-run/hol-7`, reserved as the emergency Build-mode-failed swap).

**Time required:** 45-60 minutes for the dry-run itself plus 10 min for the prebuilt-fallback capture.

---

## Goal of the dry-run

By the end, you should know:

1. **How long does Ask actually take?** Listed at 90 sec in runbook. Probably right; verify.
2. **How long does Plan mode with Opus actually take?** Listed at 3 min. This is the variable one — Opus is thorough.
3. **How fast can you hand-edit `plan.md`?** Listed at 30 sec. Practice the *exact constraint phrase* you want to add.
4. **How long does Composer take to execute a typical plan?** Listed at 4 min. If this blows past 6 min, the demo is over-budget.
5. **Does anything visibly break?** Test failures, lint failures, type errors, missing imports.

By the end, you should also have:

- A populated `plan.md` (good output from Opus)
- A working Brand Palette Extractor feature
- All tests passing
- The branch state captured as `dry-run/hol-7-prebuilt` for use as the live-demo fallback

---

## Pre-flight (verify before starting)

- [x] Working tree clean on `dry-run/hol-7` (verified by branch creation)
- [x] `npm test` passes 18/18 (verified on main)
- [x] `motion` package installed (`^12.39.0` in package.json) — fixes Risk B from earlier audit
- [x] `plan.md` placeholder is generic (no longer references Style Studio)
- [ ] **You verify:** Linear MCP write access. Try a small write from inside Cursor: ask the agent to "Set HOL-7's description to itself" (a noop write). If it fails, change the linear-feature-flow skill's Phase 5 to print the AC checklist instead of writing to Linear.
- [ ] **You verify:** Slash commands. Open Cursor's command palette and type `/`. Confirm `/Cursor add new rule` and `/Cursor create skill` (or whatever exact strings work in the current build) are available.
- [ ] **You verify:** Both `Opus` and `Composer` are visible in the model picker for this account.

---

## The three prompts (paste verbatim)

### Phase 1 — Ask mode (target ~90 sec)

Switch to Ask mode. Make sure the model is set to something fast for reading (Composer or GPT-5.5). Paste:

```
Read HOL-7 from Linear. Walk me through:
1. What's being asked (one paragraph)
2. What's already in this codebase that supports it
3. Which files will likely need to change

Don't write code or open the plan file. I want to scope first.
```

**What to watch for:** The agent should identify Style Studio as the existing dependency, surface `src/lib/store.ts` and `/style-studio` page, and not start writing code.

**Timing:** Start clock on paste, stop when agent finishes the summary.

---

### Phase 2 — Plan mode with Opus (target ~3 min)

Switch to **Plan mode**, switch model to **Opus**. Narrate the model switch on screen. Paste:

```
Implement HOL-7 using the linear-feature-flow workflow. Read AGENTS.md, the rules in .cursor/rules/, and src/lib/store.ts before planning. Generate a structured implementation plan into plan.md following the skill's Phase 3 template. Stop after writing plan.md — do not start implementation.
```

**Why this prompt:** The phrase "Implement HOL-7" should trigger the `linear-feature-flow` skill. The explicit reference to Phase 3 anchors the output format. The "stop" instruction enforces the human-in-the-loop gate.

**What to watch for:**
- Agent reads the listed files first
- `plan.md` gets populated with the skill's template (Goal / Files to change / Files to create / Implementation steps / Tests / AC check)
- Agent stops and waits for sign-off

**Timing:** Start clock on paste, stop when `plan.md` is populated and agent yields.

**Red flag:** Agent starts writing code anywhere outside `plan.md`. Stop it immediately, reissue with stronger "READ-ONLY" language.

---

### Phase 3 — Hand-edit `plan.md` (target ~30 sec, this is the headline beat)

Open `plan.md`. Read the goal aloud. Then add ONE constraint by hand. Pick one of:

- **Performance constraint:** *"Color extraction must run in under 100ms on a 1024×1024 image. Use canvas sampling, not pixel iteration."*
- **No-deps constraint:** *"No new runtime dependencies. Use only Web APIs (`<canvas>`, `getImageData`)."*
- **Picsum compat:** *"Must work for any `picsum.photos` URL. Handle CORS via `crossOrigin='anonymous'`."*

**Recommendation:** Use the **no-deps constraint** — it's the most demonstrable in Composer's output (the audience can see the lack of `npm install` step), it's the most opinionated, and it's the easiest one-liner to type while narrating.

**Narration during the edit:**

> *"This is the moment. The plan is a file. I edit it like code. The agent doesn't get autonomy until I sign off."*

**Timing:** Start clock when you open `plan.md`, stop when you say "Execute plan.md" out loud.

---

### Phase 4 — Build mode with Composer (target ~4 min)

Switch to **Build mode**, switch model to **Composer**. Narrate the model switch. Paste:

```
Execute plan.md. Follow the linear-feature-flow Phase 5 protocol: run lint and tests after each meaningful step. Open the result as a draft PR when done.
```

**What to watch for:**
- File tree updating in real-time (right-side panel)
- Test runs firing automatically (from the `testing-conventions.mdc` rule)
- New files appearing: likely `src/lib/palette.ts`, `src/components/palette/...`, `src/app/palette-extractor/page.tsx` (or similar)
- Composer self-corrects if a test fails — let it try once
- Final state: PR draft opened (if Linear/GitHub MCP write works) or branch ready to push

**Timing:** Start clock on paste, stop when agent yields control with the feature working.

**Red flag escalation order:**
1. **Composer stalls or visibly loops** — interrupt, ask: "What blocked you?" — if recoverable, let it continue. If not, see "Fallback procedure" below.
2. **Test failures Composer can't fix** — see "Fallback procedure" below.
3. **Type errors / import errors** — likely a Next 16 surprise. AGENTS.md tells the agent to read `node_modules/next/dist/docs/` — if it didn't, remind it.

---

## Timing template (fill in during the dry-run)

| Phase | Target | Actual | Notes |
|---|---|---|---|
| Ask | 90s | __:__ | |
| Plan with Opus | 3:00 | __:__ | |
| Hand-edit | 30s | __:__ | |
| Build with Composer | 4:00 | __:__ | |
| **Total IDE block** | **~9 min** | **__:__** | |

If total > 11 minutes, you need to compress somewhere. Likely candidates:
- Trim Ask prompt to just "Walk me through HOL-7"
- Skip the hand-edit narration sentences (keep the action, drop the words)

If total < 8 minutes, you have headroom and can let Q&A run longer.

---

## Success criteria (what should be true at end of dry-run)

1. [ ] `plan.md` is populated and reasonable (not pathologically generic, not 50 lines of preamble)
2. [ ] Brand Palette Extractor feature exists at some route (likely `/palette-extractor`)
3. [ ] `npm run lint` passes
4. [ ] `npm test` passes (no regressions)
5. [ ] `npm run build` succeeds
6. [ ] You can navigate to the page in the browser and extract colors from an image URL
7. [ ] You know roughly how long each phase took

If 1-5 are all green, the dry-run is a success regardless of the timing — Friday's job is just to repeat it on camera.

---

## Fallback procedure (if live Build chokes on Friday)

After the dry-run produces a good state, capture it as the prebuilt fallback:

```bash
cd ~/Cursor\ Interview/firefly-asset-gallery
git checkout -b dry-run/hol-7-prebuilt
git push -u origin dry-run/hol-7-prebuilt
```

If on Friday Composer stalls or generates something visibly broken:

1. Pause narration: *"Let me speed this up — I ran this same flow yesterday."*
2. In a new terminal: `git checkout dry-run/hol-7-prebuilt`
3. Restart dev server, navigate to the page
4. Resume runbook section 6 (Review the result)

The audience will not notice — and if they do, you say *"that's the dry-run I did yesterday — same plan, same output. The point isn't the execution, it's the workflow."*

---

## After the dry-run

1. Capture the prebuilt fallback (see commands above)
2. Update the timing template at the top of this doc with actual numbers
3. Note any prompt wording that didn't trigger what you expected — refine before Friday
4. Note any Composer behavior worth narrating ("watch how it runs tests automatically" etc.)
5. If Plan mode with Opus took dramatically longer than 3 min, decide whether to switch to Sonnet for Plan mode on Friday

---

## Dry-run results (Thursday, May 21)

**Outcome: success.** Feature shipped end-to-end. 23/23 tests passing. Draft PR opened ([PR #5](https://github.com/holdenstirling/firefly-asset-gallery/pull/5)). Fallback branch `dry-run/hol-7-prebuilt` captured.

**Ask phase:** Agent correctly identified Style Studio as the dependency, surfaced the right files, flagged a real type-system question (`StudioStyle.paletteId` is a closed union but extracted palettes are arbitrary hex), and stopped without writing code. The `linear-feature-flow` skill fired correctly on "Implement HOL-7."

**Plan phase:** Opus produced a structured plan with both pre-decided architectural choices baked in (`customPalette` field + prompt-bar out of scope). The plan's "Out of scope" section explicitly narrowed the original AC line about prompt-bar selection. Plan included tests for hex format, frequency ordering, empty pixel data.

**Hand-edit phase:** Tried the Droplet icon constraint. **It didn't bite** — Opus rationalized around it because the Linear ticket explicitly specifies the `Palette` icon. The agent correctly trusted the source-of-truth ticket text over a conflicting hand-edit. This is a critical learning.

**Build phase:** Composer executed the plan in 10 steps. Ran `npm test` after each `src/lib/` change (testing-conventions rule firing visibly). Wrote 23 tests total (up from 18). Updated Linear AC checkboxes via MCP (so Linear MCP write IS authenticated — no need to neuter the skill). Opened draft PR #5 from `dry-run/hol-7`.

**Files delivered (10 changed, 699 additions):**
- New: `src/lib/palette-extraction.ts` (71 lines)
- New: `src/lib/__tests__/palette-extraction.test.ts` (111 lines)
- New: `src/app/palette-extractor/page.tsx` (347 lines)
- Modified: `src/lib/types.ts`, `src/lib/style-studio.ts`, `src/lib/store.ts`, `src/app/style-studio/page.tsx`, `src/components/layout/sidebar.tsx`, `src/lib/__tests__/style-studio.test.ts`, `plan.md`

---

## Lessons learned — apply before Friday

### Lesson 1 — Hand-edit must ADD to the plan, not CONTRADICT the Linear ticket

The Droplet icon constraint failed because the Linear ticket explicitly specified the `Palette` icon. Opus correctly trusted the ticket. For Friday, the hand-edit should add a constraint the ticket doesn't speak to.

**Friday hand-edit (updated in [runbook section 3c](README.md)):**
```
## Constraints
- Color extraction must run in under 100ms on a 1024×1024 image. Downsample to a max of 96×96 with offscreen canvas before histogram bucketing.
```

This adds a perf budget the ticket doesn't specify. Verifiable on stage when Composer adds a downsampling step.

### Lesson 2 — Hand-edit goes in its own section, near the top

The dry-run hand-edit may have been wiped when Composer rewrote `plan.md` during Build to check the AC boxes. Putting the constraint in a clearly-labeled `## Constraints` section near the top makes it harder for Composer to inadvertently overwrite.

### Lesson 3 — Linear MCP write works

The skill's Phase 5 successfully updated HOL-7's AC checkboxes. No need to neuter the skill. Phase 5 stays as-written.

### Lesson 4 — Composer runs tests automatically without prompting

The `testing-conventions.mdc` rule worked exactly as intended — `npm test` ran after every `src/lib/` change. That's a visible wow moment for Friday's audience: tests fire on their own, the agent self-corrects when they fail.

### Lesson 5 — Plan mode finds real architectural questions

The Ask phase surfaced the `StudioStyle.paletteId` closed-union vs arbitrary-hex tension. The Plan phase honored the baked-in resolution without relitigating. For Friday: be ready to articulate this kind of decision IN THE MOMENT if the audience asks "what was the call there?"

### Lesson 6 — Composer is happy to open a draft PR

The `linear-feature-flow` Phase 5 instruction "Open a draft PR" worked first try. No additional configuration needed.

---

## What's still pending

Updated after Section 4 was switched to all-live:

1. **cursor.com/learn homework** — watch a few videos and skim one customer story ([PayPal](https://cursor.com/blog/paypal), [NAB](https://cursor.com/blog/nab), [Amplitude](https://cursor.com/blog/amplitude)). Look for a new feature you can name-drop. ~25 min.
2. **Friday rehearsal** — full timed read-through of the runbook end-to-end (now with sync'd dry-run prompts and the perf-constraint hand-edit, plus the all-live Section 4).
3. **Friday-morning Slack smoke test** — fire one test `@Cursor` mention in your DM and time the response. Expected: <15 sec. See Section 4 in the runbook for the exact message and recovery procedure if slow.

Completed since the dry-run:
- Adobe problem framing (Section 0a) — baked in
- Enterprise controls beat (Section 7.5) — baked in
- `demo-prep/qa-cards.md` — 10 cards (up from 5 originally scoped)
- P1 runbook prompts sync'd to dry-run-validated versions
- AGENTS.md and top-level README aligned to the Brand Palette Extractor live-build target
- Section 4 switched to ALL LIVE (no pre-recorded screencast); live-fire `@Cursor` in Slack on stage
- Mermaid diagrams re-rendered (Diagram 2 phantom-node bug fixed); PNG + SVG saved to `demo-prep/`
- Slide deck prompt finalized for Google Slides; 4-slide deck built by user
