import { describe, expect, it } from "vitest";
import { cn, formatRelativeTime } from "../utils";

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("dedupes Tailwind utilities, last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatRelativeTime", () => {
  const NOW = new Date("2026-05-20T12:00:00Z").getTime();
  const at = (offsetMs: number) => new Date(NOW - offsetMs);

  it("returns 'just now' for sub-minute differences", () => {
    expect(formatRelativeTime(at(5_000), NOW)).toBe("just now");
  });

  it("formats minutes correctly", () => {
    expect(formatRelativeTime(at(5 * 60_000), NOW)).toBe("5m ago");
  });

  it("formats hours correctly", () => {
    expect(formatRelativeTime(at(3 * 60 * 60_000), NOW)).toBe("3h ago");
  });

  it("formats days correctly", () => {
    expect(formatRelativeTime(at(2 * 24 * 60 * 60_000), NOW)).toBe("2d ago");
  });

  it("falls back to ISO date for >7 days", () => {
    expect(formatRelativeTime(at(10 * 24 * 60 * 60_000), NOW)).toBe(
      "2026-05-10"
    );
  });
});
