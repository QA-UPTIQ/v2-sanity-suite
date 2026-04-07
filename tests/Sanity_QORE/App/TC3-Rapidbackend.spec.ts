import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ browser }) => {
  const context = await browser.newContext();

  const page = await context.newPage();
  await page.goto('https://builder-dev.uptiq.dev/');
  await page.evaluate(() => window.moveTo(0, 0));

  // login steps
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await expect(page.getByRole('textbox', { name: 'Email Id' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  // create rapid backend app
  await page.locator("(//p[@title='App Builder'])[1]").click();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a form with Username and Document Name fields, along with one Document Upload field. The user should also be able to view the uploaded document along with the Username and Document Name.');
  await page.getByRole('button', { name: 'Send' }).click();
await page.waitForTimeout(180000);
// verify code tab
 await page.getByRole('tab', { name: 'Code' }).click();
 await expect(page.locator('#root')).toContainText('frontend');
 await page.getByRole('button', { name: 'src' }).click();
 await expect(page.locator('#root')).toContainText('main.tsx');
 // verify version and publish
 await page.getByRole('button', { name: 'Version' }).click();
 await page.getByText('Version 1.0.0 (Latest)').click();
 await page.locator('html').click();

// Attach Backend and Publish vweify config section 

  await page.getByRole('button', { name: 'App Config' }).click();
  await page.getByText('Database').click();
  await page.getByText('Cloud Storage').click();
  await page.getByText('Domains').click();
  await page.getByText('Brand Guidelines').click();

  // attach database
  await page.getByText('Database').click();
  await page.getByRole('button', { name: 'Connect' }).click();
  await page.getByText('QA Test').click();
  await page.getByRole('button', { name: 'Connect' }).click();
    await page.waitForTimeout(60000);
   await page.getByRole('button').first().click();

   // publish app

     await page.getByRole('button', { name: 'Publish', exact: true }).click();
      await page.getByRole('button', { name: 'Publish App' }).click();
  await page.getByRole('button', { name: 'Connect to Supabase' }).click();
  await page.getByText('QA Test').click();
  await page.getByRole('button', { name: 'Connect' }).click();
  await page.getByRole('button', { name: 'AWS S3', exact: true }).click();
  await page.getByText('GCP Cloud Storage').click();
  await page.getByRole('button', { name: 'Connect to GCP Cloud Storage' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Publish' }).click();

});