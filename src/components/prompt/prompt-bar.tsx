"use client";

import { useState } from "react";
import { Sparkles, Wand2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGalleryStore } from "@/lib/store";

const QUICK_PROMPTS = [
  "Editorial fashion shot, brutalist concrete wall",
  "Isometric 3D scene, pastel palette",
  "Watercolor illustration of a Tokyo alley",
];

export function PromptBar() {
  const [value, setValue] = useState("");
  const parameters = useGalleryStore((s) => s.parameters);
  const addGeneratedAsset = useGalleryStore((s) => s.addGeneratedAsset);

  const handleGenerate = () => {
    if (!value.trim()) return;
    addGeneratedAsset(value);
    setValue("");
  };

  return (
    <form
      className="rounded-xl border border-border bg-card p-3 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        handleGenerate();
      }}
      aria-label="Generate asset"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="asset-prompt" className="sr-only">
          Asset prompt
        </label>
        <input
          id="asset-prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe an asset to generate, e.g. 'cinematic shot of a Nordic cabin at dusk'"
          className="flex-1 rounded-md bg-transparent px-1 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="hidden items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground sm:inline-flex">
          <ImageIcon className="h-3 w-3" aria-hidden="true" />
          {parameters.aspectRatio} · {parameters.stylePreset}
        </span>
        <Button
          type="submit"
          variant="gradient"
          size="sm"
          disabled={!value.trim()}
          className="shrink-0"
        >
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          Generate
        </Button>
      </div>
      <div
        className="mt-2 flex flex-wrap items-center gap-1.5 pl-7"
        role="group"
        aria-labelledby="quick-prompts-label"
      >
        <span id="quick-prompts-label" className="text-[11px] text-muted-foreground">
          Try:
        </span>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p)}
            className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Use suggested prompt: ${p}`}
          >
            {p}
          </button>
        ))}
      </div>
    </form>
  );
}
