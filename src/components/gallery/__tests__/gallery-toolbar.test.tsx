import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GalleryToolbar } from "../gallery-toolbar";
import { useGalleryStore } from "@/lib/store";

describe("GalleryToolbar", () => {
  beforeEach(() => {
    useGalleryStore.setState({ searchQuery: "", activeStyleFilters: [] });
  });

  it("labels search and parameter controls", () => {
    const onToggleParameters = vi.fn();

    render(
      <GalleryToolbar
        parametersOpen={true}
        onToggleParameters={onToggleParameters}
      />
    );

    expect(screen.getByLabelText("Search assets")).toHaveAttribute(
      "aria-controls",
      "asset-results"
    );

    const parametersButton = screen.getByRole("button", {
      name: "Parameters",
    });
    expect(parametersButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(parametersButton);
    expect(onToggleParameters).toHaveBeenCalledTimes(1);
  });

  it("updates style filter pressed state and clears filters", () => {
    render(
      <GalleryToolbar parametersOpen={false} onToggleParameters={() => {}} />
    );

    const cinematicFilter = screen.getByRole("button", { name: "cinematic" });
    expect(cinematicFilter).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(cinematicFilter);
    expect(cinematicFilter).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(
      screen.getByRole("button", { name: "Clear style filters" })
    );
    expect(cinematicFilter).toHaveAttribute("aria-pressed", "false");
  });
});
