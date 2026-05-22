# Demo-prep drafts and runbook

This folder holds two kinds of artifacts:

1. **Demo-prep drafts** — files NOT loaded by Cursor automatically. Paste their contents during the live demo to create rules and skills on camera.
2. **Live-demo runbook** — the timed sequence (below) for the kickoff session.

---

## Demo state at a glance

| Resource | What's in it |
|---|---|
| `main` branch | Style Studio (HOL-5) shipped, prompt bar wired, 18 Vitest tests passing |
| Linear HOL-6 | Playwright e2e tests (PR #3 OPEN — keep open as the async demo asset) |
| Linear HOL-7 | **Brand Palette Extractor** — the live-build target |
| Bugbot | Reviewed PR #3, flagged a real a11y/keyboard bug on `asset-card.tsx:44` — leave unresolved |
| PR #4 | Bugbot autofix (draft) — Cloud Agent's 2-line fix for the a11y bug. Demo kicker |
| `plan.md` | Empty placeholder, ready for Plan-mode output |

## Live-demo build target: HOL-7

The Plan → Build flow during the demo will implement the **Brand Palette Extractor**:
paste an image URL → extract dominant colors via `<canvas>` → save as a Style preset.

This chains naturally off Style Studio (which just shipped) and is unmistakably Adobe-flavored (Adobe Color homage).

**Linear:** [HOL-7](https://linear.app/holden-ottolini/issue/HOL-7/build-brand-palette-extractor-turn-any-image-into-a-style-preset)

---

## Live-demo runbook (17-20 min target, ~17 min script + ~3 min Q&A buffer)

**Time budget** (revised after 0a + 7.5 inserts):

| Section | Time | Cumulative |
|---|---|---|
| 0a · Adobe problem framing | 25s | 0:25 |
| 0 · Opening + surface area diagram | 30s | 0:55 |
| 1 · cursor.com/agents | 60s | 1:55 |
| 2 · Linear ticket | 30s | 2:25 |
| 3 · Ask → Plan → hand-edit | 5:00 | 7:25 |
| 4 · Cloud Agent + Bugbot 4-tab walkthrough (live `@Cursor` fire-off in Tabs 1–2) | 110s | 9:15 |
| 5 · Build mode | 3:30 | 12:45 |
| 6 · Review the result | 60s | 13:45 |
| 7 · Rules + Skills live creation | 2:00 | 15:45 |
| 7.5 · Enterprise controls | 25s | 16:10 |
| 8 · Two-track recap + trial plan | 60s | 17:10 |
| Q&A buffer | 1-3 min | within 20 min |

Total script: ~17 min. Allows ~3 min for organic Q&A inside a 20-min slot. Tight but achievable.

**Section 4 / 5 parallelism note:** Section 5 (Composer in Build mode) is a *background* task that you kick off at the very start of Section 5, then leave running while you do Section 4 in the foreground. If you treat them as overlapping in the actual demo (which you can — Composer doesn't need you to stare at it), you reclaim ~90 seconds and the total drops back to ~15:40. The cumulative numbers in the table treat them as serial for safety; treat that as the upper bound, not the target.

### 0a. Adobe problem framing (~25 sec)

Spoken over the title slide — no separate slide needed. This is the Problem-Solution Alignment beat that the interview rubric grades on.

> *"Quick frame before we dive in. Adobe ships across Creative Cloud — Photoshop, Firefly, Acrobat — with thousands of engineers across hundreds of repos, hard accessibility requirements, and IP that can't leak. The bar for any AI tool here is: does it move work forward without giving up code review, governance, or security? Everything in the next 17 minutes is aimed at that bar."*

**Why this beat exists:** The interview prompt explicitly grades on "Problem-Solution Alignment — present a simple, realistic challenge a team like Adobe might face." Without this, the demo shows what Cursor can do but never names what Adobe is trying to solve. 25 seconds closes that gap.

**Delivery notes:**
- Say it before any product is on screen. Title slide only.
- The three Adobe constraints (engineers/a11y/IP) are not invented — they map to the three later beats: a11y -> Bugbot finds keyboard bug, IP -> enterprise security beat, engineers -> rules and skills scaling.
- Do NOT name Claude Code here. It comes up in Q&A.

---

### 0. Opening agenda slide (~30 sec)
Two slides:
1. **"Where Cursor lives"** diagram (see [diagrams.md](./diagrams.md) — Diagram 1). One image, three seconds of recognition.
2. Agenda — bullets:
   - Where Cursor lives
   - The Ask → Plan → Build workflow
   - How this scales: rules, skills, Bugbot

Spoken intro:
> *"Hi, I'm Holden. Over the next 17 minutes I'll walk you through three things: where Cursor lives — it's not just an editor anymore; the workflow engineering teams run today — read a ticket, plan with Opus, build with Composer, fan out async work to Cloud Agents; and how this scales beyond one engineer with rules, skills, and Bugbot. I'll keep slides minimal — most of this is in a real codebase. Jump in with questions any time."*

### 1. Where Cursor lives — cursor.com/agents (~1 min)

**Pre-stage:** dashboard already open in the leftmost tab with HOL-5 and HOL-6 runs visible. Don't navigate cold on stage.

**Beat 1 — Open the dashboard tab (~5s)**

- **DO:** Cmd+1 to the cursor.com/agents tab. Window should fill the screen.
- **SHOW:** Dashboard with recent agent runs. Audience sees a Cursor product UI that is *not* the IDE.

**Beat 2 — Surface-area framing (~20s)**

- **SAY (verbatim):**
  > *"This is cursor.com/agents. Two years ago Cursor was an editor — that was it. Today Cursor is a surface area. The same agent runs from the IDE, from this web dashboard, from Slack, from the CLI, and from Bugbot on a pull request. Same agent, same model picker, same rules, same skills — meets you wherever the work is."*

**Beat 3 — Point at the runs (~25s)**

- **DO:** Hover (don't click) the row for the HOL-5 run, then the HOL-6 run.
- **SAY (verbatim, while hovering):**
  > *"These two rows are real. HOL-5 — Style Studio — was a Cloud Agent run that landed as a merged PR yesterday. HOL-6 is the Playwright e2e tests for that work; the PR is still open with review comments. Both fired from a `@Cursor` ping in Slack. I never opened the IDE for either one. We'll see the artifacts they produced in a few minutes."*

**Beat 4 — Handoff to Linear (~10s)**

- **DO:** Cmd+Tab toward the Linear tab (don't click yet — the line below is the cue).
- **SAY (verbatim):**
  > *"But for the live build today, I want to ride shotgun with the agent in the IDE. So let's start where engineering work actually starts — a Linear ticket."*

### 2. Where work actually starts: a Linear ticket (~30 sec)

**Pre-stage:** HOL-7 already loaded in the Linear tab, scrolled to the top.

**Beat 1 — Open HOL-7 (~5s)**

- **DO:** Switch to the Linear tab. Ticket header visible.
- **SHOW:** HOL-7 "Build Brand Palette Extractor" with the Problem statement and Acceptance Criteria checklist visible.

**Beat 2 — Frame the ticket (~15s)**

- **DO:** Mouse over the ticket title, then scroll-hover the acceptance-criteria checklist.
- **SAY (verbatim):**
  > *"HOL-7. Brand Palette Extractor. Paste an image URL, extract dominant colors with a canvas, save them as a Style preset that hooks into Style Studio — the feature we just shipped. Eleven acceptance criteria, all unchecked. Normal Linear ticket — same one any engineer would see in standup."*

**Beat 3 — Handoff to the IDE (~10s)**

- **DO:** Cmd+Tab to the Cursor IDE. The window should already be on `firefly-asset-gallery`, branch `feat/hol-7`, and `plan.md` should NOT be open in any pane.
- **SAY (verbatim):**
  > *"I'm not going to read this whole ticket out loud. Watch what happens when Cursor reads it for me."*

### 3. THE PLAN MOMENT — switch to IDE on `firefly-asset-gallery`, branch `main`

Stage-direction key (used throughout the IDE block):

- **DO** — physical actions (clicks, typing, paste). Audience sees your hands.
- **SAY** — spoken lines, verbatim. Use exactly the phrasing shown.
- **SHOW** — what the audience should see on screen at this moment.
- **WATCH** — what you're silently checking for. Don't narrate every step.

**3a. Ask mode (~90 sec) — quick context set**

**Beat 1 — Confirm Ask mode + Composer (~5s)**

- **DO:** Open the chat composer. Verify mode is `Ask` and model is `Composer` (NOT Opus — Opus is overkill for reading and burns ~60s of your budget; the dry-run validated Composer is the right fit here).
- **SHOW:** Composer header reads `Ask`; model picker reads `Composer`.

**Beat 2 — Paste the scoping prompt (~5s)**

- **DO:** Paste the prompt below. Hit Enter.
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
  - Agent surfaces Style Studio (HOL-5) as the existing dependency
  - Agent identifies `src/lib/store.ts` and `src/app/style-studio/page.tsx` as likely-touched
  - Agent does NOT write code or open `plan.md`
- **SAY (after the summary lands, ~10s):** *"Style Studio just shipped — HOL-7 is the natural follow-on. That's what I want to plan next."*

*Don't dwell here.* Ask is the prelude, not the headline.

**3b. Plan mode with Opus (~3 min) — THE headline beat**

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

- **DO:** Paste the prompt below into the composer. Hit Enter.
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

**Red flag — only if Opus starts editing source files:**

- **DO:** Hit `Esc` to interrupt. Don't panic-narrate; the audience won't notice a 2-second pause.
- **SAY:** *"Let me re-scope that — Plan mode should be read-only."*
- **DO:** Re-send the prompt with `READ ONLY — only write plan.md, no other files.` appended.

**3c. Edit `plan.md` live (~30 sec) — the human-in-the-loop moment**

**Beat 1 — Open `plan.md` in the editor (~3s)**

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

**Beat 4 — Hand off into Build (~5s)**

- **DO:** Take hands off the keyboard. Pause for one beat (a literal one-second silence). The pause is the cue.
- **SAY:** *"Now I sign off — execute `plan.md`."*  ← this line is the verbal handoff into Section 5 (Build).
- **DO:** Switch mode toggle to `Build` and model to `Composer` in one continuous motion (this is technically the start of Section 5 but lands cleanest folded into the handoff).

**Why these specific placements (so you don't second-guess on stage):**

- **Constraint section goes between `## Goal` and `## Files to change`** — not at the very top. Goal is what you just read aloud; Constraints right after keeps the reading flow natural, and matches dry-run Lesson 2 (Composer is less likely to overwrite a top-level section when checking AC boxes than a section interleaved with the file lists).
- **Type, don't paste, the constraint** — typing is the physical proof of human-in-the-loop. Paste reads like another agent action.
- **Mode + model switch is one continuous motion at end of 3c, not start of Section 5** — saves you ~5s of dead air between phases. The verbal handoff `"execute plan.md"` covers the motion.
- **Beat 4 of 3b is mostly silent** — resist the urge to fill the 2-minute Opus wait with commentary. The runbook timing budget assumes you mostly shut up while Opus works; the silence sells the "agent is doing real work" beat. Two sparse callouts are plenty.

**Why this constraint specifically:**

- **ADDS to the ticket, doesn't contradict it.** The Linear ticket says nothing about extraction speed, so Composer has no source-of-truth conflict to rationalize around.
- **Demonstrable on stage:** audience can verify Composer adds the downsampling step in the generated `palette-extraction.ts`.
- **Adobe-flavored:** implies "must work for high-res Firefly outputs."

**Avoid:** Constraints that contradict the Linear ticket text. Example anti-pattern from the dry-run: the ticket specified the `Palette` Lucide icon, so adding "use Droplet icon instead" gets ignored because Opus correctly trusts the ticket.

### 4. Fan out async work — Cloud Agent + Bugbot 4-tab walkthrough (~110 sec, ALL LIVE)

**Nothing is pre-recorded.** All four tabs run live on stage. Tabs 1 and 2 fire a brand-new Cloud Agent task in front of the audience and watch the run stream in real time on `cursor.com/agents`. Tabs 3 and 4 are yesterday's PR artifacts (the Bugbot review and the autofix Cloud Agent PR) — those are real but already-landed.

Why live for Tabs 1–2: the audience seeing a real `@Cursor` Slack message produce a real streaming run in 20 seconds is dramatically stronger than playing a pre-recorded clip. It also matches your original notes ("fire off a Cursor agent from Slack" live). The fallback procedure at the end of Tab 2 covers the rare case where the live agent stalls.

**Bridge from Section 3c** (~5s, said as Composer starts working in Section 5 — your eyes are on the IDE but you talk over it):

- **SAY (verbatim):**
  > *"While Composer builds this, let me show you the other surface — same workflow fired from Slack, running async in Cursor's infrastructure."*

**Tab 1 — Slack: fire a live Cloud Agent task (~25s)**

This is now a **live fire-off**, not a yesterday-recap. Audience sees you type the Slack message and the Cursor bot acknowledge it.

**Beat 1.1 — Open Slack and point at yesterday's ping (~5s)**

- **DO:** Cmd+Tab to the Slack workspace `holdenstirling`. Channel should already be scrolled to the `@Cursor pick up HOL-6` thread from yesterday.
- **SHOW:** Yesterday's `@Cursor pick up HOL-6` message visible above the composer.
- **SAY (verbatim):**
  > *"Yesterday I sent this from Slack — `@Cursor pick up HOL-6`. That one message is what produced everything we'll see in Tabs 3 and 4. Today, same thing, new task, live — watch."*

**Beat 1.2 — Type and send a new `@Cursor` task (~15s)**

- **DO:** Click into the Slack message composer. Type (or paste, but typing reads more authentic) the prompt below. Hit Enter.
- **LIVE PROMPT (type or paste verbatim):**

  ```
  @Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
  ```
- **SHOW:** Cursor's Slack bot replies with an acknowledgement (typically *"Agent started"* or a link to the run).
- **SAY (verbatim, while typing — finish around the time you hit Enter):**
  > *"Models are good enough now that they can run asynchronously. While Composer's building over there, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. Tiny task — JSDoc comment on the Picsum helper. No prompt engineering."*

**Beat 1.3 — Acknowledge the bot reply, pivot to dashboard (~5s)**

- **DO:** Wait one beat for the Cursor Slack bot's confirmation. Cmd+Tab to `cursor.com/agents`.
- **SAY (verbatim):**
  > *"Confirmation. Run started. Let's see it."*

**Tab 2 — `cursor.com/agents`: watch the LIVE run stream (~30s)**

**Beat 2.1 — Find the new run on the dashboard (~5s)**

- **DO:** Land on the dashboard. The just-fired task should appear at the top of the list, status `Running` (refresh if needed — usually within 1–2 seconds of the Slack confirmation).
- **SHOW:** Dashboard row for the new run, status `Running` (or `Active`).

**Beat 2.2 — Click into the run detail (~5s)**

- **DO:** Click the new run. Detail page opens with the live activity stream.
- **SHOW:** Activity stream populating in real-time — file reads, tool calls, edits.
- **SAY (verbatim):**
  > *"There it is. Cursor's web dashboard. Same agent, runs in Cursor's infrastructure — not on my laptop. No environment to set up, no laptop to keep awake."*

**Beat 2.3 — Narrate the stream as it plays (~20s)**

- **DO:** Hands off keyboard. Let the audience watch the agent work. Don't talk over the most interesting moments — let them land silently and then narrate them.
- **SHOW:** Agent reads `src/lib/picsum.ts`, considers the params, drafts the JSDoc, applies the edit. If fast enough, a draft PR appears before you move on.
- **SAY (verbatim, paced across the ~20s — call out what's actually on screen):**
  > *"Streams its work as it goes — file reads, tool calls, edits. There — it's reading `picsum.ts`. Now it's applying the edit. Engineer fires a Slack message, goes to a meeting, comes back, the PR is open. Same surface area, no laptop, no IDE open. That's the async story."*
- **WATCH FOR:** If a draft PR link appears in the activity stream, point at it briefly and say *"And there's the PR — under a minute end-to-end."* If the PR hasn't opened yet by the time you've used your 20s, leave it streaming and move on. Tab 4 will still land the PR-author story.

**Fallback procedure (if the live agent stalls or hasn't started ~10s after Beat 1.3):**

- **DO:** Stay on the dashboard. Scroll one row down — yesterday's HOL-6 run is still listed. Click into it instead of the new one.
- **SAY (smooth pivot, no apology):**
  > *"While that one spins up — same flow from yesterday, longer task. Here's HOL-6, the Playwright tests."*
- Then continue with Beats 2.2 and 2.3 narration but pointing at HOL-6's completed activity log. Audience won't know it's a fallback.
- **Plan C (very rare):** if both the live run and HOL-6 load slowly (network issue), open the Slack bot reply in Tab 1 — it usually includes a link to the run page. Or skip to Tab 3 and revisit Tab 2 at the end. Don't dwell — better to keep momentum than fight a flaky dashboard.

**Tab 3 — PR #3, scrolled to Bugbot's comment on `asset-card.tsx:44` (~30s)**

- **DO:** Cmd+Tab to the GitHub PR #3 tab. Page should auto-scroll to Bugbot's comment thread.
- **SHOW:** Inline review comment from `bugbot` on line 44 of `asset-card.tsx`, calling out the keyboard-event-bubbling bug.
- **SAY (verbatim):**
  > *"It opened PR #3 with Playwright e2e tests. But — and this is the part that punches above its weight — Bugbot, Cursor's automated reviewer, caught something the agent introduced that I would've shipped: keyboard events from the nested favorite button bubble up to the card's `onKeyDown`, so a keyboard user pressing Enter on the favorite accidentally opens the detail modal too. That's an a11y bug. The kind of thing that fails an Adobe accessibility review."*

**Tab 4 — PR #4, the 2-line autofix diff (~25s)**

- **DO:** Cmd+Tab to GitHub PR #4 Files Changed view.
- **SHOW:** Two-line diff adding `event.stopPropagation()` (or equivalent). PR author reads `cursoragent@cursor.com`.
- **SAY (verbatim):**
  > *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. This is one of Cursor's newer capabilities — Bugbot doesn't just review, it can dispatch the fix to a Cloud Agent in one click. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams."*

**Beat 5 — Pivot back to Composer (~5s)**

- **DO:** Cmd+Tab back to the Cursor IDE. Composer should still be working.
- **SAY (verbatim):**
  > *"Meanwhile Composer's been building. Let's check in."*

**Pre-demo tab order (left to right in the browser):**

1. https://cursor.com/agents — dashboard, HOL-6 run open
2. Slack workspace `holdenstirling`, channel with the `@Cursor` thread
3. https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971 — auto-scrolls to Bugbot's comment
4. https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files — PR #4 Files Changed view

**Friday morning sanity check (2 min):**

- Open all 4 tabs cold, in order, and click through them once with the narration cues. If any tab fails to load or scroll to the right place, you'll catch it before the meeting starts, not during.

### 5. Build mode with Composer (~4 min)

You're already in Build mode + Composer — the switch happened as part of Section 3c Beat 4's verbal handoff. Don't redo it.

**Beat 1 — Frame the model change (~5s)**

- **SAY (verbatim, as the chat composer header / model picker UI lands on Composer):**
  > *"For Build, I'm in Composer-1 — Cursor's own model, optimized for tool-using speed inside the IDE. Plan mode used Opus for breadth. Build phase wants speed."*

**Beat 2 — Paste the execute prompt (~5s)**

- **DO:** Paste the prompt below. Hit Enter.
- **PASTE VERBATIM:**

  ```
  Execute plan.md.
  ```

**Beat 3 — Let Composer work (~3:30, mostly silent for you)**

- **DO:** Hands off keyboard. Watch the file tree.
- **WATCH FOR:**
  - File tree updates in real-time (right-side panel)
  - `npm test` fires automatically after `src/lib/` edits (= `testing-conventions.mdc` rule firing — narratable moment)
  - New files appear: `src/lib/palette-extraction.ts`, `src/lib/__tests__/palette-extraction.test.ts`, `src/app/palette-extractor/page.tsx`, plus sidebar / store / style-studio edits
  - Composer self-corrects if a test fails — let it try once before intervening
- **SAY (sparse — pick at most two callouts):**
  - When tests fire on their own: *"Notice it didn't ask permission to run tests. The rule fires automatically when it touches `src/lib`."*
  - When a test fails and Composer fixes it: *"And it just self-corrected the assertion — same loop a human engineer runs."*

**Red flag escalation — if Composer stalls or generates something visibly broken:**

- See [`dry-run-protocol.md`](./dry-run-protocol.md) "Fallback procedure" — `git checkout dry-run/hol-7-prebuilt` and resume at Section 6.

### 6. Review the result (~1 min)

This is the visual-demo beat — the only place the actual built feature shows up live in a browser. Make it count.

**Pre-stage:** dev server already running on `localhost:3000` in a terminal tmux pane. Chrome browser tab open on `localhost:3000`. Composer has just yielded; `plan.md` and the file diffs are visible in the IDE.

**Beat 1 — Navigate to `/palette-extractor` (~15s)**

- **DO:** Cmd+Tab to Chrome. Click `Palette Extractor` in the left sidebar — the entry with the gradient `New` badge that Composer just added.
- **SHOW:** `/palette-extractor` page loads. After ~1s the loading skeleton resolves into a Picsum source image and a 5-swatch palette next to it.
- **SAY (verbatim — start as the page is loading):**
  > *"Here it is. Composer built this in the last three minutes — new route, new sidebar entry, fresh palette extractor reading dominant colors out of a canvas. Five swatches by default. Hex values inline."*

**Beat 2 — Change swatch count to demonstrate re-extraction (~15s)**

- **DO:** Click the `Swatches` dropdown. Pick `7`. Wait one beat for the re-extract. Then pick `3`.
- **SHOW:** Palette card re-renders with 7 swatches, then 3 swatches. Re-extraction is visibly under a second.
- **SAY (verbatim, while clicking):**
  > *"3, 5, 7 swatches. Re-extracts client-side, every time. That's the perf constraint I hand-edited into `plan.md` — under 100 milliseconds on a 1024-by-1024 image. Composer added a downsample-to-96-by-96 step inside the extractor to honor it. No new dependencies. Standard Web APIs only."*

**Beat 3 — Save as a Style and confirm it lands in Style Studio (~15s)**

- **DO:** Click `Save as Style`. Type a name in the dialog: `Adobe Brand`. Click the dialog's Save button. Wait for the success banner. Click `Open Style Studio` in the banner.
- **SHOW:** Style Studio page. New `Adobe Brand` style at the top of the saved-styles list with an `Extracted` badge and the real hex swatches you just extracted.
- **SAY (verbatim):**
  > *"And it doesn't live in isolation — it plugs into Style Studio, the feature we shipped yesterday. Save-as-Style takes the extracted palette, names it, and hands it to the existing Zustand store. Same Apply path, no special-case wiring. Two features chained into one workflow."*

**Beat 4 — Show tests pass in the terminal (~15s)**

- **DO:** Cmd+Tab to the IDE. Open the integrated terminal (Ctrl+\`). Type `npm test` and hit Enter.
- **SHOW:** Vitest run completes in ~1.5s. `Test Files  4 passed (4)` / `Tests  30 passed (30)` lands at the bottom of the terminal.
- **SAY (verbatim, while waiting for the test run):**
  > *"And the contract — 30 tests passing, up from 18 on `main`. Composer ran these on its own every time it touched `src/lib`. Same tests you'd see in CI. Green."*

**Compression option (if you're behind on time):**

- Drop Beat 4. The visual proof of Beats 1–3 is enough. Composer was running `npm test` on its own during Build, so the audience already saw tests fire green; re-running in the terminal is reinforcement, not new information.

**Expansion option (if you're ahead on time):**

- Insert a 10s error-state beat between Beats 3 and 4: paste `https://example.com/does-not-exist.png` into the URL input, click `Extract palette`, show the error card with the `Try again` button. Narration: *"And it handles failures gracefully — bad URL, CORS block, fetch error all land here. Not great-not-terrible code, real edge-case handling."*

### 7. Rules + Skills wrap (~2 min)

This section pivots the demo from "what one engineer can do" to "how this scales across a team." Run the two creation beats from the "Live-demo creation beats" block below (Beat 1 = rule, Beat 2 = skill), but bracket them with the intro and closing narration here.

**Bridge from Section 6 (~10s)**

- **DO:** Cmd+Tab to the IDE. File tree visible on the left.
- **SAY (verbatim):**
  > *"OK — one engineer, one ticket, one feature in twelve minutes. The question Adobe is actually asking is: what happens when this is a thousand engineers and a hundred repos? The answer is rules and skills. Watch."*

**Now run Beat 1 (rule) and Beat 2 (skill) from "Live-demo creation beats" below.** Each has its own stage-direction script.

**Closing of Section 7 (~10s, after Beat 2 finishes)**

- **SAY (verbatim):**
  > *"That's the multiplier. Every engineer who pulls this repo tomorrow inherits both — the rule fires automatically, the skill is one slash command away. That's how Cursor goes from a single-engineer tool to team infrastructure."*

### 7.5. Enterprise controls beat (~25 sec)

One slide. Title: **"Enterprise controls"**. Bullets:
- Zero data retention. No training on your code by Cursor or any LLM provider.
- SOC 2 Type 2 · SAML SSO · SCIM · AES-256 at rest · TLS 1.2+ in transit
- Model + MCP + agent rule allowlists, all configurable from one admin panel
- 64% of Fortune 500 already on Cursor: NVIDIA, Stripe, Coinbase, Rippling

Narrate:
> *"Last thing before we close. Rules and skills govern individuals and teams. At org level, Cursor adds the controls Adobe needs — zero data retention, SOC 2 Type 2, SAML SSO, SCIM, model and MCP allowlists, and Privacy Mode that prevents any customer code from being used for training, by Cursor or any LLM provider. It's how 64% of the Fortune 500 runs Cursor today — NVIDIA, Stripe, Coinbase, Rippling. Same controls available to Adobe on day one of the trial."*

**Why this beat exists:** Adobe is famously security-conscious. The interview prompt and your original notes both call out security explicitly. Without this beat, every audience member is doing the math privately on whether the demo can survive their legal review. This says it out loud and closes the door.

**Delivery notes:**
- Read the bullets quickly. The slide does the heavy lifting; you only need ~25 seconds of voice.
- The "no training on customer code, by Cursor OR any LLM provider" phrasing matters. Adobe will hear it.
- The Fortune 500 names are borrowed credibility. Don't overuse — one beat, then move on.
- If asked in Q&A about a name not on that list (e.g., "Are any other media/creative companies on Cursor?"), the safe answer is *"I'd need to confirm with our customer success team, but the Cursor enterprise page lists 50,000+ enterprises and 100M+ lines of code shipped per day."*

---

### 8. Two-track recap + trial plan + Q&A (~60s + Q&A)

Two closing slides. The diagram does most of the work; you provide the through-line.

**Beat 1 — Two-track workflow diagram (~30s)**

- **DO:** Switch to Keynote / slide deck. Land on the "Two-track workflow" diagram (see [`diagrams.md`](./diagrams.md) — Diagram 2).
- **SHOW:** Mermaid diagram with two parallel tracks from a single Linear ticket — the local "ride shotgun" track (Ask → Plan → Build) and the async Cloud Agent track (Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR).
- **SAY (verbatim — this is the headline recap line from your original notes):**
  > *"That's the picture. One Linear ticket — two parallel tracks. Locally I rode shotgun with the agent: Ask scoped it, Plan with Opus reasoned about the codebase and wrote a plan I could edit by hand, Build with Composer executed it. In parallel, a Cloud Agent fired from Slack delivered Playwright tests, Bugbot caught an accessibility bug the agent introduced, and a second Cloud Agent produced the fix. Two PRs, one engineer, ten minutes. That's the lift a small team gets — without giving up code review or governance. The bigger story is what this unlocks: projects that wouldn't have gotten started before, getting shipped. That doesn't show up in any dashboard."*

**Beat 2 — Trial plan slide (~25s)**

- **DO:** Advance to the trial-plan slide.
- **SHOW:** Bulleted four-week trial plan.
  - Week 1: install + 5 power-user pilots + `.cursor/rules` setup
  - Week 2: Bugbot wired on 2–3 active repos + first Cloud Agent migrations
  - Weeks 3–4: measure (Tab acceptance, time-to-first-PR for new starters, PR cycle time, NPS)
  - Throughout: weekly office hours + shared Slack channel
- **SAY (verbatim):**
  > *"Here's what a four-week trial looks like at Adobe. Week one: install and five power-user pilots on `.cursor/rules` for your largest Creative Cloud repo. Week two: Bugbot wired on two or three active repos plus the first Cloud Agent migrations. Weeks three and four: measure — Tab acceptance, time-to-first-PR for new starters, PR cycle time, NPS. Throughout, weekly office hours and a shared Slack channel with our team. The goal isn't a pilot success story — it's the data you'd need to roll this out to all of Adobe."*

**Beat 3 — Open Q&A (~5s)**

- **SAY (verbatim):**
  > *"That's the demo. Happy to go deeper on any of it — what would be most useful to dig into?"*
- **DO:** Stop sharing the slide deck. Open your Q&A prep ([`qa-cards.md`](./qa-cards.md)) on a second monitor if you have one.

---

## Live-demo creation beats (Layer 2)

These files are **not** loaded by Cursor automatically. They live here so you can paste their contents during the live demo as the "creating a rule live" / "encoding a workflow as a skill" moments. Both beats run inside Section 7; their stage directions are below.

### Beat 1 — Create a file-pattern rule live (~50s)

**Beat 1.1 — Frame the rule (~10s)**

- **SAY (verbatim):**
  > *"Rules govern how the agent behaves. The repo already has a testing-conventions rule that fired during Build — that's why Composer ran `npm test` without me asking. Rules can apply globally, like that one, or scoped to specific files. Watch — I'll add a scoped one live."*

**Beat 1.2 — Create the rule via command palette (~15s)**

- **DO:** Cmd+Shift+P to open the command palette. Type `Cursor add new rule`. Hit Enter.
- **SHOW:** Cursor's "new rule" dialog (or `.cursor/rules/` opening with a new file scaffolded — exact UX depends on Cursor version).
- **DO:** Name it `test-files.mdc`.
- **SAY (verbatim, while typing the name):**
  > *"`test-files.mdc`. This rule will only fire when the agent touches a Vitest test file."*

**Beat 1.3 — Paste the rule body (~15s)**

- **DO:** Paste the contents of `demo-prep/test-files.mdc` into the new file. Cmd+S to save.
- **SHOW:** `.cursor/rules/test-files.mdc` open in the editor with frontmatter and body visible.
- **SAY (verbatim, while pointing at the frontmatter):**
  > *"See the `globs` line — `**/*.test.{ts,tsx}`. This rule only loads when the agent is working on a test file. Stays out of context the rest of the time, which means it doesn't burn tokens on irrelevant work. Globally-applied rules can do the same thing for guardrails you always want on — strict mode, style guides, security patterns."*

**Beat 1.4 — Hand off to Beat 2 (~10s)**

- **SAY (verbatim):**
  > *"That's a rule. Five seconds to write, lives in the repo, every agent that touches this codebase inherits it. Now let's do skills."*

### Beat 2 — Encode the workflow you just demonstrated as a personal skill (~60s)

**Beat 2.1 — Frame the skill (~15s)**

- **SAY (verbatim — this is one of the five baked-in narration tweaks):**
  > *"I just walked you through Ask → Plan → Build with hand-editing `plan.md`. I'm going to capture that entire flow as a personal Skill. The next engineer on my team doesn't have to learn this workflow from scratch — they just type the slash command. This is how Cursor turns institutional knowledge into infrastructure."*

**Beat 2.2 — Create the skill via command palette (~15s)**

- **DO:** Cmd+Shift+P to open the command palette. Type `Cursor create skill`. Hit Enter.
- **SHOW:** Skill-creation dialog.
- **DO:** Choose `Personal` (saves to `~/.cursor/skills/`). Name it `pr-summary`.
- **SAY (verbatim, while clicking Personal):**
  > *"Personal — not repo-scoped. This means it follows me across every project I open in Cursor. Could also be Team-scoped if I wanted it published to my org."*

**Beat 2.3 — Paste the skill body (~15s)**

- **DO:** Paste the contents of `demo-prep/pr-summary.md` into the resulting `SKILL.md`. Cmd+S to save.
- **SHOW:** `~/.cursor/skills/pr-summary/SKILL.md` open in the editor with the frontmatter description and full body.
- **SAY (verbatim, while the file is on screen):**
  > *"The frontmatter description tells Cursor when this skill should fire. The body is just markdown — it's the SOP I follow when I write a PR description. Now any time I ask the agent to open a PR, it'll consult this skill and follow my house style. Twenty seconds of work, lasts the rest of my career."*

**Beat 2.4 — Team Kit hook (~10s, optional but recommended)**

- **SAY (verbatim):**
  > *"And that's the Cursor Team Kit story — 17 official skills published by the Cursor team, plus everything any team has shared internally. Skills are how Cursor goes from a single-engineer tool to a team multiplier. Adobe shows up on day one with that whole library."*

**Beat 2.5 — Hand back to Section 7 closing (~5s)**

- **DO:** Close the file. Cmd+W to clean up the editor.
- (Section 7's closing line — *"That's the multiplier..."* — runs next.)

## Files in this folder

- `diagrams.md` — Mermaid diagrams for the opening (surface area) and closing (two-track) slides
- `notes-alignment.md` — Friday-morning standalone reference: original notes + alignment table + the five narration tweaks verbatim
- `dry-run-protocol.md` — full IDE dry-run rehearsal protocol with pre-flight checks, prompts verbatim, success criteria, and fallback procedure. Includes dry-run results + 6 lessons learned.
- `qa-cards.md` — 10 prepared Q&A cards for the question block at the end. Includes universal curveball recovery moves and 10 facts to recite cold.
- `test-files.mdc` — file-pattern rule for Vitest test files (paste live during demo)
- `pr-summary.md` — personal skill for generating PR descriptions (paste live during demo)
