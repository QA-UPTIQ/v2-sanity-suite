
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



// login new User
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


  // Navigate to Security & Monitoring
  await page.getByRole('link', { name: 'Security & Monitoring' }).click();
  await expect(page.locator('thead')).toContainText('Agent Name');
  await page.getByRole('tab', { name: 'Skill Executions' }).click();
  await expect(page.locator('thead')).toContainText('Skill');
  await page.getByRole('tab', { name: 'Guardrails' }).click();
  await page.getByRole('tab', { name: 'LLM Host Status' }).click();
  await expect(page.locator('thead')).toContainText('Healthy Models');
});