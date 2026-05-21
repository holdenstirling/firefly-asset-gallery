"use client";

import Image from "next/image";
import { Heart, MoreHorizontal } from "lucide-react";
import type { Asset } from "@/lib/types";
import { picsumUrl } from "@/lib/picsum";
import { cn } from "@/lib/utils";
import { useFavoritesStore, useGalleryStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const isFavorited = useFavoritesStore((s) => s.favoritedIds.has(asset.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const setSelectedAssetId = useGalleryStore((s) => s.setSelectedAssetId);
  const openDetail = () => setSelectedAssetId(asset.id);

  const aspectClass =
    asset.parameters.aspectRatio === "16:9"
      ? "aspect-video"
      : asset.parameters.aspectRatio === "9:16"
        ? "aspect-[9/16]"
        : asset.parameters.aspectRatio === "4:3"
          ? "aspect-[4/3]"
          : asset.parameters.aspectRatio === "3:4"
            ? "aspect-[3/4]"
            : "aspect-square";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${asset.prompt}`}
      data-testid="asset-card"
      data-asset-trigger={asset.id}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
      className={cn(
        "cursor-pointer",
        "group relative w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        aspectClass
      )}
    >
      <Image
        src={picsumUrl({ seed: asset.seed, width: 800, height: 800 })}
        alt={asset.prompt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />

      <div
        className="pointer-events-auto absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => toggleFavorite(asset.id)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70",
            isFavorited && "text-pink-400"
          )}
          aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        >
          <Heart
            className="h-4 w-4"
            fill={isFavorited ? "currentColor" : "none"}
          />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          aria-label="More"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs leading-snug text-white">
          {asset.prompt}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge variant="muted" className="text-[10px]">
            {asset.parameters.stylePreset}
          </Badge>
          <span className="text-[10px] text-zinc-300">
            {asset.parameters.aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
}
