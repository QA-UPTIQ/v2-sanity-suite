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
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
  await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();


// Create Workspase 

    await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await page.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await page.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`V2.0.24 RAGSanity ${random4}`);
  await page.getByRole('button', { name: 'Create Workspace' }).click();

  await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByText(`V2.0.24 RAGSanity ${random4}`).click();

  // assertion to verify workspace creation
  await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();


    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });