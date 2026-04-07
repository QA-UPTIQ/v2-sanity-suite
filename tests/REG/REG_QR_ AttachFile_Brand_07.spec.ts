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
 

    // Create Appp With Select Chip And Verify App Creation
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
// Create Rapid app
  await page.waitForTimeout(2000);
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
    await page.waitForTimeout(2000);
  await page.locator('.tiptap').fill('Create the app as per the description provided in the PRD.');
  await page.waitForTimeout(2000);
    await page.getByRole('button').nth(5).click();

 // await page.getByRole('group').getByRole('button').filter({ hasText: /^$/ }).click();
  page.locator("//div[normalize-space()='Attach File']").click()
  // page.locator("xpath=//p[@class='text-sm font-medium']").click()
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
  ]);
  await fileChooser.setFiles('C:\\Users\\denzo\\Downloads\\Ecommerce_PRD_Application_Design.pdf');
  await page.getByRole('button', { name: 'Attach (1)' }).click();
  await page.locator("//button[normalize-space()='Send']").click();

  await page.waitForTimeout(270000); 
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

  //

      // brand guidelines apply
  await page.getByText('Brand Guidelines').click();
  await page.getByRole('button', { name: 'Advanced Customization' }).click();
  await page.locator('input[name="light.background"]').clear();
  await page.locator('input[name="light.background"]').fill('#c9a6a6');
  await page.getByRole('tab').nth(1).click();
  await page.locator('input[name="dark.background"]').click();
  await page.locator('input[name="dark.background"]').fill('#6b6b9c');
  await page.getByRole('button', { name: 'Apply' }).click();




  
  await page.getByRole('button').filter({ hasText: /^$/ }).click();

  



    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });