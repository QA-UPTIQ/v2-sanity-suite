import { test, expect } from '@playwright/test';
import * as fs from 'fs';

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

  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('create send gmail agent');
  await page.getByRole('button', { name: 'Send' }).click();
    await page.waitForTimeout(30000);

 
// Edit name of Send Email Agent and add skill to it

//   await page.locator("//button[@id='radix-:r2:']//*[name()='svg']").click();
//   await page.getByRole('menuitem', { name: 'Rename Agent' }).click();
// await page.getByRole('textbox').clear();
// await page.getByRole('textbox').fill('Summery Agent');
//   await page.getByRole('textbox').press('Enter');
//   await page.getByRole('link', { name: 'Logo' }).click();


  await page.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await page.getByText('MCP Server', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill(process.env.MCP_URL || 'MCP_SERVER_URL_HERE');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox').first().click();
  await page.getByText('Allow Unsupervised').click();
  await page.getByRole('button', { name: 'Create Connection' }).click();
  await page.getByRole('link', { name: 'Logo' }).click();

  });
