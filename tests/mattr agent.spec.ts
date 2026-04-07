import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { ref } from 'process';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://mattr-dev.uptiq.dev');
  await page.evaluate(() => window.moveTo(0, 0));

  // assersion For landing page
    await expect(page.getByText('AI builds your product.')).toBeVisible();
  await expect(page.getByText('How to Make It Mattr')).toBeVisible();
// login new User
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagar2222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.MATTR_PASSWORD || 'PASSWORD_HERE');
    await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#root')).toContainText('Create New App');
 
  
});