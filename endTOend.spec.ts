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

  // Wait for transient toast/notification elements to disappear to avoid intercepting clicks
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await page.getByText('S', { exact: true }).click();
  await expect(page.getByRole('menu', { name: 'S' })).toBeVisible();

  await page.getByText('Settings').click();

  await page.getByRole('link', { name: 'Users' }).click();

  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.getByRole('dialog', { name: 'Create User' })).toBeVisible();

  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Sam');
  await page.getByRole('textbox', { name: 'Email*' }).click();
  const uniqueEmail = `sagartest${Date.now()}@mailinator.com`;
  await page.getByRole('textbox', { name: 'Email*' }).fill(uniqueEmail);
  await page.getByRole('combobox', { name: 'Role*' }).click();
  await expect(page.getByRole('listbox', { name: 'Role*' })).toBeVisible();

  await page.getByText('System Admin').click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(3000);

  // Log out from the current session
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await page.getByText('S', { exact: true }).click();
  await page.getByText('Logout').click()

  // Go to Mailinator to get the password
  const mailinatorPage = await page.context().newPage();
  // Use a longer timeout and a lighter waitUntil to avoid exceeding the default test timeout
  await mailinatorPage.goto(
    `https://www.mailinator.com/v4/public/inboxes.jsp?to=${uniqueEmail.split('@')[0]}`,
    { waitUntil: 'domcontentloaded', timeout: 60000 }
  );

  // Wait for the email row by explicit XPath matching the "From" cell, then click to open
  const emailCell = await mailinatorPage.waitForSelector('xpath=//td[normalize-space()="no-reply@uptiq.ai"]', { timeout: 45000 }).catch(() => null);
  if (!emailCell) {
    await mailinatorPage.close();
    throw new Error('Timed out waiting for the confirmation email (no-reply@uptiq.ai) in Mailinator');
  }
  await emailCell.click();

  // After opening the message, try JSON tab first, then RAW tab, then HTML/iframe text.
  let emailText = '';
  try {
    const jsonTab = mailinatorPage.locator('text=JSON');
    if ((await jsonTab.count()) > 0) {
      await jsonTab.first().click({ timeout: 5000 }).catch(() => null);
      const pre = mailinatorPage.locator('pre, code, .json, .raw');
      if ((await pre.count()) > 0) {
        emailText = (await pre.first().innerText({ timeout: 3000 })).trim();
      }
    }
  } catch (e) {
    // ignore
  }

  if (!emailText) {
    try {
      const rawTab = mailinatorPage.locator('text=RAW');
      if ((await rawTab.count()) > 0) {
        await rawTab.first().click({ timeout: 5000 }).catch(() => null);
        const pre = mailinatorPage.locator('pre, code, .raw, .msg-raw');
        if ((await pre.count()) > 0) {
          emailText = (await pre.first().innerText({ timeout: 3000 })).trim();
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!emailText) {
    try {
      emailText = (await mailinatorPage.locator('.email-content').innerText({ timeout: 2000 })).trim();
    } catch (e) {
      const frames = mailinatorPage.frames();
      for (const f of frames) {
        try {
          const bodyText = await f.locator('body').innerText({ timeout: 1000 }).catch(() => '');
          if (bodyText && bodyText.trim()) {
            emailText = bodyText.trim();
            break;
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }

  console.log('\n--- MAILINATOR EMAIL RAW/JSON/HTML START ---');
  console.log(emailText.slice(0, 20000));
  console.log('--- MAILINATOR EMAIL RAW/JSON/HTML END ---\n');

  // Normalize to plain text (strip HTML tags) then extract the password
  const plain = emailText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // Simple extraction: find "New Password:" line and take the token after it
  const lineMatch = plain.match(/New\s*Password\s*[:\u00A0]?\s*([^\r\n<>]+)/i);
  const newUserPassword = lineMatch && lineMatch[1] ? lineMatch[1].trim().split(/\s+/)[0] : '';
  if (!newUserPassword) {
    const debugPath = `mailinator-email-debug-${Date.now()}.txt`;
    try { fs.writeFileSync(debugPath, emailText || await mailinatorPage.content(), { encoding: 'utf8' }); } catch(e) {}
    await mailinatorPage.close();
    throw new Error('Password not found in Mailinator message; raw content saved to ' + debugPath);
  }
  console.log('Extracted password:', newUserPassword);
  await mailinatorPage.close();

  // Fill in the password and log in
  const newPage = await page.context().newPage();
  await newPage.goto('https://builder-dev.uptiq.dev/login');
  await newPage.getByRole('button', { name: 'Continue with Email' }).click();
  await newPage.getByRole('textbox', { name: 'Enter your email' }).fill(uniqueEmail);
  await newPage.getByRole('button', { name: 'Continue with Email' }).click();
  await expect(newPage.getByRole('textbox', { name: 'Email Id' })).toBeVisible();
  await newPage.getByRole('textbox', { name: 'Password' }).fill(newUserPassword);
  await newPage.waitForTimeout(3000);
  await newPage.getByRole('button', { name: 'Continue' }).click();
  await newPage.waitForTimeout(3000);

  await expect(newPage.getByRole('button', { name: 'Logout' })).toBeVisible();

  await newPage.getByText('License Agreement', { exact: true }).click();
  await newPage.getByRole('button', { name: 'Accept & Continue' }).click();
  await newPage.getByRole('textbox').fill('');
  await newPage.getByRole('button', { name: 'Skip' }).click();
  await newPage.getByRole('textbox', { name: 'Old Password' }).click();
  await newPage.getByRole('textbox', { name: 'Old Password' }).fill(newUserPassword);
  await newPage.getByRole('textbox', { name: 'New Password' }).click();
  await newPage.getByRole('textbox', { name: 'New Password' }).fill('Sagar@1522');
  await newPage.getByRole('textbox', { name: 'Confirm Password' }).click();
  await newPage.getByRole('textbox', { name: 'Confirm Password' }).fill('Sagar@1522');
  await newPage.getByRole('button', { name: 'Show password' }).nth(2).click();
  await expect(newPage.getByRole('button', { name: 'Hide password' })).toBeVisible();

  await newPage.getByText('Old PasswordShow passwordNew').click();
  await newPage.getByRole('button', { name: 'Show password' }).first().click();
  await newPage.getByRole('button', { name: 'Show password' }).click();
  await newPage.getByRole('button', { name: 'Update Password' }).click();
  await newPage.goto('https://builder-dev.uptiq.dev/dashboard');
  await expect(newPage.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();






   // Create Workspase 

    await newPage.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await newPage.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await newPage.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await newPage.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`V2.0.24 AppSanity ${random4}`);
  await newPage.getByRole('button', { name: 'Create Workspace' }).click();

  await newPage.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await newPage.getByText(`V2.0.24 AppSanity ${random4}`).click();

  // Wait for transient toast/notification elements to disappear to avoid intercepting clicks
  //await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
 //await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  //const [fileChooser] = await Promise.all([
   // page.waitForEvent('filechooser'),
  //  page.locator("xpath=//p[@class='text-sm font-medium']").click()
 // ]);
//await fileChooser.setFiles('C:\Users\denzo\Downloads\Summey Proto.pdf');

//await page.getByRole('button', { name: 'Attach (1)' }).click();
//await page.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the user’s input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand. Also send the inputs to the attached agent and display the agent’s response. Also need one button where, on clicking Send Email, the generated summary should be sent to sagarjadhav61679@gmail.com.');
//await page.locator("//button[normalize-space()='Send']").click();








// 1st Application Summery genrator
  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
  await newPage.waitForTimeout(2000);
    await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
    await newPage.waitForTimeout(2000);
  await newPage.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the user’s input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand. Also send the inputs to the attached agent and display the agents response. Also need one button where, on clicking Send Email, the generated summary should be sent to sagarjadhav61679@gmail.com.');
  await newPage.waitForTimeout(2000);
  await newPage.locator("//button[normalize-space()='Send']").click();
  await expect(newPage.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Logo' }).click();

// 2nd Application EMI Calculator
  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
    await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('Create a simple EMI calculator app. Include three form fields: Loan Amount, Interest Rate, and Tenure in months. Add a button: Calculate EMI. When pressed send the inputs to the attached agent and display the agents response.');
  await newPage.locator("//button[normalize-space()='Send']").click();
  await expect(newPage.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Logo' }).click();

  // 3rd Application Web Search App
  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
    await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill(' Create a web search app where the user can enter a query, the query is sent to the agent, and the agent’s response is displayed as the output.');
  await newPage.locator("//button[normalize-space()='Send']").click();
  await expect(newPage.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Logo' }).click();

  //4th Application Document Uploader
  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
    await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('Create an application with the following functionality:\n\nBuild a web application that allows users to upload documents, store them securely in the backend, and view the uploaded documents in a separate tab.');
  await newPage.locator("//button[normalize-space()='Send']").click();
  await expect(newPage.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Logo' }).click();


// 5th Application Personal Info and Document Upload
  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
    await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('Create a form with Username and Document Name fields, along with one Document Upload field. The user should also be able to view the uploaded document along with the Username and Document Name.');
  await newPage.locator("//button[normalize-space()='Send']").click();
  await expect(newPage.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await newPage.waitForTimeout(2000);
  await newPage.getByRole('link', { name: 'Logo' }).click();







  // Create RAG for Character Chanking
    await newPage.getByRole('link', { name: 'RAG RAG Beta' }).click();
    await newPage.getByRole('tab', { name: 'Data Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Data Store' }).click();
    await newPage.locator('label').filter({ hasText: 'Upload' }).click();
    const [fileChooserRag] = await Promise.all([
      newPage.waitForEvent('filechooser'),
      newPage.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
    ]);
    await fileChooserRag.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
    await newPage.getByRole('button', { name: 'Upload' }).click();
    await newPage.getByRole('button').nth(5).click();
    await newPage.getByRole('combobox', { name: 'Chunking Strategy' }).click();
    await newPage.getByLabel('Character Splitting', { exact: true }).getByText('Character Splitting').click();
    await newPage.getByRole('button', { name: 'Save' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking');
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByRole('cell', { name: 'Charater Chanking' })).toBeVisible();
      // Create Vector Store
    await newPage.getByRole('tab', { name: 'Vector Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Vector Store' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking VS');
    await newPage.getByRole('combobox', { name: 'Select data store' }).click();
    await newPage.getByRole('option', { name: 'Charater Chanking' }).click();
    await newPage.getByRole('button', { name: 'Create' }).click();
      await newPage.waitForTimeout(1000);
    await expect(newPage.getByText('Charater Chanking VS')).toBeVisible();
      //Create Rag Container
    await newPage.getByRole('tab', { name: 'RAG Containers' }).click();
    await newPage.getByRole('button', { name: 'Create RAG Container' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Charater Chanking RC');
    await newPage.getByRole('combobox', { name: 'Vector Store*' }).click();
    await newPage.getByRole('option', { name: 'Charater Chanking VS' }).click();
    await newPage.getByRole('combobox', { name: 'Generation LLM*' }).click();
    await newPage.getByRole('option', { name: 'GPT 5.1' }).click();
    await newPage.getByRole('switch').click();
    await newPage.getByRole('button', { name: 'Create', exact: true }).click();
      //Verify Rag Container
    await expect(newPage.getByRole('cell', { name: 'Charater Chanking RC' })).toBeVisible();
    await newPage.getByRole('cell', { name: 'Charater Chanking RC' }).click();
    await newPage.getByRole('button').filter({ hasText: /^$/ }).click();
    await newPage.getByRole('button', { name: 'View Chunks' }).click();
    await newPage.getByRole('button', { name: 'Close' }).click();
  
  
    //Create Rag For Recursive Character Splitting
  
    await newPage.getByRole('link', { name: 'RAG RAG Beta' }).click();
    await newPage.getByRole('tab', { name: 'Data Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Data Store' }).click();
    await newPage.locator('label').filter({ hasText: 'Upload' }).click();
    const [fileChooser2] = await Promise.all([
      newPage.waitForEvent('filechooser'),
      newPage.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
    ]);
    await fileChooser2.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
    await newPage.getByRole('button', { name: 'Upload' }).click();
    await newPage.getByRole('button').nth(5).click();
    await newPage.getByRole('combobox', { name: 'Chunking Strategy' }).click();
    await newPage.getByLabel('Recursive Character Splitting').getByText('Recursive Character Splitting').click();
    await newPage.getByRole('button', { name: 'Save' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting');
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByRole('cell', { name: 'Recursive Character Splitting' })).toBeVisible();
    // Create Vector Store
    await newPage.getByRole('tab', { name: 'Vector Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Vector Store' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting VS');
      await newPage.getByRole('combobox', { name: 'Database*' }).click();
    await newPage.getByRole('option', { name: 'Postgres' }).click();
    await newPage.getByRole('combobox', { name: 'Select data store' }).click();
    await newPage.getByRole('option', { name: 'Recursive Character Splitting' }).click();
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByText('Recursive Character Splitting VS')).toBeVisible();
    //Create Rag Container
    await newPage.getByRole('tab', { name: 'RAG Containers' }).click();
    await newPage.getByRole('button', { name: 'Create RAG Container' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Recursive Character Splitting RC');
    await newPage.getByRole('combobox', { name: 'Vector Store*' }).click();
    await newPage.getByRole('option', { name: 'Recursive Character Splitting VS' }).click();
    await newPage.getByRole('combobox', { name: 'Generation LLM*' }).click();
    await newPage.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
    await newPage.getByRole('switch').click();
    await newPage.getByRole('button', { name: 'Create', exact: true }).click();
        await newPage.waitForTimeout(1000);
    //Verify Rag Container
    await expect(newPage.getByRole('cell', { name: 'Recursive Character Splitting RC' })).toBeVisible();
  
  
  
  // Create Rag For Semantic Chunking
  
    await newPage.getByRole('link', { name: 'RAG RAG Beta' }).click();
    await newPage.getByRole('tab', { name: 'Data Stores' }).click();
    await newPage.waitForTimeout(2000);
    await newPage.getByRole('button', { name: 'Create Data Store' }).click();
    await newPage.locator('label').filter({ hasText: 'Upload' }).click();
    const [fileChooser3] = await Promise.all([
      newPage.waitForEvent('filechooser'),
      newPage.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
    ]);
    await fileChooser3.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
    await newPage.getByRole('button', { name: 'Upload' }).click();
    await newPage.getByRole('button').nth(5).click();
    await newPage.getByRole('combobox', { name: 'Chunking Strategy' }).click();
    await newPage.getByLabel('Semantic Chunking').getByText('Semantic Chunking').click();
    await newPage.getByRole('button', { name: 'Save' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking');
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByRole('cell', { name: 'Semantic Chunking' })).toBeVisible();
    // Create Vector Store
    await newPage.getByRole('tab', { name: 'Vector Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Vector Store' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking VS');
      await newPage.getByRole('combobox', { name: 'Database*' }).click();
    await newPage.getByRole('option', { name: 'Postgres' }).click();
    await newPage.getByRole('combobox', { name: 'Select data store' }).click();
    await newPage.getByRole('option', { name: 'Semantic Chunking' }).click();
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByText('Semantic Chunking VS')).toBeVisible();
    //Create Rag Container
    await newPage.getByRole('tab', { name: 'RAG Containers' }).click();
    await newPage.getByRole('button', { name: 'Create RAG Container' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Semantic Chunking RC');
    await newPage.getByRole('combobox', { name: 'Vector Store*' }).click();
    await newPage.getByRole('option', { name: 'Semantic Chunking VS' }).click();
    await newPage.getByRole('combobox', { name: 'Generation LLM*' }).click();
    await newPage.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
    await newPage.getByRole('switch').click();
    await newPage.getByRole('button', { name: 'Create', exact: true }).click();
    
    //Verify Rag Container
    await expect(newPage.getByRole('cell', { name: 'Semantic Chunking RC' })).toBeVisible();
    await newPage.getByRole('cell', { name: 'Semantic Chunking RC' }).click();
    await newPage.getByRole('tab', { name: 'Vector Stores' }).click();
    await newPage.getByRole('tab', { name: 'RAG Containers' }).click();
    await newPage.getByRole('button', { name: 'Close' }).click();
  
  
  
    // Create Rag For Dynamic Chunking
  
    await newPage.getByRole('link', { name: 'RAG RAG Beta' }).click();
    await newPage.getByRole('tab', { name: 'Data Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Data Store' }).click();
    await newPage.locator('label').filter({ hasText: 'Upload' }).click();
    const [fileChooser4] = await Promise.all([
      newPage.waitForEvent('filechooser'),
      newPage.locator('div').filter({ hasText: /^Drag and drop files here, or click to select files$/ }).click()
    ]);
    await fileChooser4.setFiles('C:/Users/denzo/Downloads/Resume Sample.pdf');
    await newPage.getByRole('button', { name: 'Upload' }).click();
    await newPage.getByRole('button').nth(5).click();
    await newPage.getByRole('combobox', { name: 'Chunking Strategy' }).click();
    await newPage.getByLabel('Dynamic Chunking').getByText('Dynamic Chunking').click();
    await newPage.getByRole('button', { name: 'Save' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking');
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByRole('cell', { name: 'Dynamic Chunking' })).toBeVisible();
    // Create Vector Store
    await newPage.getByRole('tab', { name: 'Vector Stores' }).click();
    await newPage.getByRole('button', { name: 'Create Vector Store' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking VS');
      await newPage.getByRole('combobox', { name: 'Database*' }).click();
    await newPage.getByRole('option', { name: 'Pinecone' }).click();
    await newPage.getByRole('combobox', { name: 'Select data store' }).click();
    await newPage.getByRole('option', { name: 'Dynamic Chunking' }).click();
    await newPage.getByRole('button', { name: 'Create' }).click();
    await expect(newPage.getByText('Dynamic Chunking VS')).toBeVisible();
    //Create Rag Container
    await newPage.getByRole('tab', { name: 'RAG Containers' }).click();
    await newPage.getByRole('button', { name: 'Create RAG Container' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).click();
    await newPage.getByRole('textbox', { name: 'Name*' }).fill('Dynamic Chunking RC');
    await newPage.getByRole('combobox', { name: 'Vector Store*' }).click();
    await newPage.getByRole('option', { name: 'Dynamic Chunking VS' }).click();
    await newPage.getByRole('combobox', { name: 'Generation LLM*' }).click();
    await newPage.getByRole('option', { name: 'GPT 4.1 mini (Azure)' }).click();
    await newPage.getByRole('switch').click();
    await newPage.getByRole('button', { name: 'Create', exact: true }).click();
        await newPage.waitForTimeout(1000);
    //Verify Rag Container
    await expect(newPage.getByRole('cell', { name: 'Dynamic Chunking RC' })).toBeVisible();
    await newPage.getByRole('cell', { name: 'Dynamic Chunking RC' }).click();
    await newPage.getByRole('button', { name: 'Close' }).click();
      await newPage.waitForTimeout(3000);



// Create agent withot knowledge base

  await newPage.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('Create QNA Agent.');
  await newPage.getByRole('button', { name: 'Send' }).click();
  await expect(newPage.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  await newPage.getByRole('link', { name: 'Logo' }).click();


  // Create agent with knowledge base
  await newPage.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('You are a Question & Answer (QnA) Agent designed to answer user queries strictly based on the provided knowledge data.');
  await newPage.getByRole('button', { name: 'Send' }).click();
  await expect(newPage.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  await newPage.getByRole('link', { name: 'Logo' }).click();


  // Tool Call Agent 
  await newPage.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('Create Agent For Send Email.');
  await newPage.getByRole('button', { name: 'Send' }).click();
  await expect(newPage.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  //connect MCP Server Gmail
  await newPage.getByTestId('rf__node-03f2c4a2-5730-4ee3-a7fa-962f201fc392').getByRole('button').filter({ hasText: /^$/ }).click();
  await newPage.getByText('MCP Server', { exact: true }).click();
  await newPage.getByRole('textbox', { name: 'Connection Name*' }).click();
  await newPage.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
  await newPage.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
  await newPage.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill('https://backend.composio.dev/v3/mcp/1d86bff6-8e8b-4f35-b304-39335cd20414/mcp?user_id=pg-test-55d0dd53-ae9a-4fbd-89ca-5421cf695914');
  await newPage.getByRole('button', { name: 'Next' }).click();
  await newPage.getByRole('link', { name: 'Logo' }).click();


    // Knowledge as skill agent
  await newPage.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await newPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await newPage.locator('.tiptap').fill('You are a Question & Answer (QnA) Agent designed to answer user queries strictly based on the provided data Which is Comming From RAG Vector Store as skill.');
  await newPage.getByRole('button', { name: 'Send' }).click();
  await expect(newPage.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  await newPage.getByRole('link', { name: 'Logo' }).click();







  });

