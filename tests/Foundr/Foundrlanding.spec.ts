import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { ref } from 'process';
// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);
test('login flow (email)', async ({ page }) => {
  await page.goto('https://app-dev.uptiq.dev/');
  await page.evaluate(() => window.moveTo(0, 0));
  // assersion For landing page
    await expect(page.getByText('AI builds your product.')).toBeVisible();
  await expect(page.getByText('How to Make It Foundr')).toBeVisible();


  
  });