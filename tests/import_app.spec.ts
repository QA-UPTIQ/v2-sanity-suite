import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-qa.uptiq.dev/login');
  await page.evaluate(() => window.moveTo(0, 0));

  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await expect(page.getByRole('textbox', { name: 'Email Id' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

  // Wait for transient toast/notification elements to disappear to avoid intercepting clicks
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
//import app

await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('menuitem', { name: 'Import App Package' }).click();
  const filePath = path.resolve(__dirname, '../download (30).zip');
  if (!fs.existsSync(filePath)) throw new Error(`Import file not found: ${filePath}`);
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole('button', { name: 'Import' }).click();

  });