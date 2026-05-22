import { expect, test } from "@playwright/test";

const TOTAL_ASSETS = 36;

test.describe("gallery page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /firefly asset gallery/i }))
      .toBeVisible();
    await expect(page.getByTestId("asset-card")).toHaveCount(TOTAL_ASSETS);
  });

  test("search filters the grid and clearing restores every asset", async ({
    page,
  }) => {
    const search = page.getByRole("textbox", { name: /search assets/i });

    await search.fill("hummingbird");

    await expect(page.getByTestId("asset-card")).toHaveCount(3);
    await expect(
      page.getByRole("button", {
        name: /open details for photorealistic close-up of a hummingbird/i,
      })
    ).toHaveCount(3);

    await search.clear();

    await expect(page.getByTestId("asset-card")).toHaveCount(TOTAL_ASSETS);
  });

  test("style filter chips compose and clear resets them", async ({
    page,
  }) => {
    const watercolorChip = page.getByRole("button", {
      name: "watercolor",
      exact: true,
    });

    await watercolorChip.click();

    await expect(watercolorChip).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("asset-card")).toHaveCount(3);
    await expect(
      page.getByRole("button", {
        name: /open details for hand-painted watercolor illustration/i,
      })
    ).toHaveCount(3);

    await page
      .getByRole("button", {
        name: "cinematic",
        exact: true,
      })
      .click();

    await expect(page.getByTestId("asset-card")).toHaveCount(9);
    await expect(
      page.getByRole("button", {
        name: /open details for a futuristic cityscape at golden hour/i,
      })
    ).toHaveCount(3);
    await expect(
      page.getByRole("button", {
        name: /open details for cinematic shot of a snow-covered nordic cabin/i,
      })
    ).toHaveCount(3);

    await page.getByRole("button", { name: "clear", exact: true }).click();

    await expect(watercolorChip).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByTestId("asset-card")).toHaveCount(TOTAL_ASSETS);
  });

  test("clicking an asset card opens the detail modal with asset metadata", async ({
    page,
  }) => {
    await page
      .getByRole("button", {
        name: /open details for a futuristic cityscape at golden hour/i,
      })
      .first()
      .click();

    const dialog = page.getByRole("dialog", {
      name: /a futuristic cityscape at golden hour/i,
    });

    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", {
        name: /a futuristic cityscape at golden hour/i,
      })
    ).toBeVisible();
    await expect(dialog.getByText("Generated 18m ago · seed 1000")).toBeVisible();
    await expect(dialog.getByText("by Maya Chen")).toBeVisible();
    await expect(dialog.getByText("firefly-image-3")).toBeVisible();
    await expect(dialog.getByText("1:1")).toBeVisible();
    await expect(dialog.getByText("cinematic")).toBeVisible();
    await expect(dialog.getByText("image", { exact: true })).toBeVisible();
    await expect(dialog.getByText("7.5")).toBeVisible();
    await expect(dialog.getByText("32")).toBeVisible();
  });

  test("the detail modal close button and Escape return focus to the trigger", async ({
    page,
  }) => {
    const trigger = page
      .getByRole("button", {
        name: /open details for a futuristic cityscape at golden hour/i,
      })
      .first();

    await trigger.click();
    await expect(
      page.getByRole("dialog", {
        name: /a futuristic cityscape at golden hour/i,
      })
    ).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();

    await expect(
      page.getByRole("dialog", {
        name: /a futuristic cityscape at golden hour/i,
      })
    ).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.press("Enter");
    await expect(
      page.getByRole("dialog", {
        name: /a futuristic cityscape at golden hour/i,
      })
    ).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("dialog", {
        name: /a futuristic cityscape at golden hour/i,
      })
    ).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("recent prompts render deterministic relative timestamps", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /recent prompts/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /a futuristic cityscape at golden hour.*3 assets.*18m ago/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /studio product photo of a ceramic mug.*3 assets.*1h ago/i,
      })
    ).toBeVisible();
  });
});
