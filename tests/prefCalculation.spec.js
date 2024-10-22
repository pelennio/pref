// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Basic checks", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5501/");
  });
  test("has title", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Pref score for 2/);
  });

  test("resetConfirmation_modal is shown", async ({ page }) => {
    // Click the "Start New Game" button".
    await page.locator("#localReset").click();

    // Expects resetConfirmation_modal is visible.
    await expect(page.locator("#resetConfirmation_modal")).toBeVisible();
  });

  test("newGame_modal is shown", async ({ page }) => {
    // Click the "Play" button".
    await page.locator("#playNewGame").click();

    // Expects resetConfirmation_modal is visible.
    await expect(page.locator("#newGame_modal")).toBeVisible();
  });

  test("score for small game", async ({ page }) => {
    // Click the "Play" button".
    await page.locator("#playNewGame").click();

    // Expects resetConfirmation_modal is visible.
    await expect(page.locator("#newGame_modal")).toBeVisible();
  });
});

test.describe("set up a new game and play game", async () => {
  // Mark beforeEach as async
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5501/");
    await page.getByRole("button", { name: "Start new game" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
    await page.getByRole("button", { name: "2" }).click();
    await page.getByPlaceholder("Enter pool value").click();
    await page.getByPlaceholder("Enter pool value").fill("10");
    await page.getByPlaceholder("Enter Player 1 Name").click();
    await page.getByPlaceholder("Enter Player 1 Name").fill("Olena");
    await page.getByPlaceholder("Enter Player 2 Name").click();
    await page.getByPlaceholder("Enter Player 2 Name").fill("Anton");
    await page.getByRole("button", { name: "Yes" }).click();
  });

  // Mark test function as async
  test("set up a new game and play basic game", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "6" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "4" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (12)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-12)");
  });

  // Mark this test function as async too
  test("basic raspas", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Raspasovka" }).click();
    await page.getByRole("button", { name: "2" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (30)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-30)");
    await expect(page.locator("#player2_Mountain")).toContainText("6");
  });

  test("without 3", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "7" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "Without" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (-60)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (60)");
    await expect(page.locator("#player1_Mountain")).toContainText("12");
  });

  test("played mizer", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "Miser" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "10" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (100)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-100)");
    await expect(page.locator("#player1_Pool")).toContainText("10");
  });

  test("winner modal", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "10" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "0", exact: true }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (100)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-100)");
    await expect(page.locator("#player1_Pool")).toContainText("10");

    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "10" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "0", exact: true }).click();

    await expect(page.locator("#modalContainerMain")).toBeVisible();
    await expect(page.locator("#winnerAnnouncement")).toContainText(
      "It's a draw! Both Olena and Anton have a score of 0. 🤝"
    );
    await expect(page.locator("#player1_Name")).toContainText("  Olena (0)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (0)");
  });

  test("undo previous round", async ({ page }) => {
    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "6" }).click();
    await page.getByRole("button", { name: "Nobody" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (20)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-20)");

    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "7" }).click();
    await page.getByRole("button", { name: "Nobody" }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (60)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-60)");
    await page.getByRole("button", { name: "Undo" }).click();
    await page.reload({ waitUntil: "load" });
    await expect(page.locator("#player1_Name")).toContainText("  Olena (20)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-20)");

    await page.getByRole("button", { name: "Play" }).click();
    await page.getByRole("button", { name: "Anton" }).click();
    await page.getByRole("button", { name: "8" }).click();
    await page.getByRole("button", { name: "Olena" }).click();
    await page.getByRole("button", { name: "3", exact: true }).click();
    await expect(page.locator("#player1_Name")).toContainText("  Olena (74)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-74)");
    await page.getByRole("button", { name: "Undo" }).click();
    await page.reload({ waitUntil: "load" });
    await expect(page.locator("#player1_Name")).toContainText("  Olena (20)");
    await expect(page.locator("#player2_Name")).toContainText("Anton (-20)");
  });
});
