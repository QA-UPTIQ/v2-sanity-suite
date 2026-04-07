import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-dev.uptiq.dev/login');
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

// 1st Application
  await page.goto('https://builder-dev.uptiq.dev/login');
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('group').getByRole('button', { name: 'Deep Thinking' }).click();
  await page.getByLabel('Deep Thinking').getByText('Rapid').click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create Simple TODO app');
  await page.getByRole('button', { name: 'Send' }).click();
});