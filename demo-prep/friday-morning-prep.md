# Friday-morning demo prep

Read this with coffee, ~10 minutes before the call. Single source of truth for "what do I need to do, in what order, to walk in ready." Points at the runbook / protocol / qa-cards for detail — doesn't duplicate them.

> One sentence to read aloud once before joining the call:
>
> *"Adobe is evaluating Cursor against Claude Code. The thing that separates them is not the model — it's the surface area, the model neutrality, and the second half of the development lifecycle. Show all three."*

---

## T-30 min — environment checks

Run these in order. Each line is a hard prerequisite for the demo. If any check fails, fix it before joining the call.

### Repository state

```bash
cd ~/Cursor\ Interview/firefly-asset-gallery
git status                  # nothing to commit, working tree clean
git branch --show-current   # feat/hol-7
git log --oneline -3        # top commit on main should be 7c766f4 "Document picsumUrl options (#7)"
                            # (or whatever's latest on main after PR #10 merges)
cat plan.md                 # should be the 5-line generic placeholder, NOT HOL-7 content
ls .cursor/rules/           # firefly-conventions.mdc, testing-conventions.mdc
ls .cursor/skills/          # linear-feature-flow/SKILL.md
```

**If `plan.md` already has HOL-7 content:** residue from a prior rehearsal. Restore it:

```bash
git checkout -- plan.md
```

This matters because Section 3b's headline beat is *Opus writing the plan from scratch on stage*; if `plan.md` already has content, the moment is fake.

**If `feat/hol-7` already exists with stale content:**

```bash
git branch -D feat/hol-7 && git checkout main && git pull && git checkout -b feat/hol-7
```

### Dependencies and tests

```bash
npm install                 # cold install if needed (~10s if cached)
npm test                    # 18 passed (4 test files)
npm run build               # production build green
npm run dev                 # leave running in a terminal pane; serves localhost:3000
```

Keep `npm run dev` running through the whole demo — Section 6 navigates to it.

### Cursor IDE pre-flight

