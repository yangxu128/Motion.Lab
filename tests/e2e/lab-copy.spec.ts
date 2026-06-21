import { test, expect } from '@playwright/test';

test('code panel copy button works', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/lab?open=fade-in&panel=code');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '复制' }).click();
  await expect(page.getByText('已复制')).toBeVisible();
});
