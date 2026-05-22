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

### Legend used in every section below

Every beat from here on uses the same labels so you can scan it cold on Friday morning:

- **Surface** — what's on screen (Keynote, IDE, browser tab, terminal).
- **Agent / model** — which mode + model is active, or "None — narration only."
- **Do** — physical actions: click, switch, open, scroll.
- **Paste into [target]** — *literal* text to copy and paste. Lives inside a fenced code block.
- **Say (verbatim)** — *literal* text to speak. Lives inside a `> *"..."*` blockquote. If you only memorize the **Say** blocks, you have the script.
- **Avoid / Don't** — anti-patterns from the dry-run.
- **Why this [beat / prompt / constraint]** — reasoning, in case you get asked or need to improvise.
- **Sequencing / Next** — what comes after this beat.

Rule of thumb: anything in a fenced ```code block``` is *paste*, anything in a `> *italic blockquote*` is *speak*. Anything else is stage direction.

---

### 0a. Adobe problem framing (~25 sec)

**Surface:** Keynote — title slide. No product on screen.
**Agent / model:** None — narration only.

**Do:**
- Stay on the title slide. Don't switch apps. Don't pull up Cursor yet.
- Make eye contact with the room (or camera). This is the only beat that's pure voice.

**Say (verbatim):**
> *"Quick frame before we dive in. Adobe ships across Creative Cloud — Photoshop, Firefly, Acrobat — with thousands of engineers across hundreds of repos, hard accessibility requirements, and IP that can't leak. The bar for any AI tool here is: does it move work forward without giving up code review, governance, or security? Everything in the next 17 minutes is aimed at that bar."*

**Avoid:**
- Don't name Claude Code here. It's a Q&A topic only.
- Don't start any product UI. Title slide only.

**Why this beat exists:** The interview prompt explicitly grades on "Problem-Solution Alignment — present a simple, realistic challenge a team like Adobe might face." Without this beat, the demo shows what Cursor can do but never names what Adobe is trying to solve. The three constraints (engineers / a11y / IP) map directly to three later beats: a11y → Bugbot finds keyboard bug, IP → enterprise security beat, engineers → rules and skills scaling.

**Sequencing / Next:** Advance to the "Where Cursor lives" diagram (Section 0).

---

### 0. Opening agenda slide (~30 sec)

**Surface:** Keynote — two slides.
1. **"Where Cursor lives"** diagram (see [diagrams.md](./diagrams.md) — Diagram 1).
2. Agenda.

**Agent / model:** None — narration only.

**Do:**
- Advance to slide 1 ("Where Cursor lives"). Let it sit for ~3 sec before speaking — let recognition land.
- Advance to slide 2 (Agenda) as you start the spoken intro.

