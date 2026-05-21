"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutGrid,
  Layers,
  Palette,
  History,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Gallery", icon: LayoutGrid },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/style-studio", label: "Style Studio", icon: Palette, badge: "New" },
  { href: "/palette-extractor", label: "Palette Extractor", icon: Palette, badge: "New" },
  { href: "/prompts", label: "Prompt History", icon: History },
];

const SECONDARY = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-card/50 px-3 py-5">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 px-2"
      >
        <div className="firefly-gradient flex h-8 w-8 items-center justify-center rounded-md shadow-md">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Firefly</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Asset Gallery
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full firefly-gradient px-1.5 py-0.5 text-[9px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-border pt-3">
        {SECONDARY.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg border border-border bg-background/40 p-3">
        <div className="flex items-center gap-2">
          <div className="firefly-gradient flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white">
            HO
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium">Holden Stirling</span>
            <span className="text-[10px] text-muted-foreground">Adobe — CC Brand</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
