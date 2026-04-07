import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-dev.uptiq.dev/login');
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



  await page.goto('https://builder-dev.uptiq.dev/login');
  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('QNA Agent');
  await page.getByRole('button', { name: 'Send' }).click();

//add knowledge base document
  await page.getByTestId('rf__node-60712ff4-3261-456d-8b6c-8e9142e6b4b7').getByRole('button').filter({ hasText: /^$/ }).click();
  //div[@class='react-flow__node react-flow__node-AddKnowledgeNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']
  await page.getByRole('button', { name: 'Upload Documents Upload new' }).click();
  await page.getByRole('button', { name: 'Click to upload' }).click();
  await page.getByRole('button', { name: 'Click to upload' }).setInputFiles('Data With Image.pdf');
  await page.getByRole('checkbox').nth(1).click();
  await page.getByRole('button', { name: 'Done' }).click();




  

  });