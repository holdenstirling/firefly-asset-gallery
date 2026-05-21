import { Palette, Sparkles, Layers, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Style Studio — intentionally a SKELETON.
 *
 * This is the page the live demo will plan and build out. Today it shows the
 * concept (define reusable style presets that combine palette, typography,
 * content type, and parameters, then auto-apply to future generations) but
 * none of the underlying functionality exists yet.
 *
 * Live-demo target features:
 *   1. Define a Style: name, palette, fonts, content type, default params
 *   2. Live preview using picsum-driven mock generations
 *   3. Apply a Style to the gallery so new generations inherit its params
 *   4. Persist styles (local first, then a server route)
 *   5. Export Style as design tokens (JSON / CSS)
 *
 * See plan.md for the full plan we generate during the demo.
 */
export default function StyleStudioPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Style Studio
            <span className="ml-2 rounded-full firefly-gradient px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-white">
              Coming Soon
            </span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Define reusable style presets that auto-apply to every generation.
          </p>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-2xl rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full firefly-gradient">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold">
            Lock in a brand voice — once.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Style Studio lets you bundle a palette, typography, content type,
            and generation parameters into a reusable Style. Apply it to the
            gallery and every new generation matches the brand automatically.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <FeatureCard
              icon={<Layers className="h-4 w-4" />}
              title="Brand palettes"
              body="Bundle colors and contrast rules per Style."
            />
            <FeatureCard
              icon={<Wand2 className="h-4 w-4" />}
              title="Smart defaults"
              body="Aspect, model, guidance — set them once."
            />
            <FeatureCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Live preview"
              body="See three sample generations as you tune."
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Button variant="gradient">
              <Sparkles className="h-4 w-4" />
              Get notified
            </Button>
            <Button variant="outline">Read the brief</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
