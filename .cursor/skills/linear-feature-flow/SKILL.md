---
name: linear-feature-flow
description: Build a feature from a Linear issue using the Ask -> Plan -> Build workflow established for this codebase. Use when the user asks to "implement HOL-XX", "build the feature in [linear ticket]", or when starting work on any non-trivial feature with an existing Linear ticket.
---

# Linear feature flow

The Firefly Asset Gallery uses a four-phase workflow for non-trivial features. Follow each phase in order. Do not skip phases.

## Phase 1: Read the ticket

Use the Linear MCP to read the issue. Extract and surface to the user:

- **Problem** — one sentence
- **Acceptance criteria** — verbatim from the ticket
- **Out of scope** — verbatim from the ticket
- **Technical notes** that constrain implementation

If the ticket is missing any of these sections, ask the user to clarify before proceeding.

## Phase 2: Read the codebase

Read these files in this order before planning:

1. `AGENTS.md` — project conventions and known rough edges
2. `.cursor/rules/firefly-conventions.mdc` — UI conventions
3. `.cursor/rules/testing-conventions.mdc` — testing standards
4. `src/lib/types.ts` — domain types
5. Any files referenced in the ticket's technical notes

## Phase 3: Plan

Generate a structured plan into `plan.md` using the template below. This is a **read-only** phase — do not modify any source files yet.

```markdown
# [Feature name] — Plan

## Goal
One paragraph distilled from the ticket.

## Files to change
- `path/to/file.ts` — what changes and why
- ...

## Files to create
- `path/to/new.ts` — purpose
- ...

## Implementation steps
1. ...
2. ...

## Tests
- Unit: which utilities get coverage
- Component: which components need tests
- E2E: which Playwright scenarios

## Acceptance criteria check
- [ ] AC1 from ticket
- [ ] AC2 from ticket
- ...
```

## Phase 4: Wait for sign-off

Stop after writing `plan.md`. Do not start implementation. The operator will edit `plan.md` and explicitly say "execute the plan" before you proceed.

## Phase 5: Build

When given approval, execute `plan.md` step by step. After each step:

1. Run `npm run lint`
2. Run `npm test`
3. Fix any failures before moving to the next step

When all steps are complete:

1. Run `npm run build` to verify the production build succeeds
2. Update the ticket's acceptance criteria checkboxes to reflect actual coverage
3. Open a draft PR with a structured description (see the `pr-summary` skill if available)
