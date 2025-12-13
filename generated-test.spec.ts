import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://builder-qa.uptiq.dev/login');
  await page.getByRole('group').getByRole('button').filter({ hasText: /^$/ }).click();
});