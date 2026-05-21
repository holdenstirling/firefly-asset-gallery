"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { MOCK_ASSETS, MOCK_PROMPT_HISTORY } from "@/lib/mock-data";
import { PromptBar } from "@/components/prompt/prompt-bar";
import { GalleryToolbar } from "@/components/gallery/gallery-toolbar";
import { AssetGrid } from "@/components/gallery/asset-grid";
import { AssetDetail } from "@/components/gallery/asset-detail";
import { ParameterPanel } from "@/components/parameters/parameter-panel";
import { PromptHistory } from "@/components/prompt/prompt-history";
import { useGalleryStore } from "@/lib/store";

export default function GalleryPage() {
  const [parametersOpen, setParametersOpen] = useState(false);
  const generatedAssets = useGalleryStore((s) => s.generatedAssets);
  const assets = useMemo(
    () => [...generatedAssets, ...MOCK_ASSETS],
    [generatedAssets]
  );

  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="firefly-gradient-text">Firefly</span> Asset Gallery
          </h1>
          <p className="text-xs text-muted-foreground">
            Generate, organize, and remix brand-ready assets across your team.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            {assets.length} assets · {MOCK_PROMPT_HISTORY.length} prompts
          </span>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[1fr_auto] overflow-hidden">
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin px-6 py-5">
          <PromptBar />
          <GalleryToolbar
            parametersOpen={parametersOpen}
            onToggleParameters={() => setParametersOpen((v) => !v)}
          />
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <AssetGrid assets={assets} />
            </div>
            {parametersOpen && (
              <div className="hidden lg:block">
                <ParameterPanel />
              </div>
            )}
          </div>
        </div>

        <aside className="hidden w-72 shrink-0 flex-col border-l border-border bg-card/30 xl:flex">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent prompts
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
            <PromptHistory items={MOCK_PROMPT_HISTORY} />
          </div>
        </aside>
      </div>

      <AssetDetail assets={assets} />
    </div>
  );
}
