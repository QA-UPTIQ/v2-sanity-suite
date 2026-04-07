import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
    await page.goto('https://app-qa.uptiq.dev/');
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
    await page.waitForTimeout(9000);


// Click until Job Board is found
let jobBoardFound = false;
while (!jobBoardFound) {
    try {
        await page.locator("//body/div[@id='root']/div[@class='flex w-full h-full overflow-hidden bg-sidebar']/div[@class='flex flex-col h-full flex-1 overflow-hidden']/div[@class='flex-1 w-full overflow-hidden']/div[@class='flex flex-col h-full w-full overflow-y-auto p-2 gap-2 @container']/div[@class='rounded-xl bg-background relative w-full flex shrink-0 flex-col items-center overflow-hidden']/div[@class='flex flex-col gap-8 justify-center items-center w-full max-w-[800px] md:py-15 px-2 md:px-5 z-10']/div[@class='w-full flex flex-col transition-all']/div[@class='w-auto max-w-full pt-4 hidden md:flex items-center justify-center mx-auto gap-2 z-0']/button[2]//*[name()='svg']").click();
        await page.waitForTimeout(500);
        jobBoardFound = await page.getByRole('button', { name: '💼 Job Board' }).isVisible();
    } catch (error) {
        break;
    }
}
  await page.getByRole('button', { name: '💼 Job Board' }).click();
  await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(180000);    
// Verify App Creation With APIs


    // Open App Code and Verify
    await page.getByRole('tab', { name: 'Code' }).click();
  await page.getByRole('button', { name: 'src' }).click();
  await page.getByRole('button', { name: 'index.css' }).click();
  //Open app Agent Section and Verify
  await page.getByRole('tab', { name: 'Agents' }).click();

  // Click on Version and verify dropdown options
  await page.locator('button:has-text("Version 1.0.0")')
  await page.locator('html').click();

  //app configuration options verification
  await page.getByRole('button', { name: 'App Config' }).click();
  await page.getByText('Database').click();
  await page.getByText('Cloud Storage').click();
  await page.getByText('LLM Providers').click();
  await page.getByText('Authentication').click();
  await page.getByText('Payment').click();
  await page.getByText('Email Notifications').click();
  await page.getByText('Domains').click();
  await page.getByText('Brand Guidelines').click();
  await page.getByText('Messaging').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();



    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });