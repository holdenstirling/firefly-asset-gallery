"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGalleryStore } from "@/lib/store";
import type { StylePreset } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: StylePreset[] = [
  "photorealistic",
  "cinematic",
  "illustration",
  "3d-render",
  "watercolor",
  "neon",
  "minimal",
  "vintage",
];

interface GalleryToolbarProps {
  onToggleParameters: () => void;
  parametersOpen: boolean;
}

export function GalleryToolbar({
  onToggleParameters,
  parametersOpen,
}: GalleryToolbarProps) {
  const searchQuery = useGalleryStore((s) => s.searchQuery);
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery);
  const activeStyleFilters = useGalleryStore((s) => s.activeStyleFilters);
  const toggleStyleFilter = useGalleryStore((s) => s.toggleStyleFilter);
  const clearStyleFilters = useGalleryStore((s) => s.clearStyleFilters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search assets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts, tags, authors…"
            className="pl-8"
          />
        </div>
        <Button
          variant={parametersOpen ? "default" : "outline"}
          size="sm"
          onClick={onToggleParameters}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Parameters
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Style</span>
        {STYLES.map((style) => {
          const active = activeStyleFilters.includes(style);
          return (
            <button
              key={style}
              type="button"
              aria-pressed={active}
              onClick={() => toggleStyleFilter(style)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                active
                  ? "border-transparent firefly-gradient text-white"
                  : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {style}
            </button>
          );
        })}
        {activeStyleFilters.length > 0 && (
          <button
            type="button"
            onClick={clearStyleFilters}
            className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> clear
          </button>
        )}
      </div>
    </div>
  );
}
