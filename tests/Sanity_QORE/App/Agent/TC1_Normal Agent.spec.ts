import { test, expect } from '@playwright/test';
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {    
  await page.goto('https://builder-qa.uptiq.dev/');
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

  // Create normal Agent

  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('You are a general-purpose intelligent assistant.Analyze user requests carefully, break them into steps, and provide structured, well-reasoned answers.If a task requires multiple actions, plan them before responding.');
  await page.getByRole('button', { name: 'Send' }).click();

  // Try Agent
  await page.getByRole('button', { name: 'Try Agent' }).click();
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();

  await page.locator('.tiptap').fill('Plan a 7-day learning roadmap for Playwright with daily goals.');
await page.waitForTimeout(3000);
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
   await page.waitForTimeout(9000);
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

  });