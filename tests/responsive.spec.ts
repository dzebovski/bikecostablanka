import {expect, test} from "@playwright/test";

const viewports = [
  {width: 375, height: 812},
  {width: 768, height: 1024},
  {width: 1440, height: 1000},
] as const;

test("key pages stay within the viewport at mobile, tablet and desktop widths", async ({page}) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const path of ["/", "/enquire", "/routes/ondara-bernia"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth, `${path} should not overflow at ${viewport.width}px`).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    }
  }
});
