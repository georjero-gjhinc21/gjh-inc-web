import { test, expect } from "@playwright/test";

test("smoke test loads homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GJH/);
});
