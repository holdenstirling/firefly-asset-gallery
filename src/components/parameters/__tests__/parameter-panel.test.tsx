import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ParameterPanel } from "../parameter-panel";
import { DEFAULT_GENERATION_PARAMETERS } from "@/lib/style-studio";
import { useGalleryStore } from "@/lib/store";

describe("ParameterPanel", () => {
  beforeEach(() => {
    useGalleryStore.setState({ parameters: DEFAULT_GENERATION_PARAMETERS });
  });

  it("labels parameter region and form controls", () => {
    render(<ParameterPanel />);

    expect(
      screen.getByRole("complementary", { name: "Parameters" })
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Content type" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Style preset" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Model" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Guidance" })).toHaveAttribute(
      "aria-valuetext",
      "7.5 guidance"
    );
    expect(screen.getByRole("slider", { name: "Steps" })).toHaveAttribute(
      "aria-valuetext",
      "32 steps"
    );
    expect(screen.getByRole("spinbutton", { name: "Seed" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Randomize seed" })
    ).toBeInTheDocument();
  });

  it("marks the active aspect ratio as pressed", () => {
    render(<ParameterPanel />);

    expect(screen.getByRole("button", { name: "1:1" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "16:9" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
