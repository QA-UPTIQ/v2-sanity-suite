import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { ref } from 'process';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://app-dev.uptiq.dev/');
  await page.evaluate(() => window.moveTo(0, 0));

  // assersion For landing page
  await expect(page.getByText('How to Make It Foundr')).toBeVisible();
// login new User
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagar22222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
    await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#root')).toContainText('Create New App');

  // Create QNA Agent
    await page.getByText('Agent Builder', { exact: true }).click();

    
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('QNA Agent');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.locator('#root')).toContainText('QNA Agent');
  await page.getByRole('button', { name: 'Try Agent' }).click();
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('What is Uses of MCP server?');
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();


  });