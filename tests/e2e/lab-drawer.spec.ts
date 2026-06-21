import { test, expect } from '@playwright/test';

test('clicking 调参 opens drawer with params', async ({ page }) => {
  await page.goto('/lab');
  await page.getByRole('button', { name: /调参/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('text=/时长|周期|速度|强度|距离|延迟/').first()).toBeVisible();
});

test('Escape closes drawer', async ({ page }) => {
  await page.goto('/lab?open=fade-in&panel=params');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/open=/);
});
