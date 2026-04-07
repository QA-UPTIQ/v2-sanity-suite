import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-qa.uptiq.dev/login');
  await page.evaluate(() => window.moveTo(0, 0));

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
  await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

// create rapid frontend app
  await page.locator("(//p[@title='App Builder'])[1]").click();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a simple EMI calculator app. Include three form fields: Loan Amount, Interest Rate, and Tenure in months. Add a button: Calculate EMI. When pressed send the inputs to the attached agent and display the agents response.');
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
 await page.getByRole('button', { name: 'Publish', exact: true }).click();
 await page.getByRole('button', { name: 'Publish App' }).click();
});