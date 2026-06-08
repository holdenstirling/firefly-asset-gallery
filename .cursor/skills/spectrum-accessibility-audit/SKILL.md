---
name: spectrum-accessibility-audit
description: Audit and remediate accessibility on a UI component using a test-first workflow aligned with Adobe Spectrum and WCAG. Use when the user explicitly asks for an accessibility audit, when a Linear or GitHub ticket includes WCAG acceptance criteria, or when working on Spectrum-aligned interactive components (buttons, dialogs, menus, cards with nested controls).
---

# Spectrum accessibility audit

A test-first playbook for auditing and remediating accessibility on a single UI component. Follow every step in order. Do not skip writing tests before fixing — the tests define the contract.

## Before you start

Read these files:

1. `.cursor/rules/testing-conventions.mdc` — test placement, naming, and query preferences
2. `.cursor/rules/firefly-conventions.mdc` — UI primitives and styling constraints
3. `.cursor/rules/accessibility-component-guidance.mdc` — component-level a11y patterns (if present)
4. The component source and every place it is rendered

## Step 1: Identify component variants

Map every state and interaction surface the component exposes. Write this inventory before writing tests.

Capture:

- **Visual variants** — size, variant prop, disabled, loading, error
- **Content variants** — with/without label, icon-only, with description or badge
- **Interaction modes** — click, keyboard activation, focus, hover-revealed controls
- **Composite patterns** — nested buttons, expandable regions, dialogs, menus, tooltips
- **Dynamic state** — selected, expanded, favorited, open/closed

For each variant, note the expected:

| Concern | What to verify |
| --- | --- |
| Role | Correct implicit or explicit ARIA role (`button`, `dialog`, `menuitem`, etc.) |
| Name | Accessible name via visible text, `aria-label`, or `aria-labelledby` |
| State | `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-disabled`, `aria-hidden` |
| Keyboard | Tab order, Enter/Space activation, Escape dismissal, arrow-key navigation where applicable |
| Focus | Focus moves logically; focus is trapped in modals; focus returns on close |
| Screen reader | Meaningful announcements — labels, descriptions, live regions, `sr-only` text |

Flag anti-patterns immediately:

- `<div onClick>` without `role` and keyboard handler
- Icon-only controls missing `aria-label`
- Buttons nested inside buttons
- Keyboard events bubbling from nested controls to parent activators
- Focus outlines removed without a replacement
- Decorative images with non-empty `alt`

## Step 2: Write the Vitest test file

Create `<component>.test.tsx` in `__tests__/` next to the component (per project conventions). Structure tests in three describe blocks: **ARIA**, **keyboard**, and **screen reader**.

### Query rules

- **Always** prefer role-based queries: `getByRole`, `queryByRole`, `findByRole`
- Use `getByLabelText` / `getByPlaceholderText` for form controls
- Use `getByText` only for visible copy that screen readers also expose
- **Never** use `getByTestId` unless no accessible role or label exists and you have documented why in a comment
- Scope queries with `within()` for composite components (cards, dialogs, toolbars)

### Test template

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { ComponentUnderTest } from "../component-under-test";

// Provide minimal props / mock stores needed to render each variant.
const defaultProps = { /* ... */ };

