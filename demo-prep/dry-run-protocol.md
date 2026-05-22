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

Stage-direction key (used in Phases 1–3 below):

- **DO** — physical actions (clicks, typing, paste). Audience sees your hands.
- **SAY** — spoken lines, verbatim. Use exactly the phrasing shown.
- **SHOW** — what the audience should see on screen at this moment.
- **WATCH** — what you're silently checking for. Don't narrate every step.

The runbook's Section 3 in [`README.md`](./README.md) carries the same stage-direction structure; this file adds rehearsal-only material (timing template, red flags, fallback procedure).

### Phase 1 — Ask mode (target ~90 sec)

**Beat 1 — Confirm Ask mode + Composer (~5s)**

- **DO:** Open the chat composer. Verify mode is `Ask` and model is `Composer` (NOT Opus — Opus is overkill for reading and will blow the 90s target; Composer or GPT-5.5 is what the runbook calls for).
- **SHOW:** Composer header reads `Ask`; model picker reads `Composer`.

**Beat 2 — Paste the scoping prompt (~5s)**

- **DO:** Paste the prompt below. Hit Enter. **Start clock on paste.**
- **PASTE VERBATIM:**

  ```
  Read HOL-7 from Linear. Walk me through:
  1. What's being asked (one paragraph)
  2. What's already in this codebase that supports it
  3. Which files will likely need to change

  Don't write code or open the plan file. I want to scope first.
  ```

**Beat 3 — Let the agent scope (~70s, light narration)**

- **DO:** Hands off keyboard. Let the agent read the ticket and skim the codebase.
- **WATCH FOR:**
  - Agent reads HOL-7 from Linear (= Linear MCP is wired)
  - Agent identifies Style Studio (HOL-5) as the existing dependency
  - Agent surfaces `src/lib/store.ts` and `src/app/style-studio/page.tsx` as likely-touched
  - Agent does NOT start writing code
- **SAY (after the summary lands, ~10s):** *"Style Studio just shipped — HOL-7 is the natural follow-on. That's what I want to plan next."*

**Stop clock:** when agent finishes the summary.

---

### Phase 2 — Plan mode with Opus (target ~3 min)

**Beat 1 — Switch to Plan mode (~5s)**

- **DO:** Click the mode toggle in the chat composer. Select `Plan`.
- **SHOW:** Composer header reads `Plan`. Send button is greyed-out for write tools — that's the read-only state cue you want visible.
- **SAY:** *(nothing yet — the model switch is the headline line)*

**Beat 2 — Switch model to Opus (~10s)**

