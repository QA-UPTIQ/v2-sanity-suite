
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
    await page.goto('https://builder-qa.uptiq.dev/login');
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


  // Create Workspase 

    await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await page.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await page.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`V2.0.24 RAGSanity ${random4}`);
  await page.getByRole('button', { name: 'Create Workspace' }).click();

  await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByText(`V2.0.24 RAGSanity ${random4}`).click();


await page.getByText('RAG', { exact: true }).click();
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
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Charater Chanking' })).toBeVisible();
    // Create Vector Store
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('button', { name: 'Create Vector Store' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking VS');
  await page.getByRole('combobox', { name: 'Select data store' }).click();
  await page.getByRole('option', { name: 'Charater Chanking' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
    await page.waitForTimeout(1000);
  await expect(page.getByText('Charater Chanking VS')).toBeVisible();
    //Create Rag Container
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Create RAG Container' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking RC');
  await page.getByRole('combobox', { name: 'Vector Store*' }).click();
  await page.getByRole('option', { name: 'Charater Chanking VS' }).click();
  await page.getByRole('combobox', { name: 'Generation LLM*' }).click();
  await page.getByRole('option', { name: 'GPT 5.1' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
    //Verify Rag Container
  await expect(page.getByRole('cell', { name: 'Charater Chanking RC' })).toBeVisible();
  await page.getByRole('cell', { name: 'Charater Chanking RC' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'View Chunks' }).click();
  await page.getByRole('button', { name: 'Close' }).click();


  //Create Rag For Recursive Character Splitting

  await page.getByText('RAG', { exact: true }).click();
  await page.getByRole('tab', { name: 'Data Stores' }).click();
  await page.getByRole('button', { name: 'Create Data Store' }).click();
  await page.locator('label').filter({ hasText: 'Upload' }).click();
  const [fileChooser2] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
  ]);
  await fileChooser2.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('combobox', { name: 'Chunking Strategy' }).click();
  await page.getByLabel('Recursive Character Splitting').getByText('Recursive Character Splitting').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Recursive Character Splitting' })).toBeVisible();
  // Create Vector Store
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('button', { name: 'Create Vector Store' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting VS');
    await page.getByRole('combobox', { name: 'Database*' }).click();
  await page.getByRole('option', { name: 'Postgres' }).click();
  await page.getByRole('combobox', { name: 'Select data store' }).click();
  await page.getByRole('option', { name: 'Recursive Character Splitting' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Recursive Character Splitting VS')).toBeVisible();
  //Create Rag Container
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Create RAG Container' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting RC');
  await page.getByRole('combobox', { name: 'Vector Store*' }).click();
  await page.getByRole('option', { name: 'Recursive Character Splitting VS' }).click();
  await page.getByRole('combobox', { name: 'Generation LLM*' }).click();
  await page.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
      await page.waitForTimeout(1000);
  //Verify Rag Container
  await expect(page.getByRole('cell', { name: 'Recursive Character Splitting RC' })).toBeVisible();



// Create Rag For Semantic Chunking

  await page.getByText('RAG', { exact: true }).click();
  await page.getByRole('tab', { name: 'Data Stores' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('button', { name: 'Create Data Store' }).click();
  await page.locator('label').filter({ hasText: 'Upload' }).click();
  const [fileChooser3] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
  ]);
  await fileChooser3.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('combobox', { name: 'Chunking Strategy' }).click();
  await page.getByLabel('Semantic Chunking').getByText('Semantic Chunking').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Semantic Chunking' })).toBeVisible();
  // Create Vector Store
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('button', { name: 'Create Vector Store' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking VS');
    await page.getByRole('combobox', { name: 'Database*' }).click();
  await page.getByRole('option', { name: 'Postgres' }).click();
  await page.getByRole('combobox', { name: 'Select data store' }).click();
  await page.getByRole('option', { name: 'Semantic Chunking' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Semantic Chunking VS')).toBeVisible();
  //Create Rag Container
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Create RAG Container' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking RC');
  await page.getByRole('combobox', { name: 'Vector Store*' }).click();
  await page.getByRole('option', { name: 'Semantic Chunking VS' }).click();
  await page.getByRole('combobox', { name: 'Generation LLM*' }).click();
  await page.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  
  //Verify Rag Container
  await expect(page.getByRole('cell', { name: 'Semantic Chunking RC' })).toBeVisible();
  await page.getByRole('cell', { name: 'Semantic Chunking RC' }).click();
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Close' }).click();



  // Create Rag For Dynamic Chunking

  await page.getByText('RAG', { exact: true }).click();
  await page.getByRole('tab', { name: 'Data Stores' }).click();
  await page.getByRole('button', { name: 'Create Data Store' }).click();
  await page.locator('label').filter({ hasText: 'Upload' }).click();
  const [fileChooser4] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
  ]);
  await fileChooser4.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('combobox', { name: 'Chunking Strategy' }).click();
  await page.getByLabel('Dynamic Chunking').getByText('Dynamic Chunking').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Dynamic Chunking' })).toBeVisible();
  // Create Vector Store
  await page.getByRole('tab', { name: 'Vector Stores' }).click();
  await page.getByRole('button', { name: 'Create Vector Store' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking VS');
    await page.getByRole('combobox', { name: 'Database*' }).click();
  await page.getByRole('option', { name: 'Pinecone' }).click();
  await page.getByRole('combobox', { name: 'Select data store' }).click();
  await page.getByRole('option', { name: 'Dynamic Chunking' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Dynamic Chunking VS')).toBeVisible();
  //Create Rag Container
  await page.getByRole('tab', { name: 'RAG Containers' }).click();
  await page.getByRole('button', { name: 'Create RAG Container' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).click();
  await page.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking RC');
  await page.getByRole('combobox', { name: 'Vector Store*' }).click();
  await page.getByRole('option', { name: 'Dynamic Chunking VS' }).click();
  await page.getByRole('combobox', { name: 'Generation LLM*' }).click();
  await page.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
  await page.getByRole('switch').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
      await page.waitForTimeout(1000);
  //Verify Rag Container
  await expect(page.getByRole('cell', { name: 'Dynamic Chunking RC' })).toBeVisible();
  await page.getByRole('cell', { name: 'Dynamic Chunking RC' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(30000);

    await page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(4) > td:nth-child(7) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1) > svg:nth-child(1)").click();
  await page.getByRole('textbox', { name: 'Enter query' }).click();
  await page.getByRole('textbox', { name: 'Enter query' }).fill('What is Tecnical Skills And project work by sagar sharma?');
  await page.getByRole('button', { name: 'Send' }).click();


    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });