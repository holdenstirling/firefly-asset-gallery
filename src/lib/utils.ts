import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as a relative time string (e.g. "5m ago", "3h ago", "2d ago").
 *
 * The `now` reference is explicit so callers can render deterministically.
 * For mock data we pass `MOCK_NOW`; for live data callers pass `Date.now()`.
 */
export function formatRelativeTime(
  date: Date | string,
  now: number = Date.now()
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = now - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toISOString().slice(0, 10);
}
