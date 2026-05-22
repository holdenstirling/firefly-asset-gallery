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
| 4 · ALL LIVE — Slack fire + Cloud Agent + Bugbot 4-tab walkthrough | 110s | 9:15 |
| 5 · Build mode | 3:30 | 12:45 |
| 6 · Review the result | 60s | 13:45 |
| 7 · Rules + Skills live creation | 2:00 | 15:45 |
| 7.5 · Enterprise controls | 25s | 16:10 |
| 8 · Two-track recap + trial plan | 60s | 17:10 |
| Q&A buffer | 1-3 min | within 20 min |

Total script: ~17:10. Allows ~3 min for organic Q&A inside a 20-min slot. Tight but achievable.

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

The dashboard already has visible Cloud Agent activity from this repo:
- PR #7 (Slack-fired JSDoc smoke test, merged)
- PR #4 (Bugbot autofix Cloud Agent, open)
- PR #3 (HOL-6 Playwright tests, open)
- PR #2 (HOL-5 Style Studio, merged — may be below the fold)

Show the dashboard. Narrate (this version is agnostic to which specific runs are at the top of the list):

> *"This is cursor.com/agents — Cursor isn't just an editor, it's a surface area. Same agents from anywhere: web, Slack, IDE. You can see runs from this repo — features shipped, tests in flight, autofixes from Bugbot. We'll come back to this dashboard later."*

**Optional pre-show staging (90 sec, only if you want a guaranteed-fresh run at the top of the dashboard):** fire `@Cursor in firefly-asset-gallery add a JSDoc comment to the cn helper in src/lib/utils.ts` in Slack ~5 minutes before showtime. The completed/streaming run will sit at the top of the dashboard during Section 1.

### 2. Where work actually starts: a Linear ticket (~30 sec)
Open Linear, show HOL-7.
> *"Real engineering work starts with a ticket. Watch what happens when Cursor reads one."*

### 3. THE PLAN MOMENT — switch to IDE on `firefly-asset-gallery`

**3.0. Create the feature branch first (~10 sec, silent):**

In the IDE terminal, before opening Ask mode:

```bash
git checkout main && git pull && git checkout -b feat/hol-7
```

Don't narrate this — it's silent setup. The point is to avoid Composer pushing commits to `main` later.

**3a. Ask mode (~90 sec) — quick context set. Paste verbatim:**

```
Read HOL-7 from Linear. Walk me through:
1. What's being asked (one paragraph)
2. What's already in this codebase that supports it
3. Which files will likely need to change

Don't write code or open the plan file. I want to scope first.
```

The agent will discover Style Studio just shipped and surface that HOL-7 builds on it. *Don't dwell here* — Ask is the prelude, not the headline.

**3b. Plan mode → switch model to Opus (~3 min) — THE headline beat:**

Switch model on screen. Narrate:
> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model."*

Paste verbatim (this is the dry-run-validated prompt — the two baked-in decisions save ~60s of on-stage architectural relitigation):

```
Implement HOL-7 using the linear-feature-flow workflow. Read AGENTS.md, the rules in .cursor/rules/, src/lib/store.ts, and src/lib/style-studio.ts before planning. Generate a structured implementation plan into plan.md following the skill's Phase 3 template.

Two decisions are already made — bake them into the plan:
1. Type extension: add an optional customPalette: { swatches: string[] } field on StudioStyle. StyleCard branches on its presence to render inline-style hex swatches.
2. Out of scope for HOL-7: Style picker in PromptBar. Saved palettes apply through the existing Style Studio "Apply" path only. Note this in the plan's "Out of scope" section.

Stop after writing plan.md — do not start implementation.
```

**3c. Edit `plan.md` live (~30 sec) — the human-in-the-loop moment:**

Open `plan.md`. Read the Goal aloud. Add ONE constraint in a NEW "Constraints" section near the top (NOT mixed into the file lists — Composer may rewrite those sections when checking AC boxes).

