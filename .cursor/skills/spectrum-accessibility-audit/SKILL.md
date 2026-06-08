---
name: spectrum-accessibility-audit
description: Audit and remediate accessibility on a UI component using a test-first Spectrum-aligned playbook. Use when the user explicitly asks for an accessibility audit, when a ticket includes WCAG acceptance criteria, or when working on Spectrum-aligned components (buttons, dialogs, selects, tooltips, and other interactive primitives).
---

# Spectrum accessibility audit

A test-first playbook for auditing and remediating accessibility on a single UI
component. Follow every step in order. Do not skip writing tests before fixing
implementation.

## Before you start

Read these files:

1. `AGENTS.md` — project conventions
2. `.cursor/rules/firefly-conventions.mdc` — UI primitives and styling rules
3. `.cursor/rules/testing-conventions.mdc` — Vitest and selector conventions
4. The component source and every place it is imported

If a Linear ticket drives the work, extract WCAG acceptance criteria verbatim
and map each criterion to a test case in Step 2.

## Step 1: Identify component variants

Inventory every state and configuration the component exposes. Document them
before writing tests.

### Variant matrix

Build a table like this and fill it in from the component API (`variant`,
`size`, `disabled`, `asChild`, controlled vs uncontrolled, etc.):

| Variant / state | User-facing purpose | Expected role | Keyboard entry point |
|-----------------|---------------------|---------------|----------------------|
| default         | …                   | button        | Tab                  |
| disabled        | …                   | button        | skipped in tab order |
| icon-only       | …                   | button        | Tab + Enter/Space    |
| …               | …                   | …             | …                    |

### Interactive behaviors to flag

For each variant, note:

- **Focus** — Is there a visible `focus-visible` ring? Can focus escape traps
  correctly (dialogs, menus)?
- **Name** — What is the accessible name (visible text, `aria-label`,
  `aria-labelledby`, or associated `<label>`)?
- **State** — Are `disabled`, `expanded`, `selected`, `pressed`, or
  `aria-invalid` exposed when relevant?
- **Structure** — Are headings, labels, and descriptions wired (`DialogTitle`,
  `DialogDescription`, `htmlFor`, `id` pairs)?
- **Live feedback** — Do errors, loading, or async updates use text content or
  `aria-live` that screen readers can read?

Radix-based primitives in `src/components/ui/` inherit a lot of ARIA
automatically. Audit what the wrapper adds or omits — custom styling must not
remove semantics.

## Step 2: Write the Vitest accessibility test file

Create `<component>.test.tsx` next to the component under test (see
`.cursor/rules/testing-conventions.mdc`). Group tests by concern.

