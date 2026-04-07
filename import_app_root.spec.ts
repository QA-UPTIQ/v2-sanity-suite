import { test, expect } from '@playwright/test';
import * as fs from 'fs';

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
  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

  // Wait for transient toast/notification elements to disappear to avoid intercepting clicks
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
//import app

await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('menuitem', { name: 'Import App Package' }).click();
  await page.locator('div').filter({ hasText: 'Click to upload or drag and' }).nth(4).click();
  await page.locator('div').filter({ hasText: 'Click to upload or drag and' }).nth(4).setInputFiles('download (30).zip');
  await page.getByRole('button', { name: 'Import' }).click();
  await page.goto('https://builder-dev.uptiq.dev/app-builder/f5956f13-0ead-4c29-b7e6-6d85c8ba0d16?accountId=5c842418-c21d-434f-a151-9480302715bf&appId=00914155-8619-487d-a58f-d2c42fc29c85&tab=preview');

  });