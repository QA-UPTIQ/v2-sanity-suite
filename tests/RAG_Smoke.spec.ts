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


// Create RAG for Character Chanking
await page.locator("//p[@title='RAG']").click();
  await page.getByRole('tab', { name: 'Data Stores' }).click();
  await page.getByRole('button', { name: 'Create Data Store' }).click();
  await page.locator('label').filter({ hasText: 'Upload' }).click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
  ]);
  await fileChooser.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('combobox', { name: 'Chunking Strategy' }).click();
  await page.getByLabel('Character Splitting', { exact: true }).getByText('Character Splitting').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking5');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Charater Chanking5' })).toBeVisible();
    // Create Vector Store
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('button', { name: 'Create Vector Store' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking VS5');
  await page.getByRole('combobox', { name: 'Select data store' }).click();
  await page.getByRole('option', { name: 'Charater Chanking5' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(1000);
  await expect(page.getByText('Charater Chanking VS5')).toBeVisible();
    //Create Rag Container
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Create RAG Container' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking RC5');
  await page.getByRole('combobox', { name: 'Vector Store*' }).click();
  await page.getByRole('option', { name: 'Charater Chanking VS5' }).click();
  await page.getByRole('combobox', { name: 'Generation LLM*' }).click();
  await page.getByRole('option', { name: 'GPT 5.1' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
    //Verify Rag Container
  await expect(page.getByRole('cell', { name: 'Charater Chanking RC5' })).toBeVisible();
  await page.getByRole('cell', { name: 'Charater Chanking RC5' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'View Chunks' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //RAG Test
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
      await page.waitForTimeout(2000);

  await page.locator("//tbody/tr[1]//*[name()='svg']//*[name()='path' and contains(@d,'M5 5a2 2 0')]").first().click();
await page.waitForTimeout(2000);
  await page.getByRole('textbox', { name: 'Enter query' }).click();
  await page.getByRole('textbox', { name: 'Enter query' }).fill('Provide technical Skill of Sagar Sharma from resume');
  await page.getByRole('button', { name: 'Send' }).click();



  });