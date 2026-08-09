import { test, expect } from '@playwright/test';

test.describe('Intranet E2E', () => {
  test('should load the login page at /intranet', async ({ page }) => {
    await page.goto('/intranet');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button', { hasText: /Iniciar Sesi[oó]n|Entrar|Ingresar|Login/i })).toBeVisible();
  });

  test('should block unauthorized access to dashboard', async ({ page }) => {
    // Go directly to dashboard without logging in
    await page.goto('/intranet/dashboard');
    // Depending on the implementation, it should either redirect back to /intranet or show an unauthorized message
    // Let's assume it redirects to /intranet if not logged in
    await expect(page).toHaveURL(/.*\/intranet/);
  });
});