- [ ] **Linear MCP write access** — ask the agent to "Set HOL-7's description to itself" (a no-op write). If it fails, change the `linear-feature-flow` skill's Phase 5 to print the AC checklist instead of writing to Linear.
- [ ] **Slash commands** — open the command palette (`Cmd+Shift+P`), type `/`. Confirm `/Cursor add new rule` and `/Cursor create skill` (or the current build's strings) are available.
- [ ] **Models visible** — open the model picker. Confirm both `Opus` and `Composer` are listed.
- [ ] **Chat panel** is on the right; file tree on the left; status bar visible at the bottom (audience needs to see the mode toggle and model picker change).

### Fallback branch ready

```bash
git fetch origin
git branch -a | grep dry-run
# Expect: dry-run/hol-7 + dry-run/hol-7-prebuilt
```

If Composer chokes during Section 5, you switch to `dry-run/hol-7-prebuilt` and resume at Section 6. See [`dry-run-protocol.md`](./dry-run-protocol.md) "Fallback procedure" for the verbatim recovery line.

---

## T-5 min — tab staging

Pre-stage browser tabs left-to-right in this exact order. Click through them cold once to verify each loads and scrolls to the right place.

1. **https://cursor.com/agents** — dashboard, HOL-6 run visible at top
2. **Slack workspace `holdenstirling`** — channel scrolled to the `@Cursor pick up HOL-6` thread from yesterday. Compose box empty and focused.
3. **https://github.com/holdenstirling/firefly-asset-gallery/pull/3#discussion_r3278539971** — auto-scrolls to Bugbot's comment on `asset-card.tsx:44`
4. **https://github.com/holdenstirling/firefly-asset-gallery/pull/4/files** — PR #4 Files Changed view, showing the 2-line autofix diff
5. **http://localhost:3000** — Firefly Gallery homepage, dev server live

Slide deck open in Keynote / Google Slides on a separate window (or second monitor). First slide should be the title slide for Section 0a.

---

## T-2 min — headline lines (read once aloud, internalize the shape)

Six lines carry the demo. Read each one out loud once in your office before joining the call. Don't memorize verbatim — internalize the cadence.

### 1. Section 3b Beat 2 — model neutrality (the headline of the IDE block)

> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. And this — this is one of the biggest differences from Claude Code. Cursor isn't locked to one lab. Opus for planning, Composer for execution, GPT-5.5 for spec writing. Same agent, your choice of model."*

### 2. Section 3c Beat 3 — the hand-edit (the human-in-the-loop moment)

> *"This is the moment. The plan is a file. I edit it like code. One line — extraction has to run in under 100ms on a 1024×1024 image. The agent doesn't get autonomy until I sign off."*

### 3. Section 4 Tab 1 — async work fan-out

> *"Models are good enough now that they can run asynchronously. While Composer's building over there, work with clear scope fans out to Cloud Agents in Cursor's infrastructure. Tiny task — JSDoc comment on the Picsum helper. No prompt engineering."*

### 4. Section 4 Tab 4 — the Bugbot autofix closer

> *"And here's the closer. Bugbot ships a one-click 'Fix in Cursor' or 'Fix in Web' button. I clicked Fix in Web — that fired a second Cloud Agent that produced this 2-line fix and opened PR #4. Author: `cursoragent@cursor.com`. PR #4 didn't exist 20 minutes after PR #3. The entire loop ran without me opening the IDE. That's the second half of the development lifecycle — compliance, governance, security — the part that used to bottleneck even great engineering teams."*

### 5. Live-demo Beat 2.1 — skills as institutional infrastructure

> *"I just walked you through Ask → Plan → Build with hand-editing `plan.md`. I'm going to capture that entire flow as a personal Skill. The next engineer on my team doesn't have to learn this workflow from scratch — they just type the slash command. This is how Cursor turns institutional knowledge into infrastructure."*

### 6. Section 8 Beat 1 — Diagram 2 closing recap

> *"That's the picture. One Linear ticket — two parallel tracks. Locally I rode shotgun with the agent: Ask scoped it, Plan with Opus reasoned about the codebase and wrote a plan I could edit by hand, Build with Composer executed it. In parallel, a Cloud Agent fired from Slack delivered Playwright tests, Bugbot caught an accessibility bug the agent introduced, and a second Cloud Agent produced the fix. Two PRs, one engineer, ten minutes. That's the lift a small team gets — without giving up code review or governance. The bigger story is what this unlocks: projects that wouldn't have gotten started before, getting shipped. That doesn't show up in any dashboard."*

---

## During the demo — verbatim prompts cheat sheet

Have this open in a second window or on a printed page. All paste-verbatim prompts in demo order:

### Section 3a (Ask mode, Composer)

```
Read HOL-7 from Linear. Walk me through:
1. What's being asked (one paragraph)
2. What's already in this codebase that supports it
3. Which files will likely need to change

Don't write code or open the plan file. I want to scope first.
```

### Section 3b (Plan mode, Opus)

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

### Section 3c (hand-edit — TYPE, don't paste)

The audience seeing your hands on the keyboard is the visual signal of human-in-the-loop. Type this block at the end of the `## Goal` section, before `## Files to change`:

```
## Constraints

- Color extraction must run in under 100ms on a 1024×1024 image. Downsample to a max of 96×96 with offscreen canvas before histogram bucketing.
```

Then `Cmd+S`. Then switch mode to `Build` + model to `Composer` as one continuous motion.

### Section 4 Tab 1 (live `@Cursor` Slack fire-off)

Type this in the Slack composer (or paste — either works):

```
@Cursor in firefly-asset-gallery add a JSDoc comment to picsumUrl in src/lib/picsum.ts describing the seed/width/height/blur/grayscale params
```

### Section 5 (Build mode, Composer)

```
Execute plan.md.
```

That's it. The `linear-feature-flow` skill's Phase 5 + the `testing-conventions.mdc` rule + `firefly-conventions.mdc` together drive the rest.

### Live-demo Beat 1 (create rule)

Command palette → `/Cursor add new rule` → name it `test-files.mdc` → paste contents of [`test-files.mdc`](./test-files.mdc).

### Live-demo Beat 2 (create skill)

Command palette → `/Cursor create skill` → choose **Personal** → name it `pr-summary` → paste contents of [`pr-summary.md`](./pr-summary.md).

---

## Time budget at a glance

| Section | Time | Cumulative | Key beat |
|---|---|---|---|
| 0a | 25s | 0:25 | Adobe problem framing (title slide) |
| 0 | 30s | 0:55 | Surface-area diagram + agenda |
| 1 | 60s | 1:55 | cursor.com/agents dashboard |
| 2 | 30s | 2:25 | HOL-7 Linear ticket |
| 3a | 90s | 3:55 | Ask mode with Composer |
| 3b | 3:00 | 6:55 | **Plan mode with Opus — model switch headline** |
| 3c | 30s | 7:25 | **Hand-edit `plan.md`** |
| 4 | 110s | 9:15 | **Live `@Cursor` Slack fire-off** + Bugbot tabs |
| 5 | 3:30 | 12:45 | Composer Build (runs parallel to Section 4 if you want ~15:40 total) |
| 6 | 60s | 13:45 | `/palette-extractor` demo |
| 7 | 2:00 | 15:45 | **Live rule + skill creation** |
| 7.5 | 25s | 16:10 | Enterprise controls slide |
| 8 | 60s | 17:10 | Two-track recap + trial plan |
| Q&A | 1-3 min | 18-20m | qa-cards.md ready on 2nd monitor |

**Compression options if running long:**
- Drop Section 6 Beat 4 (`npm test` in terminal) — saves 15s
- Drop Live-demo Beat 2.4 (Team Kit hook, marked optional) — saves 10s
- Trim Section 4 Tabs 3-4 narration — can recover 10-15s
- Run Sections 4 and 5 truly parallel (Composer building while you do Cloud Agent tabs) — recovers up to 90s

---

## Red flags + recovery moves

### Opus starts editing source files in Section 3b

- **DO:** Hit `Esc` to interrupt.
- **SAY:** *"Let me re-scope that — Plan mode should be read-only."*
- **DO:** Re-send the prompt with `READ ONLY — only write plan.md, no other files.` appended.

### Live `@Cursor` Slack task in Section 4 stalls or doesn't start within ~10s

- **DO:** Stay on the `cursor.com/agents` dashboard. Scroll one row down. Click into yesterday's HOL-6 run instead.
- **SAY:** *"While that one spins up — same flow from yesterday, longer task. Here's HOL-6, the Playwright tests."*
- Continue Tab 2 narration but pointing at HOL-6's completed activity log. Audience won't know it's a fallback.

### Composer stalls or generates something visibly broken in Section 5

- **PAUSE NARRATION:** *"Let me speed this up — I ran this same flow yesterday."*
- **DO (new terminal):** `git checkout dry-run/hol-7-prebuilt`. Restart dev server. Navigate to `/palette-extractor`.
- Resume at Section 6.
- The audience will not notice. If they do: *"That's the dry-run I did yesterday — same plan, same output. The point isn't the execution, it's the workflow."*

### Tests fail during Section 5 and Composer can't fix in one attempt

- Let Composer try ONE self-correction. If still failing on second attempt, drop to the prebuilt fallback (above).

### Type errors / import errors during Build

- Likely a Next 16 surprise. `AGENTS.md` tells the agent to read `node_modules/next/dist/docs/` — if it didn't, remind it: *"Check the Next 16 docs in `node_modules/next/dist/docs/` — there may be a breaking change."*

### Dashboard / network flakiness

- Skip ahead to Tab 3 (PR #3 / Bugbot comment). Revisit Tab 2 at the end if it recovers. Don't dwell on a flaky network.

### You blank on a verbatim line

- Look at this doc. That's what it's for. Reading from a page is fine; long silences are not.

---

## What NOT to do (anti-patterns from the dry-run)

- **Never show 'tab'** (from original notes — never demonstrate Cursor Tab autocomplete. It's beneath the audience and not the message).
- **Don't dwell in Ask mode.** It's the prelude, not the headline. Don't let it run past 90 seconds.
- **Don't narrate every step of Opus working** in Section 3b Beat 4. Two sparse callouts max. The silence sells the "agent doing real work" beat.
- **Don't redo the mode/model switch** at the start of Section 5 — it already happened at end of 3c Beat 4. Doing it twice creates dead air.
- **Don't paste the hand-edit constraint.** Type it. Typing IS the visual signal of human-in-the-loop.
- **Don't contradict the Linear ticket** in the hand-edit. Add to it (perf budget) — don't override it (icon choice, etc.). Lesson 1 from Thursday's dry-run.
- **Don't name Claude Code in the opening (Section 0a).** Adobe is evaluating Cursor vs. Claude Code — wait for them to bring it up in Q&A, then land the model-neutrality answer (qa-cards Card 1).
- **Don't apologize on stage.** If something goes wrong, smooth pivot — no "sorry about that, let me try again." Just keep moving.

---

## Adobe-framing reminders

The three Adobe constraints from Section 0a map to three later beats. Land each one when its beat fires:

| Adobe constraint | Where it lands in demo |
|---|---|
| **Engineers across hundreds of repos** | Section 7 (rules + skills scale across the team) |
| **Hard accessibility requirements** | Section 4 Tab 3 (Bugbot caught the keyboard a11y bug) |
| **IP that can't leak** | Section 7.5 (enterprise controls — ZDR, no training, SOC 2) |

The "Cursor employee field-engineering tip" was: *"do cursor learn, read the blogs and case studies, and show something kinda practical, extra points if he uses a new feature."* The new-feature beat is the **Bugbot → Fix in Web → Cloud Agent → PR #4 chain** in Section 4 Tab 4. Lean into it.

---

## Q&A

- Open [`qa-cards.md`](./qa-cards.md) on your second monitor before the demo starts.
- Top three highest-probability questions to have nailed (read these cards twice):
  - **Card 1** — "Why Cursor over Claude Code specifically?" (model neutrality + surface area)
  - **Card 2** — "What's your data retention / training policy?" (ZDR, SOC 2, Privacy Mode)
  - **Card 3** — "How does Cursor handle a 20M-line monorepo?" (incremental indexing, NVIDIA / Stripe / Coinbase)
- Universal curveball recovery: *"I'd want to give you a precise answer on that — let me follow up with our customer success team and circle back."*

---

## Where to find more detail

If you need to dig deeper on any beat:

| Document | What it covers |
|---|---|
| [`README.md`](./README.md) | Full runbook with every section, every Beat, every verbatim line and stage direction |
| [`dry-run-protocol.md`](./dry-run-protocol.md) | Rehearsal protocol, timing template, fallback procedure, Thursday's dry-run results + 6 lessons learned |
| [`notes-alignment.md`](./notes-alignment.md) | Audit of original notes vs. final runbook coverage |
| [`qa-cards.md`](./qa-cards.md) | 10 prepared Q&A cards + universal curveball moves |
| [`diagrams.md`](./diagrams.md) | Mermaid diagrams for opening (Diagram 1) and closing (Diagram 2) slides |
| [`test-files.mdc`](./test-files.mdc) | Vitest scoped rule — paste during Section 7 Beat 1 |
| [`pr-summary.md`](./pr-summary.md) | PR-description personal skill — paste during Section 7 Beat 2 |

---

## Final 30-second pre-call ritual

1. Close Slack notifications (DnD on).
2. Close email.
3. Close everything except: Cursor IDE, Chrome (with 5 tabs staged), Slack `holdenstirling`, Keynote/slide deck.
4. Confirm `npm run dev` is still running.
5. Read the One Sentence at the top of this doc out loud once.
6. Take one breath.
7. Join the call.
