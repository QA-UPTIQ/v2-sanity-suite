import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow for deep thinking app generation (5+ minutes)
test.setTimeout(600000);
test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-dev.uptiq.dev');
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

// Navigate to Agent Builder and create a Deep Thinking app
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('group').getByRole('button', { name: 'Rapid' }).click();
  await page.getByRole('paragraph').filter({ hasText: 'Deep Thinking' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a modern Note-Taking Application that allows users to easily create, edit, delete, and organize notes.');
  await page.getByRole('button', { name: 'Send' }).click();

  await page.waitForTimeout(300000); // 5 minutes


  //assertions to verify frontend functionality
  await page.getByRole('tab', { name: 'Artifacts' }).click();
  await expect(page.locator('#root')).toContainText('FRONTEND_PLAN.md');
  await page.getByRole('tab', { name: 'Code' }).click();
  await page.getByRole('button', { name: 'src' }).click();
  await page.getByRole('button', { name: 'main.tsx' }).click();
  await page.getByRole('tab', { name: 'Agents' }).click();
  await page.getByRole('button', { name: 'Version' }).click();
  await page.getByText('Version 1.0.0 (Latest)').click();
  await page.locator('html').click();
  await page.getByRole('button', { name: 'Publish' }).click();
  await page.getByRole('button', { name: 'Publish App' }).click();
  await page.getByText('Publishing App').click();


 });