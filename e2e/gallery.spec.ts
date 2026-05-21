import { expect, test } from "@playwright/test";

const TOTAL_ASSETS = 36;

test.describe("gallery page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /firefly asset gallery/i }))
      .toBeVisible();
    await expect(page.getByTestId("asset-card")).toHaveCount(TOTAL_ASSETS);
  });

  test("typing in the search box filters the asset grid", async ({ page }) => {
    await page.getByRole("textbox", { name: /search assets/i }).fill("hummingbird");

    await expect(page.getByTestId("asset-card")).toHaveCount(3);
    await expect(
      page.getByRole("button", {
        name: /open details for photorealistic close-up of a hummingbird/i,
      })
    ).toHaveCount(3);
  });

  test("clicking a style filter chip narrows results and clear resets them", async ({
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

    await page.getByRole("button", { name: "clear", exact: true }).click();

    await expect(watercolorChip).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByTestId("asset-card")).toHaveCount(TOTAL_ASSETS);
  });

  test("clicking an asset card opens the detail modal", async ({ page }) => {
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
  });

  test("the detail modal close button returns focus to the trigger", async ({
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
  });
});
