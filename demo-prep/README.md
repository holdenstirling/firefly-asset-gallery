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
| Bugbot | Installed; trigger with `bugbot run` comment if it doesn't auto-fire |
| `plan.md` | Empty placeholder, ready for Plan-mode output |

## Live-demo build target: HOL-7

The Plan → Build flow during the demo will implement the **Brand Palette Extractor**:
paste an image URL → extract dominant colors via `<canvas>` → save as a Style preset.

This chains naturally off Style Studio (which just shipped) and is unmistakably Adobe-flavored (Adobe Color homage).

**Linear:** [HOL-7](https://linear.app/holden-ottolini/issue/HOL-7/build-brand-palette-extractor-turn-any-image-into-a-style-preset)

---

## Live-demo runbook (15–17 min target)

### 0. Opening agenda slide (~30 sec)
One slide. Single bulleted list:
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
> *"Now I'm switching to Plan mode and to Opus. Plan mode is read-only — it reasons about my codebase, it doesn't touch it. Opus is what I reach for when the planning surface is wide. Costs more, plans better."*

```
Use HOL-7 as the brief. Read AGENTS.md, the rules in .cursor/rules, and src/lib/store.ts (the Style Studio store) before planning. Generate a structured implementation plan into plan.md.
```

**3c. Edit `plan.md` live (~30 sec) — the human-in-the-loop moment:**

Open `plan.md`. Read it briefly out loud. Then add ONE constraint by hand:
> "Must work for any Picsum URL"
> or "No new runtime dependencies — Web APIs only"
> or "Algorithm must run in under 100ms on a 1024×1024 image"

Narrate:
> *"This is the moment. The plan is a file. I edit it like code. The agent doesn't get autonomy until I sign off."*

### 4. Fan out async work — Cloud Agent recap (~1 min)
Cut to the pre-recorded video of the HOL-6 Playwright run, OR open PR #3 and walk through what the async agent built.
> *"While I plan locally, work that has clear scope can fan out to Cloud Agents. Here's one I ran earlier — Playwright e2e tests, opened a PR, ran the test suite green."*

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

### 8. Trial success plan + Q&A (~1.5 min)
One closing slide:
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

> *"That whole Ask → Plan → Build flow we just walked through — I'm going to capture it as a Skill so the next engineer on my team can run the same flow with one slash command."*

1. Open the command palette → **`/Cursor create skill`**.
2. Choose **Personal** (`~/.cursor/skills/`).
3. Name it `pr-summary`.
4. Paste the contents of `pr-summary.md` from this folder into the resulting `SKILL.md`.
5. Show that it's now usable across all projects, not just this one.

Optional follow-up beat: *"And that's the Cursor Team Kit story — there are 17 official skills published already, plus everything any team has shared internally. Skills are how Cursor goes from a single-engineer tool to a team multiplier."*

## Files in this folder

- `test-files.mdc` — file-pattern rule for Vitest test files
- `pr-summary.md` — personal skill for generating PR descriptions
