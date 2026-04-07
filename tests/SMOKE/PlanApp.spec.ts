import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
    await page.goto('https://builder-prod.uptiq.dev/');
  await page.evaluate(() => window.moveTo(0, 0));

  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagar@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await expect(page.getByRole('textbox', { name: 'Email Id' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
  await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(3000);
 


  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.locator('.tiptap').click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create App For Show Stock Price');
  await page.getByText('Build', { exact: true }).click();
  await page.getByText('Plan Mode').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
await expect(page.locator('#root')).toContainText(
  'The agent has identified the tasks needed for your app. If everything looks good, start building to apply these updates',
  { timeout: 120000 } // waits up to 2 minutes
);
  await page.getByRole('button', { name: 'Revise plan' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Add More freatues Abot this App');
  await page.getByRole('group').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.waitForTimeout(20000);

  await page.getByRole('button', { name: 'Build' }).click();

  await expect(page.locator('#root')).toContainText(
  'Version History',
    { timeout: 120000 } // waits up to 2 minutes
);

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });