import { test, expect } from '@playwright/test';

test.describe('Choplifter Game', () => {
  test('should boot and show title screen', async ({ page }) => {
    await page.goto('/');
    // Wait for the canvas to appear (Phaser renders to a canvas)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('should transition to game on Enter key', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Wait for boot + title scene
    await page.waitForTimeout(1000);

    // Press Enter to start
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check game state is exposed
    const state = await page.evaluate(() => (window as any).__gameState);
    expect(state).toBeDefined();
    expect(state.lives).toBe(3);
    expect(state.hostagesRescued).toBe(0);
  });
});
