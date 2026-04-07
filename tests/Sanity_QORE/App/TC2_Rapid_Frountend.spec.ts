import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);
test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-dev.uptiq.dev');
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


  await page.getByText('App Builder', { exact: true }).click();

// Create Rapid app
  await page.waitForTimeout(2000);
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.waitForTimeout(1000);
  await page.locator('.tiptap').fill('Create Simple TODO Application');
  await page.locator(".lucide.lucide-arrow-up").click();







});