describe("ComponentUnderTest accessibility", () => {
  describe("ARIA", () => {
    it("exposes button role with accessible name", () => {
      render(<ComponentUnderTest {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("marks icon-only control with aria-label", () => {
      render(<ComponentUnderTest {...defaultProps} />);
      expect(screen.getByRole("button", { name: "Favorite" })).toBeInTheDocument();
    });

    it("reflects pressed state with aria-pressed", () => {
      render(<ComponentUnderTest {...defaultProps} selected />);
      expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });
  });

  describe("keyboard", () => {
    it("activates primary control on Enter", () => {
      const onActivate = vi.fn();
      render(<ComponentUnderTest {...defaultProps} onActivate={onActivate} />);
      const control = screen.getByRole("button", { name: "Submit" });
      control.focus();
      fireEvent.keyDown(control, { key: "Enter" });
      expect(onActivate).toHaveBeenCalledOnce();
    });

    it("does not bubble Enter from nested control to parent", () => {
      const onParentActivate = vi.fn();
      const onChildActivate = vi.fn();
      render(
        <ComponentUnderTest
          {...defaultProps}
          onActivate={onParentActivate}
          onChildActivate={onChildActivate}
        />
      );
      const nested = screen.getByRole("button", { name: "Favorite" });
      nested.focus();
      fireEvent.keyDown(nested, { key: "Enter" });
      expect(onChildActivate).toHaveBeenCalled();
      expect(onParentActivate).not.toHaveBeenCalled();
    });

    it("moves focus to first item when menu opens", async () => {
      render(<ComponentUnderTest {...defaultProps} />);
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
      expect(await screen.findByRole("menuitem", { name: "Edit" })).toHaveFocus();
    });
  });

  describe("screen reader", () => {
    it("associates dialog title via aria-labelledby", () => {
      render(<ComponentUnderTest {...defaultProps} open />);
      const dialog = screen.getByRole("dialog", { name: "Asset details" });
      expect(dialog).toHaveAccessibleName("Asset details");
    });

    it("exposes description text to assistive tech", () => {
      render(<ComponentUnderTest {...defaultProps} />);
      expect(screen.getByText("Applies to all assets in this collection")).toBeInTheDocument();
    });

    it("hides decorative icon from accessibility tree", () => {
      render(<ComponentUnderTest {...defaultProps} />);
      const button = screen.getByRole("button", { name: "Close" });
      // Icon is decorative; name comes from aria-label or sr-only text, not the SVG.
      expect(button).toHaveAccessibleName("Close");
    });
  });
});
```

### What to test per concern

**ARIA**
- Roles match semantics (prefer native elements over `role` attributes)
- Accessible names are present and unique among siblings
- States (`aria-expanded`, `aria-pressed`, `aria-selected`, `aria-disabled`) track visual state
- `aria-hidden="true"` on decorative elements; `alt=""` on decorative images
- Dialogs: `role="dialog"`, labelled title, optional `aria-describedby`

**Keyboard**
- Tab reaches all interactive elements in logical order
- Enter and Space activate buttons and links
- Escape closes dismissible overlays and returns focus
- Arrow keys navigate menus, tabs, radio groups, and listboxes
- Nested interactive elements do not trigger parent handlers (stop propagation on click **and** keydown)
- No keyboard traps outside intentional modal focus traps

**Screen reader**
- `toHaveAccessibleName()` and `toHaveAccessibleDescription()` from `@testing-library/jest-dom`
- Visible text doubles as the accessible name where appropriate
- `sr-only` text provides context for icon-only controls
- Dynamic updates use `aria-live` or assert text appears after interaction
- Status messages are exposed (not communicated by color alone)

### Test naming

Use imperative names: "activates on Enter", not "should activate on Enter".

## Step 3: Run the tests

Run the new test file in isolation first, then the full suite:

```bash
npm test -- src/components/<feature>/__tests__/<component>.test.tsx
npm test
```

Record every failure with:

- Test name
- Expected accessible behavior
- Actual DOM / behavior observed

If the component needs client providers or Zustand state, wrap renders in a minimal harness rather than weakening assertions.

## Step 4: Fix what fails

Apply fixes in the component (not in the tests) unless the test itself is wrong. Prefer fixes in this order:

1. **Semantic HTML** — `<button>` instead of `<div onClick>`, `<nav>`, `<main>`, `<label>`
2. **Accessible names** — visible text, `aria-label`, `aria-labelledby`
3. **Keyboard handlers** — mirror click behavior; call `stopPropagation()` on nested control click and keydown
4. **Focus management** — preserve `focus-visible` styles; move focus on open/close
5. **ARIA attributes** — only when semantic HTML cannot express the pattern

Common remediations in this codebase:

| Failure | Fix |
| --- | --- |
| Icon button has no name | Add `aria-label` or visible `sr-only` text |
| Nested button triggers parent | `e.stopPropagation()` on inner `onClick` and `onKeyDown` |
| Card is a button wrapping buttons | Restructure: outer container as non-interactive wrapper, or split into separate focusable regions |
| Dialog missing name | Add `DialogTitle` (Radix wires `aria-labelledby` automatically) |
| Custom control not keyboard-operable | Add `tabIndex={0}` only as last resort; prefer native element |

After each fix, re-run the isolated test file. When all accessibility tests pass, run `npm test` and `npm run build`.

## Step 5: Document patterns in the nearest README

Find the closest README to the component:

1. `src/components/<feature>/README.md` if it exists
2. Otherwise `src/components/README.md`
3. Otherwise the project root `README.md`

Add or extend an **Accessibility** section. Keep it brief and actionable:

```markdown
## Accessibility — <ComponentName>

### Expected behavior
- <role> with accessible name derived from <source>
- Keyboard: <keys and expected outcome>
- Screen reader: <what is announced and when>

### Testing
- Test file: `src/components/<feature>/__tests__/<component>.test.tsx`
- Run: `npm test -- src/components/<feature>/__tests__/<component>.test.tsx`

### Known patterns
- <any non-obvious pattern future contributors must preserve>
```

Do not duplicate WCAG reference tables. Link to [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) when the ticket cites specific success criteria.

## Done checklist

- [ ] Variant inventory written and covers all interactive states
- [ ] Test file exists beside the component with ARIA, keyboard, and screen reader describe blocks
- [ ] All queries use `getByRole` / `getByLabelText` — no `getByTestId` without justification
- [ ] `npm test` passes
- [ ] `npm run build` passes (component was modified)
- [ ] Nearest README documents expected behavior and how to re-run tests
- [ ] Ticket acceptance criteria mapped to passing tests (when a ticket drove the audit)