### File scaffold

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button accessibility", () => {
  describe("ARIA and naming", () => {
    it("exposes button role with accessible name from text content", () => {
      render(<Button>Save preset</Button>);
      expect(screen.getByRole("button", { name: "Save preset" })).toBeInTheDocument();
    });

    it("marks disabled state for assistive tech", () => {
      render(<Button disabled>Save preset</Button>);
      expect(screen.getByRole("button", { name: "Save preset" })).toBeDisabled();
    });
  });

  describe("keyboard interaction", () => {
    it("activates on Enter", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Run</Button>);
      await user.tab();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("activates on Space", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Run</Button>);
      await user.tab();
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("screen reader semantics", () => {
    it("surfaces icon-only label via aria-label", () => {
      render(<Button aria-label="Close panel" size="icon"><X /></Button>);
      expect(screen.getByRole("button", { name: "Close panel" })).toBeInTheDocument();
    });
  });
});
```

Install `@testing-library/user-event` if it is not already present:

```bash
npm install -D @testing-library/user-event
```

### Selector rules

- Prefer `getByRole`, `getByLabelText`, and `getByText` — these mirror how
  assistive tech discovers content.
- Reach for `getByTestId` only when roles are duplicated and not fixable.
- Test names are imperative: "closes on Escape", not "should close on Escape".

### What to cover by component type

| Component type | ARIA tests | Keyboard tests | Screen reader tests |
|----------------|------------|----------------|---------------------|
| Button / toggle | role, `aria-pressed`, disabled | Tab, Enter, Space | `aria-label` for icon-only |
| Text field | associated label, `aria-invalid`, `aria-describedby` | Tab, type, focus | error text in description |
| Select / combobox | `aria-expanded`, listbox options | Arrow keys, Enter, Escape | option count and selection |
| Dialog | `role="dialog"`, labelled title, focus trap | Escape to close, Tab cycles | description linked to title |
| Tooltip | `aria-describedby` on trigger | focus trigger | tooltip text available |
| Slider | `aria-valuemin/max/now` | Arrow keys adjust value | value changes announced via text |

### Dialog example (focus trap + labelling)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Dialog accessibility", () => {
  it("links title and description for screen readers", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Export tokens</DialogTitle>
          <DialogDescription>Choose a format for your style preset.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog", { name: "Export tokens" });
    expect(dialog).toHaveAccessibleDescription("Choose a format for your style preset.");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Export tokens</DialogTitle>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

## Step 3: Run the tests

```bash
npm test -- src/components/<feature>/<component>.test.tsx
```

Run the full suite before finishing:

```bash
npm test
```

Record every failure. Classify each as:

- **Missing semantics** — role, label, description, or state not exposed
- **Keyboard gap** — focus order, key handler, or focus trap broken
- **Visual-only state** — information conveyed by color/icon alone
- **Radix misuse** — required child (`Title`, `Description`, `Trigger`) omitted

## Step 4: Fix what fails

Work failure-by-failure. Prefer the smallest change that makes the test pass
and matches Spectrum patterns.

### Common remediations

| Failure | Fix |
|---------|-----|
| Icon-only control has no name | Add `aria-label` or visually hidden `<span className="sr-only">` |
| Input not labelled | Add `<label htmlFor>` or `aria-labelledby` |
| Error not announced | Render error text with `id`; set `aria-describedby` / `aria-invalid` |
| Dialog missing title | Always render `DialogTitle`; never leave `aria-labelledby` empty |
| Focus lost after close | Radix handles this — check for custom portal/focus overrides |
| Disabled control still clickable | Pass `disabled` or `aria-disabled` and remove `onClick` |
| Color-only status | Add visible text or `aria-label` with the status word |

### Constraints

- Use existing primitives from `@/components/ui/*` — do not swap libraries.
- Colors come from CSS variables in `src/app/globals.css` — never hardcode hex.
- Preserve `focus-visible:ring-*` classes; do not replace focus indicators with
  `outline-none` alone.
- Keep `"use client"` only where the component already needs client behavior.

After each fix, re-run the scoped test file. When all accessibility tests pass,
run `npm run build` to confirm the production build still succeeds.

## Step 5: Document patterns in the nearest README

Update the closest `README.md` so the team can reuse what you learned.

Search upward from the component directory:

1. `src/components/<feature>/README.md` — preferred
2. `src/components/README.md` — if no feature readme exists, create the feature
   one rather than bloating the root README

Add an **Accessibility** section:

```markdown
## Accessibility

### Variants audited
- `default`, `disabled`, `icon` — see `<component>.test.tsx`

### Patterns
- Icon-only buttons require `aria-label` (Spectrum: action buttons with text
  alternatives).
- Dialogs must include `DialogTitle`; use `DialogDescription` when context is
  not obvious from the title alone.

### Keyboard
| Key | Behavior |
|-----|----------|
| Tab | Moves focus to control |
| Enter / Space | Activates button |
| Escape | Closes dialog |

### WCAG mapping
| Criterion | How we meet it |
|-----------|----------------|
| 1.1.1 Non-text Content | `aria-label` on icon-only triggers |
| 2.1.1 Keyboard | Full operation via keyboard tested in Vitest |
| 4.1.2 Name, Role, Value | Roles and labels asserted with `getByRole` |
```

Keep notes concise. Link to the test file path, not duplicated test code.

## Definition of done

- [ ] Variant matrix completed for the target component
- [ ] `<component>.test.tsx` covers ARIA, keyboard, and screen reader semantics
- [ ] `npm test` passes
- [ ] Accessibility failures remediated in the component
- [ ] `npm run build` passes
- [ ] Nearest README updated with Accessibility section
- [ ] If ticket-driven, each WCAG acceptance criterion maps to a passing test
