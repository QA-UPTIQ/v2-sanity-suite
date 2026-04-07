import { test, expect } from '@playwright/test';
import * as fs from 'fs';
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-dev.uptiq.dev/');
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


// create rapid frontend app
  await page.locator("(//p[@title='App Builder'])[1]").click();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill(' Create a web search app where the user can enter a query, the query is sent to the agent, and the agents response is displayed as the output.');
  await page.getByRole('button', { name: 'Send' }).click();
await page.waitForTimeout(180000);
// verify code tab
 await page.getByRole('tab', { name: 'Code' }).click();
 await expect(page.locator('#root')).toContainText('frontend');
 await page.getByRole('button', { name: 'src' }).click();
 await expect(page.locator('#root')).toContainText('main.tsx');

 // open agent and add knowladge documents
 await page.getByRole('tab', { name: 'Agents' }).click();
 const [page2] = await Promise.all([
   page.context().waitForEvent('page'),
   page.getByText('AI Agent').click()
 ]);

 await page.locator("//div[@class='react-flow__node react-flow__node-AddKnowledgeNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await page.waitForTimeout(2000);

  
  // Upload knowledge document
  await page.getByText('Upload Documents', { exact: true }).click();
  await page.setInputFiles('input[type="file"]', 'C:\\Users\\denzo\\Downloads\\Resume Sample.pdf');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Verify the upload was successful
  await page.waitForTimeout(3000);


});