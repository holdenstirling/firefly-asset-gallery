"use client";

import Image from "next/image";
import { Plus, Layers } from "lucide-react";
import { MOCK_COLLECTIONS, MOCK_ASSETS, MOCK_NOW } from "@/lib/mock-data";
import { picsumUrl } from "@/lib/picsum";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";

export default function CollectionsPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Collections</h1>
          <p className="text-xs text-muted-foreground">
            Curated boards your team is shipping from.
          </p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" />
          New collection
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MOCK_COLLECTIONS.map((c) => {
            const previewAssets = MOCK_ASSETS.filter((a) =>
              c.assetIds.includes(a.id)
            ).slice(0, 4);

            return (
              <article
                key={c.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
              >
                <div className="relative grid h-44 grid-cols-2 grid-rows-2 gap-0.5 bg-secondary">
                  {previewAssets.length > 0 ? (
                    previewAssets.map((a) => (
                      <div key={a.id} className="relative">
                        <Image
                          src={picsumUrl({
                            seed: a.seed,
                            width: 400,
                            height: 400,
                          })}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Layers className="h-6 w-6" />
                      <span className="text-xs">Empty collection</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="text-sm font-semibold">{c.name}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{c.assetIds.length} assets</span>
                    <span>Updated {formatRelativeTime(c.updatedAt, MOCK_NOW)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
