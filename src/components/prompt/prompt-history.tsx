"use client";

import Image from "next/image";
import type { PromptHistoryItem } from "@/lib/types";
import { picsumUrl } from "@/lib/picsum";
import { MOCK_NOW } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

interface PromptHistoryProps {
  items: PromptHistoryItem[];
  onSelect?: (item: PromptHistoryItem) => void;
}

export function PromptHistory({ items, onSelect }: PromptHistoryProps) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect?.(item)}
            className="group flex w-full items-start gap-3 px-2 py-2.5 text-left transition-colors hover:bg-secondary/40"
          >
            <Image
              src={picsumUrl({
                seed: item.thumbnailSeed,
                width: 88,
                height: 88,
              })}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-md object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="line-clamp-2 text-xs leading-snug">
                {item.prompt}
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                {item.assetCount} assets ·{" "}
                {formatRelativeTime(item.createdAt, MOCK_NOW)}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
