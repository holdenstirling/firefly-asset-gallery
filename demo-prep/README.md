# Demo-prep drafts

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