**Recommended (validated by dry-run):**

```
## Constraints
- Color extraction must run in under 100ms on a 1024×1024 image. Downsample to a max of 96×96 with offscreen canvas before histogram bucketing.
```

**Why this constraint:**
- ADDS to the ticket (perf budget), doesn't contradict it. The Linear ticket says nothing about extraction speed, so Composer has no source-of-truth conflict to rationalize around.
- Demonstrable on stage: audience can verify Composer adds the downsampling step in the generated `palette-extraction.ts`.
- Adobe-flavored: implies "must work for high-res Firefly outputs."

**Avoid:** Constraints that contradict the Linear ticket text. Example anti-pattern from the dry-run: the ticket specified `Palette` Lucide icon, so adding "use Droplet icon instead" gets ignored because Opus correctly trusts the ticket.

Narrate:
> *"This is the moment. The plan is a file. I edit it like code. One line — extraction has to run in under 100ms on a 1024×1024 image. The agent doesn't get autonomy until I sign off."*

**Sequencing note — do NOT paste the Build prompt yet.** The async story (Section 4) goes BEFORE Build. The order on stage is:
1. Finish hand-edit, deliver the "sign off" line above
2. Pivot to browser tabs for the 4-tab async story (Section 4, ~90 sec)
3. Return to IDE, switch model to Composer, paste the Build prompt (Section 5)

This is the sequential path — safer narratively. If you want to overlap Build and async (saves ~90 sec wall-clock), see "Concurrent variant" at the end of this file.

### 4. Fan out async work — ALL LIVE Cloud Agent demonstration (~110 sec)

**All four tabs are live. No pre-recorded video. No pre-staged scrolling to old threads.** You fire a fresh `@Cursor` mention in Slack on stage — `@Cursor` acknowledges in <15 sec (smoke-tested) — and you walk through the visible activity in real time. Tabs 3 and 4 still show yesterday's PR #3 and PR #4 as evidence of what happens when the loop completes (Bugbot takes 5-15 min to review a fresh PR, which is why those two stay as historical artifacts).

**Tab 1 — Slack: live-fire `@Cursor` (~30 sec):**

Switch to the Slack tab — your DM with `@Cursor` is already open.

> *"Models are good enough now that they can run asynchronously. While I plan locally, work with clear scope fans out to Cloud Agents. Watch this."*

Paste this message and hit Enter:

```
@Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
```

@Cursor acknowledges within ~15 sec. Narrate over the acknowledgment:

> *"Same surface area, real-time. Three sentences in Slack. The agent picks it up, clones the repo, gets to work — all in Cursor's infrastructure, not on my laptop. Let me show you what that looks like on the dashboard."*

**Tab 2 — `cursor.com/agents`: live run streaming (~25 sec):**

Switch to the `cursor.com/agents` tab. Refresh if needed. Click into the brand-new run that just appeared at the top.

> *"Cursor's web dashboard. There's the run I just fired — happening live right now. Streams its work as it goes. Engineer goes to a meeting, comes back, the PR is open.*
>
> *Now — here's where this gets interesting. The same loop ran yesterday for a different ticket. Let me show you what happens once Cursor's done."*

**Tab 3 — PR #3 with Bugbot review (~30 sec):**

Switch to PR #3, anchored to Bugbot's comment on `asset-card.tsx:44`.

> *"PR #3. Cloud Agent opened it yesterday after the same Slack-fired flow. Playwright tests for the gallery — exactly what was asked for. But — and this is the part that punches above its weight — Bugbot, Cursor's automated reviewer, caught something the agent introduced that I would've shipped. Keyboard events from the nested favorite button bubble up to the card's `onKeyDown`, so a keyboard user pressing Enter on the favorite accidentally opens the detail modal too. That's an a11y bug. The kind of thing that fails an Adobe accessibility review."*

**Tab 4 — PR #4 with Bugbot autofix (~25 sec):**

