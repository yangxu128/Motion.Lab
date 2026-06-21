import { test, expect } from '@playwright/test';

test('search filters cards', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByText('淡入').first()).toBeVisible();
  await page.getByPlaceholder('搜索动效、标签…').fill('magnetic');
  await expect(page.getByText('淡入')).toHaveCount(0);
  await expect(page.getByText('磁吸光标').first()).toBeVisible();
});

test('category tab filters', async ({ page }) => {
  await page.goto('/lab');
  await page.getByRole('tab', { name: '文字' }).click();
  await expect(page).toHaveURL(/cat=text/);
});
