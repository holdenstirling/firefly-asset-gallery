import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AssetCard } from "../asset-card";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { useFavoritesStore, useGalleryStore } from "@/lib/store";

const asset = MOCK_ASSETS[0];

describe("AssetCard", () => {
  beforeEach(() => {
    useGalleryStore.setState({ selectedAssetId: null });
    useFavoritesStore.setState({ favoritedIds: new Set<string>() });
  });

  it("renders separate open and favorite controls", () => {
    render(<AssetCard asset={asset} />);

    const openButton = screen.getByRole("button", {
      name: `Open asset details for ${asset.prompt}`,
    });
    const favoriteButton = screen.getByRole("button", {
      name: `Add ${asset.prompt} to favorites`,
    });

    expect(openButton).not.toContainElement(favoriteButton);
    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(openButton);
    expect(useGalleryStore.getState().selectedAssetId).toBe(asset.id);
  });

  it("marks favorite state when toggled", () => {
    render(<AssetCard asset={asset} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: `Add ${asset.prompt} to favorites`,
      })
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${asset.prompt} from favorites`,
      })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
