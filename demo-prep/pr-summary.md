---
name: pr-summary
description: Generate a structured pull request description from staged changes and recent commits. Use when the user opens a PR, asks for a PR summary, fills in a PR body template, or asks to "write the PR description".
---

# PR Summary

## Quick start

1. Run `git log --oneline origin/main..HEAD` to list commits in this branch.
2. Run `git diff origin/main...HEAD --stat` to see file scope.
3. For the meaningful changes, read the diff to extract *intent* — not just what changed.
4. Output a description following the template below.

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

- Lead with *why*, support with *what*. Reviewers don't need a file-by-file diff narrated.
- Skip filler ("This PR adds...", "I have made the following changes..."). Start with the noun or the verb.
- One paragraph for the overview. Bullets for everything else.
- If a change is purely mechanical, say so — don't pretend it's complex.

## Examples

**Good:**

> ## What
>
> Stops the parameter panel from re-rendering the entire gallery on every slider change. Memoizes the panel and lifts state to the gallery root so unrelated tabs no longer re-render.
>
> ## Changes
>
> - `ParameterPanel`: wrapped in `React.memo`, accepts a stable `onChange` prop
> - `Gallery`: lifts active-style state out of the parameter panel
> - Adds a Vitest case asserting `ParameterPanel` does not re-render when unrelated state changes

**Bad:**

> ## What
>
> This PR adds memoization to the parameter panel. It also lifts state. There are some changes to the gallery component as well.
