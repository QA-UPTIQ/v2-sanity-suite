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


// assersion For landing page
    await expect(page.getByText('AI builds your product.')).toBeVisible();
  await expect(page.getByText('How to Make It Foundr')).toBeVisible();

  // Navigate to Leaderboard
const page3Promise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'Leaderboard' }).click();
  const page3 = await page3Promise;
  await expect(page3.getByRole('heading')).toContainText('National Leaderboard');

  // Navigate to Colleges
  //await page3.getByRole('link', { name: 'Colleges' }).click();
  //await expect(page3.locator('h1')).toContainText('Colleges on Mattr Launchpad');

//navigate to Cohort
await page3.getByRole('link', { name: 'Cohort' }).click();
  await expect(page3.getByRole('main')).toContainText('Launch a working, scalable Productand get warm intros to notable investors— in 7 days');

//navigate to Become an Expert
const page4Promise = page3.waitForEvent('popup');
  await page3.getByRole('link', { name: 'Become an Expert' }).click();
  const page4 = await page4Promise;
  await expect(page4.locator('h1')).toContainText('Become a Certified');

  // naviagte to login page
  await page.goto('https://app-dev.uptiq.dev/');
  await page.evaluate(() => window.moveTo(0, 0));


// login Existing user User
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
    await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');

    await expect(page.locator('#root')).toContainText('Create New App');




// Navigate to lounchpad
  await page.locator('.tiptap').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Explore Foundr Launchpad' }).click();
  const page1 = await page1Promise;
  await page1.goto('https://foundr-launchpad-dev.uptiq.dev/leaderboard');
  await expect(page1.getByRole('heading')).toContainText('National Leaderboard');



  // Navigate to Colleges
  //await page1.getByRole('link', { name: 'Colleges' }).click();
  //await expect(page1.locator('h1')).toContainText('Colleges on Foundr Launchpad');


//navigate to Cohort

  await page1.getByRole('link', { name: 'Cohort' }).click();
  await expect(page1.getByRole('main')).toContainText('Launch a working, scalable Productand get warm intros to notable investors— in 7 days');
  const page2Promise = page1.waitForEvent('popup');

//navigate to Become an Expert
  await page1.getByRole('link', { name: 'Become an Expert' }).click();
  const page2 = await page2Promise;
  await expect(page2.locator('h1')).toContainText('Become a Certified');


});