"use client";

import Image from "next/image";
import { Download, Heart, Wand2, Copy, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGalleryStore, useFavoritesStore } from "@/lib/store";
import { findAssetById, MOCK_NOW } from "@/lib/mock-data";
import { picsumUrl, avatarUrl } from "@/lib/picsum";
import { cn, formatRelativeTime } from "@/lib/utils";

export function AssetDetail() {
  const selectedAssetId = useGalleryStore((s) => s.selectedAssetId);
  const setSelectedAssetId = useGalleryStore((s) => s.setSelectedAssetId);
  const isFavorited = useFavoritesStore((s) =>
    selectedAssetId ? s.favoritedIds.has(selectedAssetId) : false
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const asset = selectedAssetId ? findAssetById(selectedAssetId) : null;

  return (
    <Dialog
      open={!!asset}
      onOpenChange={(open) => !open && setSelectedAssetId(null)}
    >
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden p-0 sm:rounded-xl">
        {asset && (
          <div className="grid h-full max-h-[90vh] grid-cols-1 md:grid-cols-[1.4fr_1fr]">
            <div className="relative bg-black">
              <Image
                src={picsumUrl({
                  seed: asset.seed,
                  width: 1600,
                  height: 1600,
                })}
                alt={asset.prompt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
              />
            </div>

            <div className="flex max-h-[90vh] flex-col overflow-y-auto scrollbar-thin">
              <div className="border-b border-border p-5">
                <DialogTitle className="text-base font-semibold leading-snug">
                  {asset.prompt}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs text-muted-foreground">
                  Generated {formatRelativeTime(asset.createdAt, MOCK_NOW)} ·
                  seed {asset.seed}
                </DialogDescription>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {asset.tags.map((t) => (
                    <Badge key={t} variant="muted">
                      #{t}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Image
                    src={avatarUrl(asset.author.avatarSeed)}
                    alt={asset.author.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-xs text-muted-foreground">
                    by {asset.author.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-border p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Parameters
                </h3>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <ParamRow label="Model" value={asset.parameters.model} />
                  <ParamRow
                    label="Aspect"
                    value={asset.parameters.aspectRatio}
                  />
                  <ParamRow
                    label="Style"
                    value={asset.parameters.stylePreset}
                  />
                  <ParamRow
                    label="Content"
                    value={asset.parameters.contentType}
                  />
                  <ParamRow
                    label="Guidance"
                    value={asset.parameters.guidance.toFixed(1)}
                  />
                  <ParamRow label="Steps" value={asset.parameters.steps} />
                </dl>
              </div>

              <div className="flex flex-col gap-2 p-5">
                <Button variant="gradient" className="w-full">
                  <Wand2 className="h-4 w-4" />
                  Remix this prompt
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(asset.id)}
                  className={cn(
                    "mt-1 w-full",
                    isFavorited && "text-pink-400"
                  )}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                  {isFavorited ? "Favorited" : "Add to favorites"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ParamRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
