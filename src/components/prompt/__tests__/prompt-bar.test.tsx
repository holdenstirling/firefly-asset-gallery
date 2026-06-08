import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PromptBar } from "../prompt-bar";
import { DEFAULT_GENERATION_PARAMETERS } from "@/lib/style-studio";
import { useGalleryStore } from "@/lib/store";

describe("PromptBar", () => {
  beforeEach(() => {
    useGalleryStore.setState({
      parameters: DEFAULT_GENERATION_PARAMETERS,
      generatedAssets: [],
      selectedAssetId: null,
    });
  });

  it("labels prompt input and suggested prompt buttons", () => {
    render(<PromptBar />);

    expect(screen.getByRole("form", { name: "Generate asset" })).toBeInTheDocument();
    expect(screen.getByLabelText("Asset prompt")).toBeInTheDocument();

    const suggestedPrompt = screen.getByRole("button", {
      name: /Use suggested prompt: Editorial fashion shot/,
    });
    fireEvent.click(suggestedPrompt);

    expect(screen.getByLabelText("Asset prompt")).toHaveValue(
      "Editorial fashion shot, brutalist concrete wall"
    );
  });

  it("submits a generated asset from the prompt input", () => {
    render(<PromptBar />);

    fireEvent.change(screen.getByLabelText("Asset prompt"), {
      target: { value: "Accessible generated asset" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate" }));

    expect(useGalleryStore.getState().generatedAssets[0]?.prompt).toBe(
      "Accessible generated asset"
    );
  });
});
