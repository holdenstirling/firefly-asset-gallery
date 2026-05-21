"use client";

import { useGalleryStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type {
  AspectRatio,
  ContentType,
  GenerationParameters,
  StylePreset,
} from "@/lib/types";
import { Shuffle } from "lucide-react";

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
const ASPECTS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];
const CONTENT_TYPES: ContentType[] = ["image", "vector", "3d", "video"];

export function ParameterPanel() {
  const parameters = useGalleryStore((s) => s.parameters);
  const setParameter = useGalleryStore((s) => s.setParameter);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Parameters</h3>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          Live
        </span>
      </div>

      <Field label="Content type">
        <Select
          value={parameters.contentType}
          onValueChange={(v) =>
            setParameter("contentType", v as GenerationParameters["contentType"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Style preset">
        <Select
          value={parameters.stylePreset}
          onValueChange={(v) =>
            setParameter("stylePreset", v as StylePreset)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Aspect ratio">
        <div className="grid grid-cols-5 gap-1.5">
          {ASPECTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setParameter("aspectRatio", a)}
              className={`rounded-md border px-1.5 py-1 text-[11px] transition-colors ${
                parameters.aspectRatio === a
                  ? "border-transparent firefly-gradient text-white"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Model">
        <Select
          value={parameters.model}
          onValueChange={(v) =>
            setParameter("model", v as GenerationParameters["model"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firefly-image-3">firefly-image-3</SelectItem>
            <SelectItem value="firefly-image-2">firefly-image-2</SelectItem>
            <SelectItem value="firefly-vector">firefly-vector</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field
        label="Guidance"
        hint={parameters.guidance.toFixed(1)}
      >
        <Slider
          value={[parameters.guidance]}
          onValueChange={([v]) => setParameter("guidance", v)}
          min={1}
          max={15}
          step={0.5}
        />
      </Field>

      <Field label="Steps" hint={String(parameters.steps)}>
        <Slider
          value={[parameters.steps]}
          onValueChange={([v]) => setParameter("steps", v)}
          min={10}
          max={60}
          step={1}
        />
      </Field>

      <Field
        label="Seed"
        hint={String(parameters.seed)}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setParameter("seed", Math.floor(Math.random() * 100_000))
            }
            className="h-6 px-2 text-[11px]"
          >
            <Shuffle className="h-3 w-3" />
            Randomize
          </Button>
        }
      >
        <input
          type="number"
          value={parameters.seed}
          onChange={(e) =>
            setParameter("seed", Number.parseInt(e.target.value, 10) || 0)
          }
          className="h-8 w-full rounded-md border border-border bg-input px-2 text-xs"
        />
      </Field>
    </aside>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, hint, action, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        <div className="flex items-center gap-1">
          {hint && (
            <span className="font-mono text-[11px] text-muted-foreground">
              {hint}
            </span>
          )}
          {action}
        </div>
      </div>
      {children}
    </div>
  );
}
