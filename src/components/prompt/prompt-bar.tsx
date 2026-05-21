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
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Describe an asset to generate, e.g. 'cinematic shot of a Nordic cabin at dusk'"
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <span className="hidden items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground sm:inline-flex">
          <ImageIcon className="h-3 w-3" />
          {parameters.aspectRatio} · {parameters.stylePreset}
        </span>
        <Button
          variant="gradient"
          size="sm"
          disabled={!value.trim()}
          onClick={handleGenerate}
          className="shrink-0"
        >
          <Wand2 className="h-4 w-4" />
          Generate
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-7">
        <span className="text-[11px] text-muted-foreground">Try:</span>
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p)}
            className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
