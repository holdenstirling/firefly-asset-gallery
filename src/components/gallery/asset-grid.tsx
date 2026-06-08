"use client";

import { useMemo } from "react";
import type { Asset } from "@/lib/types";
import { AssetCard } from "./asset-card";
import { useGalleryStore } from "@/lib/store";

interface AssetGridProps {
  assets: Asset[];
}

export function AssetGrid({ assets }: AssetGridProps) {
  const searchQuery = useGalleryStore((s) => s.searchQuery);
  const activeStyleFilters = useGalleryStore((s) => s.activeStyleFilters);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assets.filter((a) => {
      if (
        activeStyleFilters.length > 0 &&
        !activeStyleFilters.includes(a.parameters.stylePreset)
      ) {
        return false;
      }
      if (!q) return true;
      const haystack =
        `${a.prompt} ${a.tags.join(" ")} ${a.author.name}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [assets, searchQuery, activeStyleFilters]);

  if (filtered.length === 0) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground"
        role="status"
      >
        No assets match your filters.
      </div>
    );
  }

  return (
    <div
      id="asset-results"
      className="columns-1 gap-3 sm:columns-2 md:columns-3 xl:columns-4"
      role="list"
      aria-label={`${filtered.length} asset results`}
    >
      {filtered.map((asset) => (
        <div key={asset.id} className="mb-3 break-inside-avoid" role="listitem">
          <AssetCard asset={asset} />
        </div>
      ))}
    </div>
  );
}
