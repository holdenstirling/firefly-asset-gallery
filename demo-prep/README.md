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
| 4 · Cloud Agent + Bugbot 4-tab walkthrough (incl. 15-20s live stream) | 90s | 8:55 |
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

**3a. Ask mode (~90 sec) — quick context set:**
> "Read HOL-7 from Linear. Walk me through what's being asked and which files in this codebase will need to change."

The agent will discover Style Studio just shipped and surface that HOL-7 builds on it. *Don't dwell here* — Ask is the prelude, not the headline.

**3b. Plan mode → switch model to Opus (~3 min) — THE headline beat:**

Switch model on screen. Narrate:
> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model."*

```
Use HOL-7 as the brief. Read AGENTS.md, the rules in .cursor/rules, and src/lib/store.ts (the Style Studio store) before planning. Generate a structured implementation plan into plan.md.
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

### 4. Fan out async work — Cloud Agent recap (~80 sec, ALL LIVE)

**No pre-recorded video.** Walk through 4 pre-staged browser tabs in this exact order. Every artifact is real and was produced yesterday — that's the credibility play.

**Tab 1 — Slack thread (~15 sec):**
Open the holdenstirling Slack workspace, navigate to the channel with the original `@Cursor pick up HOL-6` ping.
> *"Models are good enough now that they can run asynchronously. While I plan locally, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. I sent this yesterday from Slack — `@Cursor`, here's the Linear ticket."*

**Tab 2 — `cursor.com/agents` run detail for the live pre-fire agent (~25 sec, 15-20s of live streaming):**

Open the dashboard for the agent you pre-fired ~5 min before the demo (see pre-fire steps below). It should be mid-flight by now, actively streaming tool calls.

> *"Cursor's web dashboard. This is a Cloud Agent that's running right now — in Cursor's infrastructure, not on my laptop. You can watch it stream as it goes [pause 15-20s, point at the live tool calls / file reads / edits as they land]. Engineer goes to a meeting, comes back, the PR is open."*

**Pre-fire BEFORE you start the demo (~5 min before kickoff):**

Cloud Agents take a couple of minutes to spin up. The agent needs to be actively streaming when you reach Tab 2 (~8 min into the script), so fire it ~5 min before you start narrating.

1. In Slack `holdenstirling`, fire a small new Cloud Agent task in `firefly-asset-gallery`:
   ```
   @Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
   ```
   Intentionally small but visibly multi-step (reads `src/lib/picsum.ts`, edits it, opens a PR) so the activity stream has something interesting to watch for ~15-20 sec.
2. Open `cursor.com/agents` in a browser tab and click into the new run as soon as it appears. Keep this tab open as **Tab 2** in your pre-staged tab order — it *is* the live demo asset.
3. Verify the run is actively streaming (tool calls landing every few seconds). If it's already finished by the time you check, fire a second one with a slightly different prompt and use that run instead.
4. After the demo, close the disposable PR without merging — it was just for the live stream.

**Fallback if the agent finishes early or fails:**

- **Finished early:** scroll the activity stream back to a section with dense tool calls and walk through it as a completed run. Tweak the narration: drop "right now," and say *"Here's what it looked like as it ran"* — same beat, no panic.
- **Failed to start / errored:** switch to Tab 3 a beat early and bridge with *"Cloud Agent runs in Cursor's infrastructure — same surface area as the dashboard you just saw — and here's what it produced on a real run yesterday: PR #3."* The PR #3 narration already covers the "agent did real work" point.

**Tab 3 — PR #3, scrolled to Bugbot's comment on `asset-card.tsx:44` (~30 sec):**
> *"It opened PR #3 with Playwright e2e tests. But — and this is the part that punches above its weight — Bugbot, Cursor's automated reviewer, caught something the agent introduced that I would've shipped: keyboard events from the nested favorite button bubble up to the card's `onKeyDown`, so a keyboard user pressing Enter on the favorite accidentally opens the detail modal too. That's an a11y bug. The kind of thing that fails an Adobe accessibility review."*

**Tab 4 — PR #4, show the 2-line diff and the `cursoragent@cursor.com` author (~25 sec):**
> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. This is one of Cursor's newer capabilities — Bugbot doesn't just review, it can dispatch the fix to a Cloud Agent in one click. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams."*

**Pre-demo tab order (left to right in the browser):**
1. https://cursor.com/agents — dashboard, the pre-fired picsum JSDoc run open and actively streaming
2. Slack workspace `holdenstirling`, channel with the `@Cursor` thread
3. https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971 — auto-scrolls to Bugbot's comment
4. https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files — PR #4 Files Changed view

**Friday morning sanity check (2 min):**
- Open all 4 tabs cold, in order, and click through them once with the narration cues. If any tab fails to load or scroll to the right place, you'll catch it before the meeting starts, not during.

### 5. Build mode → switch model to Composer (~4 min)
Switch model on screen. Narrate:
> *"For Build, I'm switching to Composer-1 — Cursor's own model, optimized for tool-using speed inside the IDE. Plan mode used Opus for breadth. Build phase wants speed."*

```
Execute plan.md.
```

Let it work. Show file tree updating, tests running. If anything fails, let Composer self-correct once.

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
