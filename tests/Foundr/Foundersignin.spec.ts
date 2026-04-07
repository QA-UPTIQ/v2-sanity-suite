
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

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a simple EMI calculator app. Include three form fields: Loan Amount, Interest Rate, and Tenure in months. Add a button: Calculate EMI. When pressed, send the inputs to the attached agent and display the agents response.');
  await page.getByRole('button', { name: 'Build with Foundr' }).click();
  await page.getByRole('button', { name: 'Continue with Email' }).click();
    // NEW USER CREATION EMAIL
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  const uniqueEmail = `sagartest${Date.now()}@mailinator.com`;
  await page.getByRole('textbox', { name: 'Enter your email' }).fill(uniqueEmail);
   await page.getByRole('button', { name: 'Continue with Email' }).click();


  // Go to Mailinator and click on verification link
  const mailinatorPage = await page.context().newPage();
  // Use a longer timeout and a lighter waitUntil to avoid exceeding the default test timeout
  await mailinatorPage.goto(
    `https://www.mailinator.com/v4/public/inboxes.jsp?to=${uniqueEmail.split('@')[0]}`,
    { waitUntil: 'domcontentloaded', timeout: 60000 }
  );

  // Wait for the email row by explicit XPath matching the "From" cell, then click to open
  const emailCell = await mailinatorPage.waitForSelector('xpath=//td[normalize-space()="no-reply@uptiq.ai"]', { timeout: 45000 }).catch(() => null);
  if (!emailCell) {
    await mailinatorPage.close();
    throw new Error('Timed out waiting for the confirmation email (no-reply@uptiq.ai) in Mailinator');
  }
  await emailCell.click();

  // Click on verify email button
  const [newPage] = await Promise.all([
    mailinatorPage.context().waitForEvent('page'),
    (async () => {
      let clicked = false;
      const frames = mailinatorPage.frames();
      for (const f of frames) {
        try {
          await f.locator('text=Verify Email').click({ timeout: 2000 });
          clicked = true;
          break;
        } catch (e) {
          // ignore
        }
      }
      if (!clicked) {
        await mailinatorPage.locator('text=Verify Email').click();
        
      }
    })()
  ]);
  await mailinatorPage.close();

  await newPage.waitForTimeout(4000);

  await newPage.getByLabel('First Name').fill('Sagar');
  await newPage.getByLabel('Last Name').fill('Poul');
  await newPage.getByLabel('Password').fill('Sagar@1522');
  await newPage.getByRole('button', { name: 'Continue' }).click();
  await expect(newPage.getByText('End User License Agreement', { exact: true })).toBeVisible();
  await newPage.getByRole('button', { name: 'Accept & Continue' }).click();

  await newPage.waitForTimeout(3000);
  await newPage.locator("//span[normalize-space()='Send']").click();

});