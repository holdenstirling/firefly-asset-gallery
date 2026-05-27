---
name: pr-summary
description: Generate a structured pull request description from staged changes and recent commits. Use when the user opens a PR, asks for a PR summary, fills in a PR body template, or asks to "write the PR description". Composes naturally with the linear-feature-flow skill — run pr-summary after Phase 5 (Build) to format the body.
---

# PR summary

A reusable workflow for turning a stack of commits into a reviewer-ready
PR description. Lives alongside the
[linear-feature-flow](../linear-feature-flow/SKILL.md) skill and the
[/review-pr](../../commands/review-pr.md) command — these three together
cover the full "I'm done coding, now ship it" lane.

## Quick start

1. Confirm the active branch isn't `main`:
   `git rev-parse --abbrev-ref HEAD`. If it is, ask the user to switch.
2. List commits in scope: `git log --oneline origin/main..HEAD`.
3. Summarize file scope: `git diff origin/main...HEAD --stat`.
4. Read the meaningful changes via `git diff origin/main...HEAD` — focus
   on *intent*, not file-by-file mechanics.
5. If a Linear ticket ID appears in the branch name or commit messages
   (e.g. `HOL-7`), pull that ticket via the Linear MCP to anchor "what"
   and "why" to the original brief.
6. Output the description following the template below.

## Output template

```markdown
## What

One paragraph in plain English. Lead with the *why*, not the *what*.

## Changes

- One bullet per concept, not per file
- Group bullets logically (UI vs. data layer vs. tests)
- Mark mechanical changes (renames, dep bumps, formatting) as such

## Test plan

- [ ] Unit / integration tests added or updated
- [ ] E2E coverage if relevant
- [ ] Manual verification steps

## Risks & rollback

Risks: <one sentence>
Rollback: <one sentence>

## Related

- Linear: HOL-XXX
- Docs: <link if relevant>
```

## Tone

- Lead with *why*, support with *what*. Reviewers don't need a
  file-by-file diff narrated.
- Skip filler ("This PR adds...", "I have made the following changes...").
  Start with the noun or the verb.
- One paragraph for the overview. Bullets for everything else.
- If a change is purely mechanical, say so — don't pretend it's complex.
- If the diff touches a known intentional rough edge from `AGENTS.md`,
  call out which one it's fixing (or explicitly state which it's *not*
  touching, so reviewers don't expect the fix here).

## Composition with other artifacts

This skill is one node in a larger graph. The graph:

```text
Linear ticket
   │
   ▼
/scope-ticket HOL-XX  ← scope phase, command
   │
   ▼
linear-feature-flow  ← plan + build phases, skill
   │
   ▼
/review-pr           ← pre-PR review, command
   │
   ▼
pr-summary           ← write the PR body, skill (this one)
   │
   ▼
gh pr create --draft ← opens the PR
```

Each step has a single responsibility. If you're tempted to bake
"summarize the PR" logic into `linear-feature-flow`, resist —
composition is the leverage.

## Examples

**Good:**

> ## What
>
> Stops the parameter panel from re-rendering the entire gallery on every
> slider change. Memoizes the panel and lifts state to the gallery root
> so unrelated tabs no longer re-render.
>
> ## Changes
>
> - `ParameterPanel`: wrapped in `React.memo`, accepts a stable
>   `onChange` prop
> - `Gallery`: lifts active-style state out of the parameter panel
> - Adds a Vitest case asserting `ParameterPanel` does not re-render
>   when unrelated state changes

**Bad:**

> ## What
>
> This PR adds memoization to the parameter panel. It also lifts state.
> There are some changes to the gallery component as well.

The "Bad" example fails three ways: filler opener, no *why*, no
specifics. Don't ship PR descriptions that read like commit-message
boilerplate.

## When this skill is the wrong fit

- **Tiny mechanical PRs** — one-line typo fix, formatter-only diff,
  dependency bump with no behavior change. Skip the full template;
  one sentence is enough.
- **Stacked PRs / draft series** — if this is part 1 of N, the
  description belongs in the top-of-stack PR, not each individual one.
  Reference the stack head and keep the body brief.
- **Revert PRs** — say *what's being reverted and why* in one
  paragraph. The full template adds noise.
