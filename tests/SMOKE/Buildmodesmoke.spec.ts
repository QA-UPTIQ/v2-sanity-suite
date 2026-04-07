import { test, expect } from '@playwright/test';

test('Create App + Deploy Validation', async ({ page }) => {

  await page.goto('https://builder-qa.uptiq.dev');

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
    await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.locator('#root')).toContainText(
  'Help & Documentation',
    { timeout: 120000 } // waits up to 2 minutes
);

  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.locator('.tiptap').fill('Create Simple TODO Application');
  await page.locator(".lucide.lucide-arrow-up").click();

  await page.getByRole('tab', { name: 'Preview' }).click();
  await expect(page.getByRole('tab', { name: 'Preview' })).toBeVisible();
});