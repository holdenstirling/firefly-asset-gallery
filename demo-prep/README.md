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

### 0. Slide intro — cursor.com/agents (~1 min)
Pre-stage 1–2 completed runs (HOL-5 PR #2 already merged; HOL-6 PR #3 still open). Show the dashboard. *"Cursor isn't just an editor — it's a surface area. Same agents from anywhere."*

### 1. Open Linear, show HOL-7 (~30 sec)
> *"Real engineering work starts with a ticket. Watch what happens when Cursor reads one."*

### 2. Switch to IDE on `firefly-asset-gallery`, branch `main`

**Ask mode (~2 min):**
> "Read HOL-7 from Linear. Walk me through what's being asked and which files in this codebase will need to change."

The agent will discover Style Studio just shipped and surface that the new feature builds on it.

**Plan mode → switch model to Opus (~3 min):**
> "Use HOL-7 as the brief. Read AGENTS.md, the rules in .cursor/rules, and `src/lib/store.ts` (the Style Studio store) before planning. Generate a structured implementation plan into plan.md."

**Edit `plan.md` live** — add one constraint like *"no new runtime dependencies — pure Web APIs only"* or *"the algorithm must run in under 100ms on a 1024x1024 image."*

### 3. Fire HOL-6 video / Cloud Agent recap (~1 min)
Cut to the pre-recorded video showing the HOL-6 Playwright run. Or: open PR #3 and walk through what the async agent built.

### 4. Build mode → switch model to Composer (~4 min)
> "Execute plan.md."

Let it work. Show file tree updating, tests running. If anything fails, let Composer self-correct once.

### 5. Bugbot review (~1 min)
Open the resulting PR. Show Bugbot's review comments. (If Bugbot is slow, comment `bugbot run` to nudge it.)

### 6. Rules + Skills wrap (~2 min)
See "Live-demo creation beats" below.

### 7. Trial success plan + Q&A (~1.5 min)

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
