import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
    await page.goto('https://mattr-qa.uptiq.dev/');
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
    await page.waitForTimeout(3000);

  // ckickm on App Builder link in the sidebar
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();

// App creation Action Buttons
  await page.locator(".lucide.lucide-plus").click();
  await page.getByRole('menuitem', { name: 'Import App Package' }).click();
  //  await expect(page.getByRole('heading')).toContainText('Import App Package');
     await page.locator("//button[@class='inline-flex items-center justify-center rounded-md text-base transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer border border-input bg-background text-accent-foreground shadow-xs hover:bg-accent hover:text-accent-foreground p-2 size-8 [&>svg]:size-4 shrink-0']").click();
       await page.waitForTimeout(2000);

  // open brand guidelines and verify it opens the correct page
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Advanced Customization' }).click();
  await page.getByRole('tab').nth(1).click();
  await expect(page.locator('p:has-text("Set Your Branding")')).toBeVisible();
  await page.getByRole('button').nth(2).click();

//click on Documentation and other links in sidebar and verify they open correct pages
  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Guide to Build AI Apps' }).click();
  const page3 = await page3Promise;
  await expect(page3.getByRole('heading')).toContainText('The Visual App Canvas (UI)');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });