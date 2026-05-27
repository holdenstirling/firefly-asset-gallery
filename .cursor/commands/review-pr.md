---
name: review-pr
description: Review the current branch's diff against origin/main using the Firefly Asset Gallery's conventions. Use when the user types /review-pr, asks for a "pre-PR review," or wants the agent to audit unmerged changes before opening a PR.
---

# Review the current branch

Run a structured pre-PR review on whatever's diff'd between this branch
and `origin/main`. The point of this command is **friction-free quality
gates** — the engineer types `/review-pr`, the agent does what a human
reviewer would do first.

## Quick start

1. `git rev-parse --abbrev-ref HEAD` to confirm we're on a feature branch.
   If we're on `main`, abort and say "switch to a feature branch first."
2. `git fetch origin main --quiet` so the comparison is fresh.
3. `git log --oneline origin/main..HEAD` — list the commits in scope.
4. `git diff origin/main...HEAD --stat` — see file-level scope.
5. `git diff origin/main...HEAD` — read the actual diff.

Read the existing rules and skills before reviewing so the standards are
in scope:

- `.cursor/rules/firefly-conventions.mdc` — UI primitives, styling, state
- `.cursor/rules/testing-conventions.mdc` — test placement and naming
- `AGENTS.md` — project conventions

## What to look for

Review against this checklist, in this order. Each finding should cite
the file and line, and mark severity (`blocker`, `important`, `nit`).

### 1. Convention violations (`firefly-conventions.mdc`)

- Inline hex colors in components (must come from CSS variables)
- `framer-motion` imports (must be `motion`)
- Icons not from `lucide-react`
- Inline `picsum.photos` URLs (must go through `picsumUrl()`)
- Direct shadcn replacements (must use `@/components/ui/*`)
- `style` props instead of Tailwind utilities

### 2. Test coverage (`testing-conventions.mdc`)

- New utility under `src/lib/` without a matching `src/lib/__tests__/<name>.test.ts`
- Component changes without `<component>.test.tsx` next to them
- Test names that aren't imperative ("returns X when Y")
- `getByRole`/`getByLabel` available but `data-testid` used instead

### 3. Type safety

- `any` introduced (must be `unknown` and narrowed)
- New `as` casts that look like they're papering over a real type mismatch
- Imports not using the `@/` alias

### 4. React / Next.js shape

- New `"use client"` components that don't actually need browser APIs
- State that should be in a Zustand store (`@/lib/store.ts`) but is local
- Routes added without considering whether mock data needs updating

### 5. Performance / a11y

- New images without `alt`
- Keyboard handlers on nested elements that bubble in unexpected ways
- Memoization opportunities for components that take large objects as props

## Output format

Emit a markdown report with three sections:

```markdown
## Review of <branch> vs origin/main

### Summary

One sentence stating overall verdict. One of:
- "Ready to PR" — no blockers, no important findings
- "Address findings, then PR" — important findings only
- "Blocked" — at least one blocker

### Findings

| Severity | File | What | Why it matters |
|---|---|---|---|
| blocker | `src/lib/foo.ts:42` | Hardcoded hex `#ff0000` | Violates color-token rule in firefly-conventions.mdc |
| important | ... | ... | ... |
| nit | ... | ... | ... |

(Omit the table entirely if there are no findings.)

### Recommended next step

One sentence. Examples:
- "Apply the suggested fixes, then run /review-pr again."
- "Looks good — open the PR with the pr-summary skill."
```

## Tone

- Be specific. "Inline hex on line 42" beats "watch your colors."
- Be honest. If there are no findings, say so — don't manufacture nits.
- Cite the source rule for blockers. The engineer needs to know which
  convention is being applied.
- Lead with the verdict. Reviewers shouldn't have to scroll to find out
  whether they can open the PR.

## Examples

**Good (no findings):**

> ### Summary
> Ready to PR.
>
> ### Recommended next step
> Open the PR — consider invoking the `pr-summary` skill to draft the body.

**Good (with findings):**

> ### Summary
> Address findings, then PR.
>
> ### Findings
>
> | Severity | File | What | Why it matters |
> |---|---|---|---|
> | important | `src/components/gallery/asset-card.tsx:84` | Inline hex `#1a1a1a` for hover bg | Violates color-token rule (firefly-conventions.mdc) — use `bg-surface-2` |
> | nit | `src/lib/asset-filter.ts:12` | Missing `src/lib/__tests__/asset-filter.test.ts` | testing-conventions.mdc requires tests for new utilities under `src/lib/` |
>
> ### Recommended next step
> Replace the hex with the token, add the test file, then re-run `/review-pr`.

**Bad (don't do this):**

> ### Summary
> I have reviewed the changes and overall it looks good but there are
> some things to consider.
>
> ### Findings
> - The colors could be improved.
> - More tests would be nice.

The "Bad" example fails three ways: vague, no severity, no file refs,
buries the verdict. Don't ship reviews that read like an auto-generated
LLM comment.
