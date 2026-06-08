"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MeetingCardProps {
  meeting: Meeting;
  onDelete?: (id: string) => void;
}

const MENU_ITEMS = ["Rename meeting", "Copy share link"] as const;

export function MeetingCard({ meeting, onDelete }: MeetingCardProps) {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setActiveMenuIndex(0);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const menuItems =
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    menuItems?.[activeMenuIndex]?.focus();
  }, [activeMenuIndex, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setActiveMenuIndex(0);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveMenuIndex((index) => (index + 1) % MENU_ITEMS.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveMenuIndex(
          (index) => (index - 1 + MENU_ITEMS.length) % MENU_ITEMS.length
        );
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        closeMenu();
        break;
      default:
        break;
    }
  };

  const handleDeleteKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onDelete?.(meeting.id);
    }
  };

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/meetings/${meeting.id}`}
            className="block text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
          >
            {meeting.title}
          </Link>
          <time
            dateTime={meeting.recordedAt}
            className="mt-1 block text-xs text-muted-foreground"
          >
            {formatRelativeTime(meeting.recordedAt)}
          </time>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${meeting.title}`}
            onClick={() => onDelete?.(meeting.id)}
            onKeyDown={handleDeleteKeyDown}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>

          <div className="relative" ref={menuRef}>
            <Button
              ref={menuButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`More actions for ${meeting.title}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuId : undefined}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Escape" && menuOpen) {
                  event.preventDefault();
                  closeMenu();
                  return;
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (!menuOpen) {
                    setMenuOpen(true);
                    return;
                  }
                  setActiveMenuIndex((index) => (index + 1) % MENU_ITEMS.length);
                }
                if (event.key === "ArrowUp" && menuOpen) {
                  event.preventDefault();
                  setActiveMenuIndex(
                    (index) => (index - 1 + MENU_ITEMS.length) % MENU_ITEMS.length
                  );
                }
              }}
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>

            {menuOpen && (
              <div
                id={menuId}
                role="menu"
                aria-label={`Actions for ${meeting.title}`}
                onKeyDown={handleMenuKeyDown}
                className="absolute right-0 top-full z-10 mt-1 min-w-[10rem] rounded-md border border-border bg-popover p-1 shadow-lg"
              >
                {MENU_ITEMS.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    tabIndex={index === activeMenuIndex ? 0 : -1}
                    className={cn(
                      "flex w-full rounded-sm px-2 py-1.5 text-left text-sm text-popover-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      index === activeMenuIndex && "bg-secondary"
                    )}
                    onKeyDown={handleMenuKeyDown}
                    onClick={closeMenu}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