Switch to PR #4 Files Changed view. Point at the 2-line diff and the `cursoragent@cursor.com` author.

> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams. Now — back to my local work."*

**Pre-demo tab order (left to right in the browser, all open BEFORE the demo starts):**
1. https://cursor.com/agents — dashboard, signed in, scrolled to top
2. Slack workspace `holdenstirling`, DM with `@Cursor` open, scrolled to bottom, ready to paste
3. https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971 — auto-scrolls to Bugbot's comment
4. https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files — PR #4 Files Changed view

**Friday morning sanity check (3 min):**
1. Open all 4 tabs cold, in order, and click through them once with the narration cues
2. **Slack smoke test** — fire this exact message in your `@Cursor` DM and time the response:
   ```
   @Cursor what version of Next.js does firefly-asset-gallery use?
   ```
   Expected: acknowledgment within 15 seconds. If response is consistently slower, see "Recovery if @Cursor is slow" below.

**Recovery if @Cursor is slow on the day:**

If @Cursor takes >20 sec to respond when you fire the live mention in Section 4 Tab 1, say:

> *"Sometimes the agent takes a moment — let me show you a run from yesterday while we wait."*

Then pivot directly to Tab 3 (PR #3). When @Cursor's acknowledgment comes through later in the demo, you can briefly return to Tab 1 to point at it: *"And there it is — same loop just kicked off."*

### 5. Build mode → switch model to Composer (~3:30 min)

Switch model on screen. Narrate:
> *"For Build, I'm switching to Composer-1 — Cursor's own model, optimized for tool-using speed inside the IDE. Plan mode used Opus for breadth. Build phase wants speed."*

Paste verbatim (this is the dry-run-validated prompt — the explicit Phase 5 reference is what triggers the testing-conventions rule to run tests after each step):

```
Execute plan.md. Follow the linear-feature-flow Phase 5 protocol: run lint and tests after each meaningful step. Open the result as a draft PR when done.
```

Let it work. Show file tree updating, tests running automatically (call this out — *"watch — tests fire on their own because of the testing-conventions rule"*). If anything fails, let Composer self-correct once.

### 6. Review the result (~1 min)
- Open the new `/palette-extractor` page in the browser. Paste a `picsum.photos/seed/firefly-cover/1280/400` URL and show colors extracted.
- Run `npm test` in a terminal to show tests still pass (expect 23/23 based on dry-run).
- Optional: switch to the GitHub PR Composer just opened and show the linked Linear AC checklist updates.

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

---

## Concurrent variant (advanced, optional)

If you want to recover ~90 seconds of wall-clock and you're feeling confident, run Sections 3-5 concurrently instead of sequentially:

1. Finish hand-editing `plan.md`
2. Switch to Composer, paste the Build prompt **immediately** (don't wait)
3. While Composer runs in the background, pivot tabs to the async story (Section 4)
4. Narrate the 4 tabs while Composer works — by the time you return to the IDE, Composer should be 80-90 sec into its 3:30 min run
5. Continue narrating Section 5 over the remaining Composer work

**Why this is harder:** The audience sees Composer working out of the corner of their eye and may get distracted. If Composer fails silently while you're in Slack/GitHub tabs, you don't notice until you're back. Higher cognitive load on you, the presenter.

**Why this saves time:** Section 4 (90 sec) overlaps with Composer's first 90 sec instead of adding to wall-clock. Total drops from ~16:50 to ~15:20.

**Recommendation:** Default to sequential. Switch to concurrent only if you've rehearsed it twice and the dry-run timing left you under-budget.

---

## Friday cheat sheet (read this on stage)

The runbook above is the canonical script. This appendix is the at-a-glance setup, checklist, and recovery sheet you can keep open in a side window during the demo.

### Pre-show setup — T-30 min

**Browser tabs (left to right, in this order):**
1. `https://cursor.com/agents` — dashboard, signed in, scrolled to top
2. Slack `holdenstirling` — DM with `@Cursor`, scrolled to bottom, cursor in the input box
3. `https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971` — auto-anchored to Bugbot's a11y comment
4. `https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files` — PR #4 Files Changed
5. Linear HOL-7 — for Section 2

**IDE state:**
- Cursor open on `firefly-asset-gallery`
- Branch: `main`, clean working tree
- One terminal pane open in the project root
- Dev server **off** (you'll start it during Section 6, not before)
- `plan.md` is the empty placeholder

**Slides 1–4** open in presenter mode on the second monitor.

### Friday-morning checklist — T-30 min

- [ ] `git status` on `firefly-asset-gallery` clean, on `main`
- [ ] `plan.md` is the empty placeholder
- [ ] All 5 browser tabs loaded in order, scroll positions verified
- [ ] **Slack smoke test:** fire `@Cursor what version of Next.js does firefly-asset-gallery use?` — acknowledgment <15 sec
- [ ] Linear HOL-7 ACs all unchecked (Cmd+K → `HOL-7` to verify)
- [ ] Slides 1–4 open on second monitor
- [ ] Dev server **not** running yet
- [ ] One terminal open in project root
- [ ] Cursor signed in, Opus (`claude-opus-4-7-thinking-xhigh`) + Composer (`composer-1`) both available in model picker
- [ ] Phone on Do Not Disturb, Slack notifications muted on the main monitor
- [ ] Water, deep breath, go

### Universal recovery moves

| What goes wrong | Verbal cover | Action |
|---|---|---|
| `@Cursor` slow in Section 4 (>20s) | *"Sometimes the agent takes a moment — let me show you a run from yesterday while we wait."* | Skip to Tab 3 (PR #3) immediately. Return to Tab 1 if ack arrives later. |
| Composer stalls or self-corrects badly in Section 5 | *"This is the kind of thing rules normally catch — let me show you what the finished diff looks like."* | `git checkout dry-run/hol-7-prebuilt` and walk the diff |
| Dev server won't start in Section 6 | *"Port conflict — happens."* | `lsof -ti:3030 \| xargs kill -9 && PORT=3030 npm run dev` |
| Plan-mode Opus drifts from the skill's Phase 3 template | *"Let me edit this directly — the plan is a file."* | Hand-edit `plan.md` yourself. The hand-edit beat (3c) already covers this. |
| Bugbot's PR #3 comment won't load (GitHub flake) | *"Refresh."* | If GitHub is down, narrate from memory using qa-cards.md as backup |
| Network drops entirely | *"Looks like the network just dropped — let me switch to local."* | IDE + dev server work offline. Skip Section 4 entirely, lean into Section 7 (rules/skills) which is offline-safe. |
| Question you can't answer | *"I'd want to confirm that with the customer success team before I commit to a number."* | Don't fabricate. See qa-cards.md "Universal curveball recovery" for more language. |
| Linear MCP fails inside Cursor | *"MCP server hiccup — let me paste the ticket text directly."* | Have HOL-7's description copied to clipboard as fallback |
| Slack workspace logged out | n/a — silent pivot | Same `@Cursor` mention works from the web UI; or skip Section 4 Tab 1, narrate from Tab 2 |

### Pre-Friday rehearsal targets

1. **Full timed read-through end-to-end** — out loud, against a stopwatch. Confirm 17:10 wall-clock.
2. **Four high-leverage moments rehearsed twice each:** Adobe framing (0a), plan-mode hand-edit narration (3c), enterprise controls beat (7.5), closing recap (8).
3. **Skim a recent Cursor customer story** for a name-drop ([PayPal](https://cursor.com/blog/paypal), [NAB](https://cursor.com/blog/nab), [Amplitude](https://cursor.com/blog/amplitude)).
4. **Skim `qa-cards.md`** for the 10 prepared answers + universal curveball moves.
