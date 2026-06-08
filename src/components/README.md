# Component accessibility patterns

This document captures the accessibility patterns established in HOL-8 for
`MeetingCard`, `RecordingControls`, and `UploadZone`. Use these as the reference
implementation for future Spectrum-aligned work.

## Composite cards (MeetingCard)

**Never nest interactive elements.** The gallery `AssetCard` anti-pattern — a
`<button>` wrapping other `<button>` elements — breaks keyboard semantics and
causes event bubbling bugs.

Instead:

1. Use a non-interactive container (`<article>`).
2. Place the primary action as a sibling `<Link>` or `<button>`.
3. Place secondary actions (delete, overflow menu) in a separate toolbar.
4. Call `event.stopPropagation()` on nested `onKeyDown` handlers so Enter/Space
   on a child control does not activate the parent.

```tsx
<article>
  <Link href={href}>{title}</Link>
  <Button aria-label={`Delete ${title}`} onKeyDown={stopPropagation} />
</article>
```

## Toggle controls (RecordingControls)

Use `aria-pressed` on buttons that toggle state:

- Record: `aria-pressed={status === "recording"}`
- Pause: `aria-pressed={status === "paused"}`

Pair icon-only buttons with `aria-label` (e.g. Stop → `"Stop recording"`).

Announce state transitions through a dedicated polite live region:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {announcement}
</div>
```

## Live regions (UploadZone)

| State | Announcement |
|-------|--------------|
| `dragOver` | Drag entered upload zone |
| idle after drag | Drag left upload zone |
| file selected | File dropped |
| `uploading` | Upload in progress |
| `complete` | Upload complete |
| `error` | Upload failed. Please choose an audio or video file. |

Use `aria-live="polite"` for non-urgent status updates. Reserve `assertive` for
errors that must interrupt (we surface errors visually with `role="alert"` too).

## Contrast tokens

- Body copy: `text-foreground` on `bg-card`
- Metadata (timestamps, hints): `text-muted-foreground` on `bg-card`
- Never hardcode `zinc-*`, `pink-*`, or raw hex in components
- Status must not rely on color alone — pair visual state with text and ARIA

## Testing

See `tests/components/accessibility.test.tsx` for the contract tests.

- Prefer `getByRole`, `getByLabelText`, and `within()` scoping
- Use `@testing-library/user-event` for keyboard interaction
- Avoid `getByTestId` unless no accessible name exists
- Test names are imperative: "activates delete on Enter", not "should activate"