**Slide 2 bullets (already on slide — don't re-read all three, glance and continue):**
- Where Cursor lives
- The Ask → Plan → Build workflow
- How this scales: rules, skills, Bugbot

**Say (verbatim):**
> *"Hi, I'm Holden. Over the next 17 minutes I'll walk you through three things: where Cursor lives — it's not just an editor anymore; the workflow engineering teams run today — read a ticket, plan with Opus, build with Composer, fan out async work to Cloud Agents; and how this scales beyond one engineer with rules, skills, and Bugbot. I'll keep slides minimal — most of this is in a real codebase. Jump in with questions any time."*

**Sequencing / Next:** Switch from Keynote to browser, tab on `cursor.com/agents`.

---

### 1. Where Cursor lives — cursor.com/agents (~1 min)

**Surface:** Browser — `cursor.com/agents`. Pre-stage 1-2 completed runs (HOL-5 already shipped, HOL-6 PR #3 open).
**Agent / model:** None — narration only (no agent invoked in this section).

**Do:**
- Switch to the browser. The tab should already be on the dashboard with the pre-staged runs visible.
- **Do not** click into any run yet. The list view *is* the point — multiple agents, one surface.

**Say (verbatim):**
> *"This is cursor.com/agents — Cursor isn't just an editor, it's a surface area. Same agents from anywhere: web, Slack, IDE."*

**Sequencing / Next:** Switch to the Linear tab (Section 2).

---

### 2. Where work actually starts: a Linear ticket (~30 sec)

**Surface:** Browser — Linear, HOL-7 open.
**Agent / model:** None — narration only.

**Do:**
- Switch to the Linear tab. HOL-7 should already be open.
- Don't read the ticket aloud — the audience reads faster than you can speak. Let them see it for ~3 sec while you talk.

**Say (verbatim):**
> *"Real engineering work starts with a ticket. Watch what happens when Cursor reads one."*

**Sequencing / Next:** Switch to Cursor IDE on `firefly-asset-gallery`, branch `main` (Section 3).

---

### 3. THE PLAN MOMENT

**Surface:** Cursor IDE on `firefly-asset-gallery`, branch `main`. Chat pane empty.

This section has three sub-beats: **3a (Ask)** → **3b (Plan + Opus)** → **3c (hand-edit)**.

---

### 3a. Ask mode (~90 sec) — quick context set

**Surface:** Cursor IDE, chat pane.
**Agent / model:** **Ask mode**, default model.

**Do:**
- Confirm Ask mode is selected (top of chat pane).
- Paste the prompt below and hit Enter.
- Let the agent stream its findings. Don't dwell — Ask is the prelude, not the headline.

**Paste into chat:**
```
Read HOL-7 from Linear. Walk me through what's being asked and which files in this codebase will need to change.
```

**Say (over the streaming output, ~2 short asides — don't talk continuously):**
- When it surfaces the Style Studio store: *"Notice it found Style Studio on its own — it just shipped on `main`, and HOL-7 builds on it. That's the kind of mapping I'd be doing by hand otherwise."*
- As it wraps: *"Twenty seconds of context-setting. Now we plan."*

**Avoid:** Don't try to read every file the agent surfaces aloud. Highlight one, then move on.

**Sequencing / Next:** Switch model to **Opus** **and** switch mode to **Plan** (Section 3b).

---

### 3b. Plan mode + Opus (~3 min) — THE headline beat

**Surface:** Cursor IDE, chat pane.
**Agent / model:** **Plan mode** + **Claude Opus**. Switch both **visibly** — the model switch is part of the show.

**Do:**
- Switch the mode dropdown to **Plan**.
- Switch the model dropdown to **Opus**. Audience needs to see both switches happen.
- Paste the prompt below and hit Enter.

**Say (while switching mode + model, BEFORE pasting):**
> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model."*

**Paste into chat:**
```
Use HOL-7 as the brief. Read AGENTS.md, the rules in .cursor/rules, and src/lib/store.ts (the Style Studio store) before planning. Generate a structured implementation plan into plan.md.
```

**Say (over the streaming output, 2-3 sparse asides — NOT continuous):**
- When it starts reading `AGENTS.md`: *"It's reading my project's `AGENTS.md` first — the same file any teammate would read. Rules aren't magic, they're context."*
- When it begins writing `plan.md`: *"Plan mode is writing markdown, not code. This is the artifact I'll sign off on before any code is touched."*
- As it finishes: *"That's the plan. Goal, scope, file-by-file edits, AC. All in `plan.md` on disk."*

**Avoid:** Don't interrupt to ask the agent for changes mid-stream. Let the plan land complete, then hand-edit in 3c.

**Why this prompt:** Naming `AGENTS.md`, `.cursor/rules`, and `src/lib/store.ts` explicitly forces Opus to read them. Without those names, it may guess. With them, the plan is grounded in repo reality and the audience sees the agent doing its homework.

**Sequencing / Next:** Open `plan.md` for the hand-edit (Section 3c).

---

### 3c. Hand-edit plan.md (~30 sec) — human-in-the-loop

**Surface:** Cursor IDE — open `plan.md`.
**Agent / model:** None — you edit the file by hand.

**Do:**
- Read the Goal aloud.
- Add ONE constraint in a NEW `## Constraints` section near the top (NOT inside file lists — Composer may rewrite those when checking AC boxes).
- Save.

**Paste into `plan.md` (validated by dry-run):**
```
## Constraints

- Color extraction must run in under 100ms on a 1024×1024 image. Downsample to a max of 96×96 with offscreen canvas before histogram bucketing.
```

**Why this constraint (not something else):**
- Adds a perf budget the Linear ticket doesn't mention — no source-of-truth conflict for Composer to rationalize around.
- Demonstrable on stage: audience can verify Composer adds the downsampling step in the generated `palette-extraction.ts`.
- Adobe-flavored: implies high-res Firefly outputs must work.

**Avoid:** Constraints that contradict the ticket. Dry-run anti-pattern: ticket specifies `Palette` Lucide icon → hand-editing "use `Droplet` instead" gets ignored because Opus correctly trusts the ticket.

**Say (after saving the file):**
> *"This is the moment. The plan is a file. I edit it like code. One line — extraction has to run in under 100ms on a 1024×1024 image. The agent doesn't get autonomy until I sign off."*

**Don't:** Paste the Build prompt yet. Next step is Section 4 (browser tabs, async story). Return to the IDE for Section 5 only after Tab 4.

**Sequencing (default path):** 3c sign-off → Section 4 (~90s) → Section 5 (switch to Composer, paste Build). Safer narratively. To overlap Build with the async story and save ~90s wall-clock, see `dry-run-protocol.md` fallback notes.

### 4. Fan out async work — Cloud Agent + Bugbot recap (~90 sec, ALL LIVE)

**Surface:** Browser — 4 pre-staged tabs.
**Agent / model:** None invoked on stage. Tab 2 shows a live Cloud Agent that was pre-fired ~5 min before the demo. Tabs 3-4 show agents that ran yesterday.

**No pre-recorded video.** Every artifact is real. That's the credibility play.

**Pre-demo tab order (left to right):**
1. https://cursor.com/agents — dashboard, the pre-fired picsum JSDoc run open and actively streaming
2. Slack workspace `holdenstirling`, channel with the `@Cursor` thread
3. https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971 — auto-scrolls to Bugbot's comment
4. https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files — PR #4 Files Changed view

**Friday morning sanity check (2 min):** open all 4 tabs cold, in order, and click through them once with the narration cues. If any tab fails to load or scroll to the right place, you catch it before the meeting starts.

---

#### Tab 1 — Slack thread (~15 sec)

**Surface:** Slack workspace `holdenstirling`, channel with the original `@Cursor pick up HOL-6` ping.
**Agent / model:** N/A — viewing a historical Slack message.

**Do:** Switch to the Slack tab. Don't scroll — leave the original ping visible.

**Say (verbatim):**
> *"Models are good enough now that they can run asynchronously. While I plan locally, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. I sent this yesterday from Slack — `@Cursor`, here's the Linear ticket."*

**Sequencing / Next:** Switch to Tab 2 (live agent on `cursor.com/agents`).

---

#### Tab 2 — Live Cloud Agent on `cursor.com/agents` (~25 sec, 15-20s of live streaming)

**Surface:** Browser — `cursor.com/agents`, run detail for the pre-fire agent.
**Agent / model:** Live Cloud Agent (the picsum-JSDoc one you pre-fired ~5 min before the demo).

**Do:**
- Switch to the dashboard tab. Confirm the agent is mid-flight (tool calls landing every few seconds).
- Stand still. Don't click around — the activity stream *is* the demo.
- Pick 2-3 patter beats below based on what's actually on screen this second.

(See **Pre-fire BEFORE you start the demo** below for the setup.)

**Say (opening line, ~3 sec, as you switch to the tab):**
> *"Cursor's web dashboard. This is a Cloud Agent that's running **right now** — in Cursor's infrastructure, not on my laptop."*

**Say (patter for the 15-20s pause — pick 2-3 based on what's on screen, NOT all five):**

- **If the agent is reading a file:**
  > *"Watch this — it's reading `src/lib/picsum.ts` to understand the existing shape before it edits. Same pattern Composer uses locally; this one's just remote."*
- **If an edit is landing:**
  > *"There — that's the edit. JSDoc block, generated and inserted in the right spot. No context switch, no IDE on my machine."*
- **If a tool-call panel is expanding:**
  > *"Every tool call is visible. Read, edit, terminal — all auditable. This is what 'governance' actually looks like in practice."*
- **If the agent is opening a PR:**
  > *"And there's the PR opening — that's the handoff back to humans."*
- **Generic filler if nothing photogenic is on screen this second:**
  > *"Same primitives as Composer in the IDE — read, edit, run, commit — just running on Cursor's machines instead of mine. I could close my laptop right now and this would still finish."*

**Say (closing line, ~3 sec, as you switch to Tab 3):**
> *"Engineer kicks it off, goes to a meeting, comes back, the PR is open. Speaking of PRs — here's a real one from yesterday."*

**Stage tips while the stream is running:**
- Stand still. Don't click around in the dashboard. The activity stream *is* the demo; let it be the moving thing on screen.
- If the log is showing a quiet moment, scroll up a few entries to surface a denser tool-call section before resuming patter. The audience reads that as "reviewing recent work" — totally natural.
- If an audience question lands mid-stream, **answer it**. The stream keeps running on screen behind your voice, which is a better demo of "asynchronous" than the scripted version. Resume the close when the question is done.

---

##### Pre-fire BEFORE you start the demo (~5 min before kickoff)

Cloud Agents take a couple of minutes to spin up. The agent needs to be actively streaming when you reach Tab 2 (~8 min into the script), so fire it ~5 min before you start narrating.

**Paste into Slack `holdenstirling` (in the firefly-asset-gallery channel):**
```
@Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
```

Intentionally small but visibly multi-step (reads `src/lib/picsum.ts`, edits it, opens a PR) so the activity stream has something interesting to watch for ~15-20 sec.

**Do (after pasting):**
1. Open `cursor.com/agents` in a browser tab and click into the new run as soon as it appears. Keep this tab open as **Tab 2** in your pre-staged tab order — it *is* the live demo asset.
2. Verify the run is actively streaming (tool calls landing every few seconds).
3. After the demo, close the disposable PR(s) without merging — they were just for the live stream.

**Fallback paste if the first agent finishes too early — paste into Slack:**
```
@Cursor in firefly-asset-gallery add a JSDoc comment to cn in src/lib/utils.ts describing the inputs and merge behavior
```

Use that second run as Tab 2 instead.

**Pre-fire timing cheat sheet:**

| T-minus | Action |
|---|---|
| ~7 min | Paste the first `@Cursor` Slack prompt. Switch back to setting up other demo tabs. |
| ~5 min | Open `cursor.com/agents`, click into the run, confirm it's streaming. Park it as Tab 2. |
| ~2 min | Glance: still running? If already finished, paste the fallback prompt. |
| 0 (kickoff) | Begin Section 0a. Tab 2 should still be mid-flight when you hit it ~8 min in. |

---

##### Fallback narration for Tab 2 (use verbatim — don't improvise under pressure)

- **Agent finished early (PR already open by the time you reach Tab 2):** Scroll the activity log back to a dense tool-call section, then say:
  > *"This one actually wrapped already — Cloud Agents are fast on small tasks. Same stream though, just rewound. Look at the tool calls — file read, edit, PR open. Engineer kicks it off, goes to a meeting, comes back, the PR is open."*

  Then jump straight to the Tab 3 transition. You lose ~10 sec; absorb it into the buffer.

- **Agent failed to start or errored out:** Don't dwell on the failure or open the error. Pivot to Tab 3 a beat early:
  > *"Cloud Agent runs in Cursor's infrastructure — same surface area as this dashboard. Here's what one of them produced on a real run yesterday: PR #3."*

  Continue with the existing Tab 3 narration as written.

- **Audience interrupts with a question while the stream is running:** Answer it directly. Do **not** apologize for "the demo running in the background" — that's the demo working. When the question is done:
  > *"…and as you can see, that whole exchange — the agent kept going. That's the point. Anyway — PR #3."*

---

#### Tab 3 — PR #3, scrolled to Bugbot's comment on `asset-card.tsx:44` (~30 sec)

**Surface:** Browser — GitHub PR #3, deep-linked to Bugbot's review comment.
**Agent / model:** N/A — viewing Bugbot's prior review.

**Do:**
- Switch to Tab 3. The URL auto-scrolls to the comment. Confirm Bugbot's comment is visible without further scrolling.
- Highlight the file reference (`asset-card.tsx:44`) with the cursor if it helps land the beat.

**Say (verbatim):**
> *"It opened PR #3 with Playwright e2e tests. But — and this is the part that punches above its weight — Bugbot, Cursor's automated reviewer, caught something the agent introduced that I would've shipped: keyboard events from the nested favorite button bubble up to the card's `onKeyDown`, so a keyboard user pressing Enter on the favorite accidentally opens the detail modal too. That's an a11y bug. The kind of thing that fails an Adobe accessibility review."*

**Sequencing / Next:** Switch to Tab 4.

---

#### Tab 4 — PR #4, 2-line diff with `cursoragent@cursor.com` author (~25 sec)

**Surface:** Browser — GitHub PR #4 Files Changed view.
**Agent / model:** N/A — viewing the autofix Cloud Agent's resulting PR.

**Do:**
- Switch to Tab 4. The Files Changed view should show the 2-line diff without scrolling.
- Highlight the author (`cursoragent@cursor.com`) with the cursor.

**Say (verbatim):**
> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. This is one of Cursor's newer capabilities — Bugbot doesn't just review, it can dispatch the fix to a Cloud Agent in one click. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE: Linear → Slack → Cloud Agent → PR → Bugbot → autofix Cloud Agent → PR. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams."*

**Sequencing / Next:** Switch back to the Cursor IDE for Section 5 (Build mode).

### 5. Build mode + Composer (~3:30)

**Surface:** Cursor IDE, chat pane (back from the browser).
**Agent / model:** **Composer-1** (Cursor's own model). **Mode is the default Agent mode, NOT Plan** — verify the mode dropdown is off Plan before pasting.

**Do:**
- Switch model dropdown to **Composer-1** visibly. Audience needs to see the switch.
- Verify mode is back to default (off Plan).
- Paste the prompt below and hit Enter.
- Let it work. Show the file tree updating in the sidebar and tests running in the terminal. If anything fails, let Composer self-correct once before intervening.

**Say (while switching model, BEFORE pasting):**
> *"For Build, I'm switching to Composer-1 — Cursor's own model, optimized for tool-using speed inside the IDE. Plan mode used Opus for breadth. Build phase wants speed."*

**Paste into chat:**
```
Execute plan.md.
```

**Say (over the streaming output, sparse — 2-3 asides total):**
- When `palette-extraction.ts` appears in the file tree: *"There's the extraction module — that's the perf-budget constraint I hand-edited into the plan, landing as actual code."*
- When tests start running: *"Tests run after every batch of edits. Composer's not just writing code — it's verifying it."*
- When the page appears in the routes: *"That's the new `/palette-extractor` route. Time to look at it."*

**Avoid:** Don't read every file as Composer writes it. The pace is the point.

**Sequencing / Next:** Section 6 — review the result.

---

### 6. Review the result (~1 min)

**Surface:** Browser — dev server on `http://localhost:3000/palette-extractor`. Switch to the IDE terminal for `npm test`.
**Agent / model:** None — you're driving.

**Do:**
1. Open `http://localhost:3000/palette-extractor` in the browser.
2. Paste an image URL into the input and click extract.
3. Switch to the IDE terminal. Run `npm test` to show tests still pass.
4. (If Bugbot is wired up by Friday) Open the PR Composer just pushed, and show Bugbot's review.

**Paste into the `/palette-extractor` URL input on the page (any picsum URL works):**
```
https://picsum.photos/seed/firefly/1024/1024
```

**Paste into the IDE terminal:**
```
npm test
```

**Say (over the page rendering + tests):**
> *"There's the extractor. Image URL in, dominant palette out — under 100ms because that's what the plan said. And the tests Composer wrote still pass. The plan I edited has shown up as code, in working state, in under five minutes."*

**Sequencing / Next:** Section 7 — rules + skills wrap.

---

### 7. Rules + Skills wrap (~2 min)

See **"Live-demo creation beats (Layer 2)"** below for the full per-beat structure (Surface / Do / Paste / Say). Two beats run back to back:

- **Beat 1** — create a file-pattern rule live (`test-files.mdc`). ~30 sec.
- **Beat 2** — encode the Ask → Plan → Build workflow as a personal skill (`pr-summary`). ~45 sec.

**Sequencing / Next:** Section 7.5 — enterprise controls.

### 7.5. Enterprise controls beat (~25 sec)

**Surface:** Keynote — one slide titled "Enterprise controls."
**Agent / model:** None — narration only.

**Slide bullets (already on slide — don't re-read all four, hit 2-3 max):**
- Zero data retention. No training on your code by Cursor or any LLM provider.
- SOC 2 Type 2 · SAML SSO · SCIM · AES-256 at rest · TLS 1.2+ in transit
- Model + MCP + agent rule allowlists, all configurable from one admin panel
- 64% of Fortune 500 already on Cursor: NVIDIA, Stripe, Coinbase, Rippling

**Do:** Advance to the slide. Let it sit for ~2 sec, then deliver the line.

**Say (verbatim):**
> *"Last thing before we close. Rules and skills govern individuals and teams. At org level, Cursor adds the controls Adobe needs — zero data retention, SOC 2 Type 2, SAML SSO, SCIM, model and MCP allowlists, and Privacy Mode that prevents any customer code from being used for training, by Cursor or any LLM provider. It's how 64% of the Fortune 500 runs Cursor today — NVIDIA, Stripe, Coinbase, Rippling. Same controls available to Adobe on day one of the trial."*

**Delivery notes:**
- Read the slide bullets quickly. The slide does the heavy lifting; you only need ~25 sec of voice.
- The "no training on customer code, by Cursor OR any LLM provider" phrasing matters. Adobe will hear it.
- The Fortune 500 names are borrowed credibility. Don't overuse — one beat, then move on.

**Say (Q&A safety line — memorize, use if asked about a name not on the slide, e.g. *"Are any other media/creative companies on Cursor?"*):**
> *"I'd need to confirm with our customer success team, but the Cursor enterprise page lists 50,000+ enterprises and 100M+ lines of code shipped per day."*

**Why this beat exists:** Adobe is famously security-conscious. The interview prompt and your original notes both call out security explicitly. Without this beat, every audience member is doing the math privately on whether the demo can survive their legal review. This says it out loud and closes the door.

**Sequencing / Next:** Section 8 — closing slides.

---

### 8. Trial success plan + Q&A (~1.5 min)

**Surface:** Keynote — two closing slides.
1. **"Two-track workflow"** diagram (see [diagrams.md](./diagrams.md) — Diagram 2). "Here's what you just saw."
2. Trial plan with the bullets below.

**Agent / model:** None — narration only.

**Slide 2 bullets (already on slide — don't re-read every word, paraphrase the cadence):**
- Week 1: install + 5 power-user pilots + `.cursor/rules` setup
- Week 2: Bugbot wired on 2-3 active repos + first Cloud Agent migrations
- Weeks 3-4: measure (Tab acceptance, time-to-first-PR for new starters, PR cycle time, NPS)
- Throughout: weekly office hours + shared Slack channel

**Do:** Advance to slide 1 (Two-track). Let it sit ~3 sec. Deliver the recap line. Advance to slide 2 (Trial plan). Deliver the trial line.

**Say (over slide 1, ~20 sec):**
> *"Here's what you just saw, in one picture. Local track — IDE plus rules and skills — keeps the engineer in flow. Cloud track — agents, Bugbot, the dashboard — handles compliance, review, and async work. Same primitives, same context, two tracks."*

**Say (over slide 2, ~30 sec):**
> *"And here's how we'd land it at Adobe. Week 1: install, five power-user pilots, set up `.cursor/rules` for your house style. Week 2: Bugbot wired on two or three active repos, first Cloud Agent migrations. Weeks 3 and 4: measure — Tab acceptance, time-to-first-PR for new starters, PR cycle time, NPS. Throughout: weekly office hours and a shared Slack channel. That's the start."*

**Sequencing / Next:** Q&A. Have `qa-cards.md` open on a secondary screen.

---

## Live-demo creation beats (Layer 2)

These files are **not** loaded by Cursor automatically. They live in this folder so you can paste their contents during the live demo without scrolling code on screen.

Same template as Section 7 above: Surface / Agent / Do / Paste / Say / Sequencing.

---

### Beat 1 — Create a file-pattern rule live (~30 sec)

**Surface:** Cursor IDE — command palette → new file under `.cursor/rules/`. Have `demo-prep/test-files.mdc` open in a second editor pane (off the visible screen if possible) so you can copy its full contents quickly.
**Agent / model:** None — you're creating a file.

**Do:**
1. Open the Cursor command palette and run **`/Cursor add new rule`** (or open `.cursor/rules/` and create a new file by hand).
2. Name it `test-files.mdc`.
3. Switch to the pane with `demo-prep/test-files.mdc` and copy its full contents.
4. Paste into `.cursor/rules/test-files.mdc`. Save.
5. Highlight the frontmatter line `globs: **/*.test.{ts,tsx}` with the cursor.

**Paste into `.cursor/rules/test-files.mdc`:** the full contents of `demo-prep/test-files.mdc` (kept in this folder so you can copy it cleanly mid-demo). Do **not** retype it.

**Say (verbatim, BEFORE opening the command palette):**
> *"Rules can apply globally — like the testing one — or scoped to specific files. Watch."*

**Say (verbatim, AFTER pasting, while pointing at the `globs:` frontmatter line):**
> *"This rule only loads when the agent touches a test file. Saves context the rest of the time."*

**Sequencing / Next:** Beat 2 — encode the workflow as a personal skill.

---

### Beat 2 — Encode the workflow as a personal skill (~45 sec)

**Surface:** Cursor IDE — command palette → `~/.cursor/skills/pr-summary/SKILL.md`. Have `demo-prep/pr-summary.md` open in a second editor pane so you can copy its full contents quickly.
**Agent / model:** None — you're creating a file.

**Do:**
1. Open the command palette → **`/Cursor create skill`**.
2. Choose **Personal** (`~/.cursor/skills/`).
3. Name it `pr-summary`.
4. Switch to the pane with `demo-prep/pr-summary.md` and copy its full contents.
5. Paste into the resulting `SKILL.md`. Save.
6. Briefly open a different project (or just open a different folder in Cursor) to show the skill is now available globally, not just in this repo.

**Paste into `~/.cursor/skills/pr-summary/SKILL.md`:** the full contents of `demo-prep/pr-summary.md`. Do **not** retype it.

**Say (verbatim, BEFORE opening the command palette):**
> *"I just walked you through Ask → Plan → Build with hand-editing `plan.md`. I'm going to capture that entire flow as a personal Skill. The next engineer on my team doesn't have to learn this from scratch — they just type the slash command. This is how Cursor turns institutional knowledge into infrastructure."*

**Say (verbatim, AFTER pasting and showing it works in a different project — optional follow-up if you have time):**
> *"And that's the Cursor Team Kit story — 17 official skills published, plus everything any team has shared internally. Skills are how Cursor goes from a single-engineer tool to a team multiplier."*

**Sequencing / Next:** Section 7.5 — enterprise controls.

## Files in this folder

- `diagrams.md` — Mermaid diagrams for the opening (surface area) and closing (two-track) slides
- `notes-alignment.md` — Friday-morning standalone reference: original notes + alignment table + the five narration tweaks verbatim
- `dry-run-protocol.md` — full IDE dry-run rehearsal protocol with pre-flight checks, prompts verbatim, success criteria, and fallback procedure. Includes dry-run results + 6 lessons learned.
- `qa-cards.md` — 10 prepared Q&A cards for the question block at the end. Includes universal curveball recovery moves and 10 facts to recite cold.
- `test-files.mdc` — file-pattern rule for Vitest test files (paste live during demo)
- `pr-summary.md` — personal skill for generating PR descriptions (paste live during demo)
