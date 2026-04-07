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

 // Create Workspase 

    await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await page.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await page.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`V2.0.24 AppSanity ${random4}`);
  await page.getByRole('button', { name: 'Create Workspace' }).click();

  await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByText(`V2.0.24 AppSanity ${random4}`).click();

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
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.waitForTimeout(2000);
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
    await page.waitForTimeout(2000);
  await page.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the user’s input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand. Also send the inputs to the attached agent and display the agents response. Also need one button where, on clicking Send Email, the generated summary should be sent to sagarjadhav61679@gmail.com.');
  await page.waitForTimeout(2000);
  await page.getByRole('group').getByRole('button').filter({ hasText: /^$/ }).click();
  page.locator("//div[normalize-space()='Attach File']").click()
  page.locator("xpath=//p[@class='text-sm font-medium']").click()
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
  ]);
  await fileChooser.setFiles('C:/Users/denzo/Downloads/Summey Proto.pdf');
  await page.getByRole('button', { name: 'Attach (1)' }).click();
  await page.locator("//button[normalize-space()='Send']").click();
  await expect(page.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Logo' }).click();

// 2nd Application EMI Calculator
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('button', { name: 'Brand Guidelines' }).click();
  await page.getByRole('button', { name: 'Advanced Customization' }).click();
  await page.locator('input[name="light.background"]').clear();
  await page.locator('input[name="light.background"]').fill('#c9a6a6');
  await page.getByRole('tab').nth(1).click();
  await page.locator('input[name="dark.background"]').click();
  await page.locator('input[name="dark.background"]').fill('#6b6b9c');
  await page.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a simple EMI calculator app. Include three form fields: Loan Amount, Interest Rate, and Tenure in months. Add a button: Calculate EMI. When pressed send the inputs to the attached agent and display the agents response.');
  await page.locator("//button[normalize-space()='Send']").click();
  await expect(page.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Logo' }).click();

  // 3rd Application Web Search App
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill(' Create a web search app where the user can enter a query, the query is sent to the agent, and the agent’s response is displayed as the output.');
  await page.locator("//button[normalize-space()='Send']").click();
  await expect(page.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Logo' }).click();

  //4th Application Document Uploader
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create an application with the following functionality:\n\nBuild a web application that allows users to upload documents, store them securely in the backend, and view the uploaded documents in a separate tab.');
  await page.locator("//button[normalize-space()='Send']").click();
  await expect(page.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Logo' }).click();


// 5th Application Personal Info and Document Upload
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create app For Get Personal Information And Upload One Document - Address Proof and save in backend Filds Should not mandatory');
  await page.locator("//button[normalize-space()='Send']").click();
  await expect(page.getByRole('button', { name: 'Building your application' })).toBeVisible();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Logo' }).click();

});

