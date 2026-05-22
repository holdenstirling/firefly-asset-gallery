"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  buildStudioStyleFromPalette,
  createGeneratedAsset,
  DEFAULT_GENERATION_PARAMETERS,
  INITIAL_STUDIO_STYLES,
} from "@/lib/style-studio";
import type { Asset, GenerationParameters, StudioStyle } from "./types";

interface GalleryState {
  searchQuery: string;
  activeStyleFilters: string[];
  selectedAssetId: string | null;
  parameters: GenerationParameters;
  activeStudioStyleId: string | null;
  generatedAssets: Asset[];
  setSearchQuery: (q: string) => void;
  toggleStyleFilter: (style: string) => void;
  clearStyleFilters: () => void;
  setSelectedAssetId: (id: string | null) => void;
  setParameters: (parameters: GenerationParameters) => void;
  setParameter: <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ) => void;
  applyStudioStyle: (style: StudioStyle) => void;
  addGeneratedAsset: (prompt: string) => Asset | null;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  searchQuery: "",
  activeStyleFilters: [],
  selectedAssetId: null,
  parameters: DEFAULT_GENERATION_PARAMETERS,
  activeStudioStyleId: null,
  generatedAssets: [],
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleStyleFilter: (style) =>
    set((state) => ({
      activeStyleFilters: state.activeStyleFilters.includes(style)
        ? state.activeStyleFilters.filter((s) => s !== style)
        : [...state.activeStyleFilters, style],
    })),
  clearStyleFilters: () => set({ activeStyleFilters: [] }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  setParameters: (parameters) => set({ parameters, activeStudioStyleId: null }),
  setParameter: (key, value) =>
    set((state) => ({
      parameters: { ...state.parameters, [key]: value },
      activeStudioStyleId: null,
    })),
  applyStudioStyle: (style) =>
    set({
      parameters: style.parameters,
      activeStudioStyleId: style.id,
    }),
  addGeneratedAsset: (prompt) => {
    let createdAsset: Asset | null = null;

    set((state) => {
      if (!prompt.trim()) return state;

      const asset = createGeneratedAsset({
        prompt,
        parameters: state.parameters,
        count: state.generatedAssets.length,
      });
      createdAsset = asset;

      return {
        generatedAssets: [asset, ...state.generatedAssets],
        selectedAssetId: asset.id,
      };
    });

    return createdAsset;
  },
}));

interface StyleStudioState {
  styles: StudioStyle[];
  activeStyleId: string | null;
  saveStyle: (style: StudioStyle) => void;
  deleteStyle: (id: string) => void;
  setActiveStyleId: (id: string | null) => void;
  addStyleFromPalette: (input: { name: string; palette: string[] }) =>
    StudioStyle;
}

export const useStyleStudioStore = create<StyleStudioState>()(
  persist(
    (set) => ({
      styles: [...INITIAL_STUDIO_STYLES],
      activeStyleId: INITIAL_STUDIO_STYLES[0]?.id ?? null,
      saveStyle: (style) =>
        set((state) => {
          const existing = state.styles.find((item) => item.id === style.id);
          const nextStyle = existing
            ? { ...style, createdAt: existing.createdAt }
            : style;

          return {
            styles: existing
              ? state.styles.map((item) =>
                  item.id === style.id ? nextStyle : item
                )
              : [nextStyle, ...state.styles],
            activeStyleId: nextStyle.id,
          };
        }),
      deleteStyle: (id) =>
        set((state) => {
          const styles = state.styles.filter((style) => style.id !== id);
          return {
            styles,
            activeStyleId:
              state.activeStyleId === id
                ? styles[0]?.id ?? null
                : state.activeStyleId,
          };
        }),
      setActiveStyleId: (id) => set({ activeStyleId: id }),
      addStyleFromPalette: ({ name, palette }) => {
        const style = buildStudioStyleFromPalette({ name, palette });
        set((state) => ({
          styles: [style, ...state.styles],
          activeStyleId: style.id,
        }));
        return style;
      },
    }),
    {
      name: "firefly-style-studio",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface FavoritesState {
  // INTENTIONAL ROUGH EDGE: favorites are not persisted to localStorage yet.
  // Reload the page and they reset. Live demo task can wire up persistence.
  favoritedIds: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoritedIds: new Set<string>(),
  toggleFavorite: (id) =>
    set((state) => {
      const next = new Set(state.favoritedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { favoritedIds: next };
    }),
  isFavorited: (id) => get().favoritedIds.has(id),
}));
