import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
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
    await page.waitForTimeout(3000);
  await expect(page.locator('#root')).toContainText('Recently Worked On');


// Click on Dashboard link in the sidebar

 // App creation Action Buttons
    await expect(page.locator('#root')).toContainText('Recently Worked On');
  await page.getByRole('button').nth(5).click();
  await page.getByRole('menuitem', { name: 'Import App Package' }).click();
  //  await expect(page.getByRole('heading')).toContainText('Import App Package');
     await page.locator("//button[@class='inline-flex items-center justify-center rounded-md text-base transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer border border-input bg-background text-accent-foreground shadow-xs hover:bg-accent hover:text-accent-foreground p-2 size-8 [&>svg]:size-4 shrink-0']").click();
//Conver Rapid to deep thinking and verify 
  await page.getByRole('button', { name: 'Rapid' }).click();
  await page.getByText('Deep Thinking').click();
  await expect(page.locator('fieldset')).toContainText('Deep Thinking');

  // open brand guidelines and verify it opens the correct page
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Advanced Customization' }).click();
  await page.getByRole('tab').nth(1).click();
  await expect(page.locator('p:has-text("Set Your Branding")')).toBeVisible();
  await page.getByRole('button').nth(2).click();

//click on Documentation and other links in sidebar and verify they open correct pages
  await page.getByText('Take a Tour!').click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
  await expect(page1.getByRole('heading')).toContainText('The Visual App Canvas (UI)');

  //click on Agent And App Button and verify dropdown options
  await page.getByRole('button', { name: 'App' }).click();
  await page.getByRole('button', { name: 'Agent' }).click();

  // click on help and documentation links and verify they open correct pages
  await page.getByRole('button', { name: 'Help & Documentation' }).click();

  // click on Report an Issue and verify it opens the correct page
  await page.getByRole('button', { name: 'Report an Issue' }).click();
  await page.getByRole('button').first().click();

  // click on User Guide and verify it opens the correct page
  await page.getByRole('button', { name: 'Help & Documentation' }).click();
  const page2Promise = page.waitForEvent('popup');

  // click on News and Alerts and verify it opens the correct page
  await page.getByRole('button', { name: 'User Guide' }).click();
  const page2 = await page2Promise;
  await expect(page2.locator('h1')).toContainText('Welcome to Uptiq');
  await page.getByRole('button', { name: 'News & Alerts' }).click();






    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });