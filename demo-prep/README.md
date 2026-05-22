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

## Live-demo runbook (15-18 min target, ~14 min script + Q&A buffer)

**Time budget** (revised after 0a + 7.5 inserts):

| Section | Time | Cumulative |
|---|---|---|
| 0a · Adobe problem framing | 25s | 0:25 |
| 0 · Opening + surface area diagram | 30s | 0:55 |
| 1 · cursor.com/agents | 60s | 1:55 |
| 2 · Linear ticket | 30s | 2:25 |
| 3 · Ask → Plan → hand-edit | 5:00 | 7:25 |
| 4 · Cloud Agent + Bugbot 4-tab walkthrough (incl. 15-20s screencast) | 90s | 8:55 |
| 5 · Build mode | 3:30 | 12:25 |
| 6 · Review the result | 60s | 13:25 |
| 7 · Rules + Skills live creation | 2:00 | 15:25 |
| 7.5 · Enterprise controls | 25s | 15:50 |
| 8 · Two-track recap + trial plan | 60s | 16:50 |
| Q&A buffer | 1-3 min | within 20 min |

Total script: ~17 min. Allows 3 min for organic Q&A inside a 20-min slot. Tight but achievable.

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
Pre-stage 1–2 completed runs (HOL-5 already shipped, HOL-6 PR #3 still open). Show the dashboard.
> *"This is cursor.com/agents — Cursor isn't just an editor, it's a surface area. Same agents from anywhere: web, Slack, IDE."*

### 2. Where work actually starts: a Linear ticket (~30 sec)
Open Linear, show HOL-7.
> *"Real engineering work starts with a ticket. Watch what happens when Cursor reads one."*

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

### 4. Fan out async work — Cloud Agent recap (~80 sec, ALL LIVE)

**No pre-recorded video.** Walk through 4 pre-staged browser tabs in this exact order. Every artifact is real and was produced yesterday — that's the credibility play.

**Tab 1 — Slack thread (~15 sec):**
Open the holdenstirling Slack workspace, navigate to the channel with the original `@Cursor pick up HOL-6` ping.
> *"Models are good enough now that they can run asynchronously. While I plan locally, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. I sent this yesterday from Slack — `@Cursor`, here's the Linear ticket."*

**Tab 2 — `cursor.com/agents` run detail for HOL-6 (~25 sec, includes 15-20s screencast):**

Open the dashboard for HOL-6. Play the pre-recorded screencast inline (see capture instructions below).

> *"Cursor's web dashboard. This is the Cloud Agent that picked it up — runs in Cursor's infrastructure, not on my laptop. Here's what it looked like when it ran [play 15-20s screencast]. Streams its work as it goes. Engineer goes to a meeting, comes back, the PR is open."*

**Screencast capture — DO THIS BEFORE FRIDAY (~10 min, Option B from plan):**

1. In Slack `holdenstirling`, fire a small new Cloud Agent task in `firefly-asset-gallery`:
   ```
   @Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
   ```
2. Open `cursor.com/agents`, click into the new run as soon as it shows up.
3. Start macOS Screen Recording (`Cmd+Shift+5` -> "Record Selected Portion") on the dashboard's activity stream.
4. Capture 15-20 seconds of the agent streaming its work (file reads, tool calls, edits).
5. Save the clip to `~/Movies/cloud-agent-stream.mov` (or wherever you keep demo assets).
6. Close the disposable PR without merging — it was just for the capture.

Result: a known-good 15-20s clip you can drop into Keynote, or play full-screen via QuickTime during the demo.

**Tab 3 — PR #3, scrolled to Bugbot's comment on `asset-card.tsx:44` (~30 sec):**
> *"It opened PR #3 with Playwright e2e tests. But — and this is the part that punches above its weight — Bugbot, Cursor's automated reviewer, caught something the agent introduced that I would've shipped: keyboard events from the nested favorite button bubble up to the card's `onKeyDown`, so a keyboard user pressing Enter on the favorite accidentally opens the detail modal too. That's an a11y bug. The kind of thing that fails an Adobe accessibility review."*

**Tab 4 — PR #4, show the 2-line diff and the `cursoragent@cursor.com` author (~25 sec):**
> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. This is one of Cursor's newer capabilities — Bugbot doesn't just review, it can dispatch the fix to a Cloud Agent in one click. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams."*

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
- Open the new `/palette-extractor` page in the browser
- Run `npm test` to show tests still pass
- (If Bugbot is wired up by Friday, open the PR and show Bugbot's comments)

### 7. Rules + Skills wrap (~2 min)
See "Live-demo creation beats" below.

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

### 8. Trial success plan + Q&A (~1.5 min)
Two closing slides:
1. **"Two-track workflow"** diagram (see [diagrams.md](./diagrams.md) — Diagram 2). "Here's what you just saw."
2. Trial plan:
   - Week 1: install + 5 power-user pilots + `.cursor/rules` setup
   - Week 2: Bugbot wired on 2–3 active repos + first Cloud Agent migrations
   - Weeks 3–4: measure (Tab acceptance, time-to-first-PR for new starters, PR cycle time, NPS)
   - Throughout: weekly office hours + shared Slack channel

---

## Live-demo creation beats (Layer 2)

These files are **not** loaded by Cursor automatically. They live here so you can paste their contents during the live demo as the "creating a rule live" / "encoding a workflow as a skill" moments.

## How to use during the demo

### Beat 1 — Create a file-pattern rule live (~30 seconds)

> *"Rules can apply globally — like the testing one — or scoped to specific files. Watch."*

1. In the Cursor command palette, run **`/Cursor add new rule`** (or open `.cursor/rules/` and create a new file).
2. Name it `test-files.mdc`.
3. Paste the contents of `test-files.mdc` from this folder.
4. Show the frontmatter — `globs: **/*.test.{ts,tsx}` — and explain: *"this rule only loads when the agent touches a test file. Saves context for the rest of the time."*

### Beat 2 — Encode the workflow you just demonstrated as a personal skill (~45 seconds)

> *"I just walked you through Ask → Plan → Build with hand-editing `plan.md`. I'm going to capture that entire flow as a personal Skill. The next engineer on my team doesn't have to learn this from scratch — they just type the slash command. This is how Cursor turns institutional knowledge into infrastructure."*

1. Open the command palette → **`/Cursor create skill`**.
2. Choose **Personal** (`~/.cursor/skills/`).
3. Name it `pr-summary`.
4. Paste the contents of `pr-summary.md` from this folder into the resulting `SKILL.md`.
5. Show that it's now usable across all projects, not just this one.

Optional follow-up beat: *"And that's the Cursor Team Kit story — 17 official skills published, plus everything any team has shared internally. Skills are how Cursor goes from a single-engineer tool to a team multiplier."*

## Files in this folder

- `diagrams.md` — Mermaid diagrams for the opening (surface area) and closing (two-track) slides
- `notes-alignment.md` — Friday-morning standalone reference: original notes + alignment table + the five narration tweaks verbatim
- `dry-run-protocol.md` — full IDE dry-run rehearsal protocol with pre-flight checks, prompts verbatim, success criteria, and fallback procedure. Includes dry-run results + 6 lessons learned.
- `qa-cards.md` — 10 prepared Q&A cards for the question block at the end. Includes universal curveball recovery moves and 10 facts to recite cold.
- `test-files.mdc` — file-pattern rule for Vitest test files (paste live during demo)
- `pr-summary.md` — personal skill for generating PR descriptions (paste live during demo)
