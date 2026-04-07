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
  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

  //Dashboard documentation Link
  const page1Promise = page.waitForEvent('popup');
  await page.getByText('Take a Tour!').click();
  const page1 = await page1Promise;
  //Dashboard User guide link Assertion - https://docs.uptiq.dev/the-canvas-builder-app-first-workflow/the-visual-app-canvas-ui


  //App builder documentation link
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Guide to Build AI Apps' }).click();
  const page2 = await page2Promise;
  // App builder user guide link assertion - https://docs.uptiq.dev/the-canvas-builder-app-first-workflow/the-visual-app-canvas-ui

  //Agent builder documentation link
  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Guide to Build AI Agents' }).click();
  const page3 = await page3Promise;
    //Agent builder user guide link assertion - https://docs.uptiq.dev/the-agent-builder-automation-core/agent-fundamentals-and-architecture

    //Help and documentation link
    await page.getByRole('button', { name: 'Help & Documentation' }).click();
  const page4Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'User Guide' }).click();
  const page4 = await page4Promise;
    //Help and documentation user guide link assertion - https://docs.uptiq.dev/
});