- **DO:** Click the model picker. Select `Opus`.
- **SHOW:** Model picker now displays `Opus` (the audience needs to see this label change — it's the differentiation moment).
- **SAY (verbatim):**
  > *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model."*

**Beat 3 — Paste the prompt (~15s)**

- **DO:** Paste the prompt below. Hit Enter. **Start clock on paste.**
- **SAY (light, while pasting — optional):** *"Here's the brief — Linear ticket plus two architectural decisions I've already made."*
- **PASTE VERBATIM** (this is the dry-run-validated prompt — the two baked-in decisions save ~60s of on-stage architectural relitigation):

  ```
  Implement HOL-7 using the linear-feature-flow workflow. Read AGENTS.md,
  the rules in .cursor/rules/, src/lib/store.ts, and src/lib/style-studio.ts
  before planning. Generate a structured implementation plan into plan.md
  following the skill's Phase 3 template.

  Two decisions are already made — bake them into the plan:

  1. Type extension: add an optional customPalette: { swatches: string[] }
     field on StudioStyle. StyleCard branches on its presence to render
     inline-style hex swatches.

  2. Out of scope for HOL-7: Style picker in PromptBar. Saved palettes apply
     through the existing Style Studio "Apply" path only. Note this in the
     plan's "Out of scope" section.

  Stop after writing plan.md — do not start implementation.
  ```

**Why this prompt:** The phrase "Implement HOL-7" should trigger the `linear-feature-flow` skill. The explicit reference to Phase 3 anchors the output format. The "stop" instruction enforces the human-in-the-loop gate. The two baked-in decisions resolve real architectural questions (closed-union `paletteId` vs arbitrary hex; prompt-bar picker scope) up front so Opus doesn't relitigate them on stage.

**Beat 4 — Let Opus work (~2:00–2:30, mostly silent for you)**

- **DO:** Hands off keyboard. Step back from the desk if helpful — body language sells the "the agent is doing the work" beat.
- **SHOW:** Right panel streams Opus's reasoning, then `read_file` calls against AGENTS.md → `.cursor/rules/*` → `src/lib/store.ts` → `src/lib/style-studio.ts`, then a `write` to `plan.md`.
- **WATCH FOR (silent checks — DO NOT narrate every step):**
  - Opus reads the four listed files (= skill fired correctly)
  - `plan.md` populates with the Phase 3 template (Goal / Files to change / Files to create / Implementation steps / Tests / AC check)
  - Opus stops after writing — does NOT touch any source file
- **SAY (sparse, only if there's awkward silence):**
  - When file-reads stream by: *"Plan mode is read-only — watch it reading my codebase, not editing it."*
  - When `plan.md` appears in the diff view: *"And there's the plan."*

**Stop clock:** when `plan.md` is populated and Opus yields.

**Red flag — Opus starts editing source files:**

- **DO:** Hit `Esc` to interrupt. Don't panic-narrate; the audience won't notice a 2-second pause.
- **SAY:** *"Let me re-scope that — Plan mode should be read-only."*
- **DO:** Re-send the prompt with `READ ONLY — only write plan.md, no other files.` appended.

---

### Phase 3 — Hand-edit `plan.md` (target ~30 sec, this is the headline beat)

**Beat 1 — Open `plan.md` in the editor (~3s, start clock here)**

- **DO:** Click `plan.md` in the file tree (left sidebar). Open it as a real editor pane, NOT just the chat-preview tile.
- **SHOW:** `plan.md` is open in a full editor pane, cursor visible.

**Beat 2 — Read the Goal aloud (~10s)**

- **DO:** Scroll to the `## Goal` section. Hover the cursor there so the audience eye lands on it.
- **SAY (cold-read from screen — you do NOT know Opus's exact wording in advance):** Read the Goal paragraph as written. One paragraph, maybe two sentences. After reading: *"That's the goal Opus distilled from the ticket."*

**Beat 3 — Type the constraint (~12s, headline action)**

- **DO:** Click at the end of the Goal paragraph. Press Enter twice. **Type** the block below — type it, don't paste. The audience seeing your hands on the keyboard is the visual signal that this is the human-in-the-loop moment.

  ```
  ## Constraints

  - Color extraction must run in under 100ms on a 1024×1024 image. Downsample to a max of 96×96 with offscreen canvas before histogram bucketing.
  ```
- **DO:** `Cmd+S` to save.
- **SHOW:** `plan.md` now has a `## Constraints` section between `## Goal` and `## Files to change`. The "modified" dot on the file tab disappears on save.
- **SAY (verbatim, while typing — this is the most important sentence in the IDE block):**
  > *"This is the moment. The plan is a file. I edit it like code. One line — extraction has to run in under 100ms on a 1024×1024 image. The agent doesn't get autonomy until I sign off."*

**Why this constraint specifically:**

- **ADDS to the ticket, doesn't contradict it.** The Linear ticket says nothing about extraction speed, so Composer has no source-of-truth conflict to rationalize around.
- **Demonstrable on stage:** audience can verify Composer adds the downsampling step in the generated `palette-extraction.ts`.
- **Adobe-flavored:** implies "must work for high-res Firefly outputs."

**Avoid:** Constraints that contradict the Linear ticket text. Example anti-pattern from the original dry-run: the ticket specified the `Palette` Lucide icon, so adding "use Droplet icon instead" got ignored because Opus correctly trusts the ticket (see Lesson 1 below).

**Beat 4 — Hand off into Build (~5s, stop clock)**

- **DO:** Take hands off the keyboard. Pause for one beat (a literal one-second silence). The pause is the cue.
- **SAY:** *"Now I sign off — execute `plan.md`."*  ← this line is the verbal handoff into Phase 4 (Build). **Stop clock** on this sentence.
- **DO:** Switch mode toggle to `Build` and model to `Composer` in one continuous motion (technically the start of Phase 4 but lands cleanest folded into the handoff).

---

### Phase 4 — Build mode with Composer (target ~4 min)

You're already in Build mode + Composer — that switch happened at the end of Phase 3 Beat 4 as part of the "execute plan.md" verbal handoff. Don't redo it.

**Beat 1 — Frame the model change (~5s)**

- **SAY (as the chat composer's model picker UI lands on Composer):**
  > *"For Build, I'm in Composer-1 — Cursor's own model, optimized for tool-using speed inside the IDE. Plan mode used Opus for breadth. Build phase wants speed."*

**Beat 2 — Paste the execute prompt (~5s, start clock on paste)**

- **DO:** Paste the prompt below. Hit Enter.
- **PASTE VERBATIM:**

  ```
  Execute plan.md. Follow the linear-feature-flow Phase 5 protocol: run lint
  and tests after each meaningful step. Open the result as a draft PR when
  done.
  ```

**Beat 3 — Let Composer work (~3:30, mostly silent for you)**

- **DO:** Hands off keyboard. Watch the file tree.
- **WATCH FOR:**
  - File tree updates in real-time (right-side panel)
  - `npm test` fires automatically after `src/lib/` edits (= `testing-conventions.mdc` rule firing — narratable moment)
  - New files appearing: likely `src/lib/palette-extraction.ts`, `src/lib/__tests__/palette-extraction.test.ts`, `src/app/palette-extractor/page.tsx`, plus sidebar / store / style-studio edits
  - Composer self-corrects if a test fails — let it try once before intervening
  - Final state: PR draft opened (if Linear/GitHub MCP write works) or branch ready to push
- **SAY (sparse — pick at most two callouts):**
  - When tests fire on their own: *"Notice it didn't ask permission to run tests. The rule fires automatically when it touches `src/lib`."*
  - When a test fails and Composer fixes it: *"And it just self-corrected the assertion — same loop a human engineer runs."*

**Stop clock:** when agent yields control with the feature working.

**Red flag escalation order:**

1. **Composer stalls or visibly loops** — interrupt, ask: *"What blocked you?"* — if recoverable, let it continue. If not, see "Fallback procedure" below.
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

1. **Timing template** — user didn't capture exact phase times. If desired, run a quick second dry-run on a fresh branch with a stopwatch.
2. **Friday rehearsal** — full timed read-through of the runbook end-to-end (now with the perf-constraint hand-edit instead of icon).
3. **Adobe problem framing (Section 0a)** — still pending insert.
4. **Enterprise security beat (Section 7.5)** — still pending insert.
5. **`demo-prep/qa-cards.md`** — five prepared Q&A answers.
6. **cursor.com/learn homework** — watch a few videos and skim a customer story.

**Removed from this list:** Screencast capture. Section 4 Tab 1–2 now fires a live Cloud Agent task on stage instead of playing a pre-recorded clip. See the README Section 4 stage directions for the live fire-off and the dashboard-fallback procedure.
