import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptHistory } from "../prompt-history";
import { MOCK_PROMPT_HISTORY } from "@/lib/mock-data";

const item = MOCK_PROMPT_HISTORY[0];

describe("PromptHistory", () => {
  it("renders display-only cards without inactive buttons", () => {
    render(<PromptHistory items={[item]} />);

    expect(screen.getByRole("list", { name: "Prompt history" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(item.prompt)).toBeInTheDocument();
  });

  it("labels selectable prompt cards when a handler is provided", () => {
    const onSelect = vi.fn();
    render(<PromptHistory items={[item]} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: `Use prompt: ${item.prompt}` }));

    expect(onSelect).toHaveBeenCalledWith(item);
  });
});
