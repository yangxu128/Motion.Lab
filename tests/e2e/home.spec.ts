import { test, expect } from '@playwright/test';

test('home page loads and shows hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('动效');
  await expect(page.getByRole('link', { name: /开始探索/ })).toBeVisible();
});
