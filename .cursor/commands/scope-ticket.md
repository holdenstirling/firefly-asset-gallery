---
name: scope-ticket
description: Read a Linear ticket (HOL-XX) and produce a one-page scoping summary covering the problem, acceptance criteria, codebase dependencies, and an initial file-impact list. Use when the user types /scope-ticket HOL-XX or asks to "scope HOL-XX before planning."
---

# Scope a Linear ticket

Compresses the Ask-mode phase of the
[linear-feature-flow](../../cursor/skills/linear-feature-flow/SKILL.md)
into one command. Fire this before switching to Plan mode — the output
sets you up to write a clean `plan.md`.

## Quick start

1. Identify the ticket ID from the user's invocation (e.g.
   `/scope-ticket HOL-7` → `HOL-7`). If no ID was provided, ask for one.
2. Use the Linear MCP to read the issue. Pull the title, problem
   description, acceptance criteria, out-of-scope notes, and any
   technical notes.
3. Read these codebase files **in this order** to build the dependency
   picture:
   - `AGENTS.md`
   - `.cursor/rules/firefly-conventions.mdc`
   - `.cursor/rules/testing-conventions.mdc`
   - `src/lib/types.ts`
   - Any files referenced in the ticket's technical notes
4. Run `git log --oneline -10` to see what's been shipped recently —
   relevant context for "what's already in this codebase that supports
   this ticket."
5. Emit the scoping report (template below). **Do not write code, do
   not modify `plan.md`, do not start implementing.** This is Ask phase,
   not Plan phase.

## Output template

```markdown
## Scope: <ticket ID> — <ticket title>

### Problem (1 sentence)

<Distill the ticket's problem statement into one sentence.>

### Acceptance criteria (verbatim from ticket)

- AC1
- AC2
- ...

### Out of scope (verbatim from ticket, if present)

- ...

### Existing scaffolding (what's already here)

- `path/to/file.ts` — <one-line description of how it relates to this ticket>
- `path/to/file.tsx` — ...

### Likely impact (files that will change or get created)

| File | Status | Why |
|---|---|---|
| `path/to/existing.ts` | modify | <reason> |
| `path/to/new.ts` | create | <reason> |

### Open questions (if any)

- <Anything the ticket doesn't say and you'd want answered before planning.>
  - For each open question, propose your default if not answered.

### Recommended next step

Switch to Plan mode (Opus recommended for non-trivial features), then
fire `linear-feature-flow` with this ticket to generate `plan.md`.
```

## Rules of the road

- **Read-only.** Do not modify any source files. Do not modify
  `plan.md`. This is the scoping step.
- **Cite ticket text verbatim** for AC and out-of-scope. Paraphrasing
  loses fidelity and can cause the Plan phase to drift.
- **Don't speculate on implementation.** "Likely impact" is the file
  list, not the algorithm. The plan is where you commit to mechanics.
- **Surface contradictions.** If the ticket conflicts with an existing
  convention or a recently-shipped feature, name the conflict and
  recommend how to resolve it before planning.
- **Stop after emitting the report.** Wait for the user to switch
  modes.

## Examples

**Good open question:**

> - Should the import flow accept JSON or YAML? Ticket only says
>   "structured format." **Default: JSON.** Rationale: aligns with the
>   existing `picsumUrl` and `mock-data.ts` patterns, no YAML parser
>   currently in deps.

**Bad open question:**

> - What should the import format be?

The "Bad" version leaves the next planning step underspecified. The
"Good" version lets the engineer accept the default and move on, or
override with one sentence.

## When this command fails

- If Linear MCP isn't available (auth, network, etc.), say so plainly
  and ask the user to paste the ticket body. Do **not** silently
  proceed against a guessed problem statement.
- If the ticket is missing AC or has malformed structure, say so and
  ask the user to clean up the ticket before proceeding — scoping
  against a broken ticket wastes Plan-mode budget.
