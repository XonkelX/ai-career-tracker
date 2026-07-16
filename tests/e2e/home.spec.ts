import { expect, test } from "@playwright/test";

test("renders the foundation landing page", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /run a more focused/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create an account" }),
  ).toHaveAttribute("href", "/sign-up");
});
