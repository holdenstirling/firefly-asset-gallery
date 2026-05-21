"use client";

import { create } from "zustand";
import type { GenerationParameters } from "./types";

interface GalleryState {
  searchQuery: string;
  activeStyleFilters: string[];
  selectedAssetId: string | null;
  // INTENTIONAL ROUGH EDGE: parameters are stored here but the parameter panel
  // doesn't yet wire them into the prompt bar. A live demo task fixes this.
  parameters: GenerationParameters;
  setSearchQuery: (q: string) => void;
  toggleStyleFilter: (style: string) => void;
  clearStyleFilters: () => void;
  setSelectedAssetId: (id: string | null) => void;
  setParameter: <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ) => void;
}

const DEFAULT_PARAMETERS: GenerationParameters = {
  contentType: "image",
  aspectRatio: "1:1",
  stylePreset: "photorealistic",
  model: "firefly-image-3",
  seed: 1234,
  guidance: 7.5,
  steps: 32,
};

export const useGalleryStore = create<GalleryState>((set) => ({
  searchQuery: "",
  activeStyleFilters: [],
  selectedAssetId: null,
  parameters: DEFAULT_PARAMETERS,
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleStyleFilter: (style) =>
    set((state) => ({
      activeStyleFilters: state.activeStyleFilters.includes(style)
        ? state.activeStyleFilters.filter((s) => s !== style)
        : [...state.activeStyleFilters, style],
    })),
  clearStyleFilters: () => set({ activeStyleFilters: [] }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  setParameter: (key, value) =>
    set((state) => ({ parameters: { ...state.parameters, [key]: value } })),
}));

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
