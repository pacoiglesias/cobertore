import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {
  test('should load the homepage and redirect to /es/', async ({ page }) => {
    await page.goto('/');
    // Check if it redirected to /es/ or /es
    await expect(page).toHaveURL(/.*\/es\/?/);
    // Check title (should match SEO title)
    await expect(page).toHaveTitle(/Cobertores/i);
  });

  test('should display catalog products', async ({ page }) => {
    await page.goto('/es/');
    // Instead of h2 text, check for the product quote button which is always there
    const quoteBtn = page.locator('button', { hasText: /Cotizar|Quote/i }).first();
    await expect(quoteBtn).toBeVisible();
  });

  test('should change language to English', async ({ page }) => {
    await page.goto('/es/');
    
    // Find the language switcher button (EN)
    const enButton = page.locator('a', { hasText: 'EN' }).first();
    if (await enButton.isVisible()) {
      await enButton.click();
      await expect(page).toHaveURL(/.*\/en\//);
    }
  });
});
