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
  await newPage.goto('https://builder-qa.uptiq.dev/login');
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
  await newPage.goto('https://builder-qa.uptiq.dev/dashboard');
  await expect(newPage.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

  await newPage.getByRole('link', { name: 'App Builder App Builder' }).click();
  await expect(newPage.getByRole('img', { name: 'app-builder' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await expect(newPage.getByRole('button', { name: 'Cash Forecaster' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Skills Library Skills Library' }).click();
  await expect(newPage.getByRole('button', { name: 'Create custom skill' })).toBeVisible();

  await newPage.getByRole('link', { name: 'RAG RAG' }).click();

  await newPage.getByRole('link', { name: 'Model Hub' }).click();
  await expect(newPage.getByRole('button', { name: 'Fine Tune' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Security & Monitoring' }).click();

  await newPage.getByRole('link', { name: 'Config and Utils' }).click();
  await expect(newPage.getByRole('row', { name: 'Name Created At Actions' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Connections' }).click();
  await expect(newPage.getByRole('button', { name: 'Return' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Insights' }).click();

  await newPage.getByRole('button', { name: 'Marketplace' }).click();
  await expect(newPage.getByRole('button', { name: 'Return' })).toBeVisible();

  await newPage.getByRole('button', { name: 'News & Alerts' }).click();

  // Create Workspase 

    await newPage.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await newPage.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await newPage.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await newPage.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`Test With ${random4}`);
  await newPage.getByRole('button', { name: 'Create Workspace' }).click();

  await newPage.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await newPage.getByText(`Test With ${random4}`).click();

  // Genrate App 

const appBuilderPage = await page.context().newPage();
await appBuilderPage.goto('https://builder-qa.uptiq.dev/app-builder');
await appBuilderPage.locator("xpath=//p[normalize-space()='App Builder']").click();
await expect(appBuilderPage.locator("xpath=//p[@class='text-xl font-semibold']")).toBeVisible();

await appBuilderPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();
await appBuilderPage.getByRole('button', { name: 'Add' }).click();
await expect(appBuilderPage.getByRole('menu', { name: 'Add' })).toBeVisible();
await appBuilderPage.locator("//div[normalize-space()='Attach File']").click();


// trigger file chooser by clicking the upload paragraph and supply the local file
const [fileChooser] = await Promise.all([
    appBuilderPage.waitForEvent('filechooser'),
    appBuilderPage.locator("xpath=//p[@class='text-sm font-medium']").click()
]);
await fileChooser.setFiles('C:\\Users\\denzo\\Downloads\\Summey Proto.pdf');

await appBuilderPage.getByRole('button', { name: 'Attach (1)' }).click();
await appBuilderPage.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the user’s input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand.');
await appBuilderPage.locator("//button[normalize-space()='Send']").click();

// inside app builder dashboard
  await appBuilderPage.getByRole('tab', { name: 'Preview' }).click();
  await appBuilderPage.getByRole('tab', { name: 'Agents' }).click();
  await appBuilderPage.getByRole('tab', { name: 'Code' }).click();
  await appBuilderPage.getByRole('button', { name: 'Version History' }).click();
  await expect(appBuilderPage.getByRole('menu', { name: 'Version History' })).toBeVisible();

  await appBuilderPage.locator('html').click();

  await appBuilderPage.getByRole('button', { name: 'App Config' }).click();
  await expect(appBuilderPage.getByRole('textbox', { name: 'App Name*' })).toBeVisible();

  await appBuilderPage.getByText('Database').click();
  await expect(appBuilderPage.getByRole('button', { name: 'Connect' }).first()).toBeVisible();

  await appBuilderPage.getByText('Cloud Storage').click();
  await expect(appBuilderPage.getByRole('button', { name: 'Connected' })).toBeVisible();

  await appBuilderPage.getByText('Credentials').click();
  await appBuilderPage.getByText('Domains').click();
  await expect(appBuilderPage.getByRole('heading', { name: 'Connected Domain' })).toBeVisible();
  await appBuilderPage.getByText('Brand Guidelines').click();
  await expect(appBuilderPage.getByRole('button', { name: 'Reset Changes' })).toBeVisible();

await appBuilderPage.locator("xpath=//button[normalize-space()='Apply']").click();
await appBuilderPage.locator("//img[@alt='Logo']").click();

// Agent Builder
const agentBuilderPage = await page.context().newPage();
await agentBuilderPage.goto('https://builder-qa.uptiq.dev/agent-builder', { waitUntil: 'domcontentloaded' });
await agentBuilderPage.locator("//p[normalize-space()='Agent Builder']").click();
await expect(agentBuilderPage.locator("xpath=//p[@class='text-xl font-semibold']")).toBeVisible();
await agentBuilderPage.getByRole('paragraph').filter({ hasText: /^$/ }).click();

  await agentBuilderPage.locator('.tiptap').fill('You are an Email Sending Agent. Your role is to receive the recipient’s email address, subject, and message body from the app, validate them, and send the email using the platform’s email-sending service');
  await agentBuilderPage.getByRole('button', { name: 'Send' }).click();
  


  await agentBuilderPage.locator("//div[@class='react-flow__node react-flow__node-AddKnowledgeNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await expect(agentBuilderPage.getByRole('button', { name: 'Lending', exact: true })).toBeVisible();

  await agentBuilderPage.getByRole('button').filter({ hasText: /^$/ }).first().click();
    await newPage.waitForTimeout(2000);
  await agentBuilderPage.getByRole('button').filter({ hasText: /^$/ }).first().click();

  await agentBuilderPage.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await expect(agentBuilderPage.getByRole('button', { name: 'MCP Server Icon MCP' })).toBeVisible();

  await agentBuilderPage.getByRole('button').first().click();

  await agentBuilderPage.getByRole('button', { name: 'Agent Config' }).click();
  await expect(agentBuilderPage.getByRole('textbox', { name: 'Agent Name*' })).toBeVisible();

  await agentBuilderPage.getByText('Reasoning', { exact: true }).click();
  await expect(agentBuilderPage.getByRole('button', { name: 'View Instructions' })).toBeVisible();

  await agentBuilderPage.getByText('Secrets').click();
  await expect(agentBuilderPage.getByRole('row', { name: 'Name Type Value Secured' })).toBeVisible();

  await agentBuilderPage.getByRole('button').filter({ hasText: /^$/ }).click();

  await agentBuilderPage.getByRole('button', { name: 'Try Agent' }).click();

  await agentBuilderPage.getByText('New Chat').click();
  await agentBuilderPage.getByText('User Persona').click();
  await expect(agentBuilderPage.getByRole('dialog', { name: 'User Persona' })).toBeVisible();
  await agentBuilderPage.getByRole('button', { name: 'Close' }).click();
  await agentBuilderPage.getByText('FAQs', { exact: true }).click();
  await expect(agentBuilderPage.getByRole('dialog', { name: 'Agent FAQs' })).toBeVisible();

  await agentBuilderPage.getByRole('button', { name: 'Close' }).click();

  await agentBuilderPage.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();

    await agentBuilderPage.locator("(//*[name()='svg'][@class='lucide lucide-chevron-right mr-0 h-4 w-4'])[1]").click();
await expect(agentBuilderPage.locator("xpath=//p[normalize-space()='Triggers']")).toBeVisible();
await agentBuilderPage.locator("xpath=//p[normalize-space()='Triggers']").click();
await agentBuilderPage.locator("//button[normalize-space()='Add New Trigger']").click();
await agentBuilderPage.locator("(//*[name()='svg'][@class='lucide lucide-x'])[1]").click();


  await agentBuilderPage.getByRole('button').first().click();
  await agentBuilderPage.getByText('+').click();
  await agentBuilderPage.getByRole('button').click();

  await agentBuilderPage.locator("//img[@alt='Logo']").click();

  // Skill Builder
const skillBuilderPage = await page.context().newPage();
await skillBuilderPage.goto('https://builder-qa.uptiq.dev/skills', { waitUntil: 'domcontentloaded' });


  await skillBuilderPage.getByRole('link', { name: 'Skills Library Skills Library' }).click();
  await expect(skillBuilderPage.locator('#root')).toContainText('Skills Library');
  await skillBuilderPage.getByRole('button', { name: 'Create custom skill' }).click();
  await expect(skillBuilderPage.getByRole('img', { name: 'Arrow-Down-Icon' })).toBeVisible();
  
// trigger file chooser by clicking the upload paragraph and supply the local file
await skillBuilderPage.locator("//button[normalize-space()='Upload']").click();
const [skillFileChooser] = await Promise.all([
    skillBuilderPage.waitForEvent('filechooser'),
    skillBuilderPage.locator("//p[@class='text-sm font-medium']").click()
]);
await skillFileChooser.setFiles('C:\\Users\\denzo\\Downloads\\Summery AI Logo.webp');

  await skillBuilderPage.getByRole('button', { name: 'Upload Avatar' }).click();

  await skillBuilderPage.getByRole('textbox', { name: 'Skill Name*' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Skill Name*' }).fill('Web search');
  await skillBuilderPage.getByRole('textbox', { name: 'Description*' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Description*' }).fill('Web search agemt');
  await skillBuilderPage.getByRole('button', { name: 'Save' }).click();
  await expect(skillBuilderPage.getByRole('link', { name: 'Logo' })).toBeVisible();

  await skillBuilderPage.getByRole('button', { name: 'Set Skill I/O' }).click();
  await expect(skillBuilderPage.getByRole('tabpanel', { name: 'Input Schema' })).toBeVisible();

  await skillBuilderPage.getByRole('textbox', { name: 'Enter key' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Enter key' }).fill('$web');
  await skillBuilderPage.getByRole('textbox', { name: 'Enter description' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Enter description' }).fill('Provide accurate answers to what the user asks, and keep responses short.');
  await skillBuilderPage.getByRole('checkbox').click();
  await skillBuilderPage.getByRole('button', { name: 'Save' }).click();
  await expect(skillBuilderPage.getByRole('link', { name: 'Logo' })).toBeVisible();

  await skillBuilderPage.getByRole('button', { name: 'Add Trigger' }).click();
  await skillBuilderPage.getByText('Start manually').click();
  await expect(skillBuilderPage.getByRole('button', { name: 'Select Task' })).toBeVisible();

  await skillBuilderPage.getByTestId('rf__node-0').getByRole('button').filter({ hasText: /^$/ }).click();
  await expect(skillBuilderPage.getByRole('img', { name: 'setting-Icon' })).toBeVisible();

  await skillBuilderPage.getByRole('textbox', { name: 'Search Nodes...' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Search Nodes...' }).fill('prompt');
  await skillBuilderPage.getByRole('textbox', { name: 'Search Nodes...' }).press('Enter');
  await skillBuilderPage.getByText('Prompt', { exact: true }).click();
  await expect(skillBuilderPage.getByRole('tab', { name: 'Editor' })).toBeVisible();

  await skillBuilderPage.getByRole('textbox', { name: 'Instructions for the AI*' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Instructions for the AI*' }).fill('Provide accurate answers to what the user asks, and keep responses short.');
  await skillBuilderPage.getByRole('textbox', { name: 'Query*' }).click();
  await skillBuilderPage.getByRole('textbox', { name: 'Query*' }).fill('$');
  await expect(skillBuilderPage.getByRole('listbox', { name: 'Suggestions' })).toBeVisible();

  await skillBuilderPage.getByRole('option', { name: 'skill.$web' }).click();
  await skillBuilderPage.getByRole('combobox', { name: 'Tools' }).click();
  await expect(skillBuilderPage.getByRole('listbox', { name: 'Tools' })).toBeVisible();

  await skillBuilderPage.getByText('web_search').click();
  await skillBuilderPage.getByRole('button').nth(1).click();
  await skillBuilderPage.getByRole('button', { name: 'Publish' }).click();
  await skillBuilderPage.getByRole('tab', { name: 'Try Out' }).click();
  
  //await skillBuilderPage.getByRole('button', { name: 'Skill Variables' }).click();
  //await skillBuilderPage.locator("/html[1]/body[1]/div[1]/div[1]/div[1]/div[2]/div[1]/button[2]").click();
  //await skillBuilderPage.locator("//p[normalize-space()='Skill Variables']").click();
  //await skillBuilderPage.locator("//button[normalize-space()='Add Variable']").click();
    //await skillBuilderPage.getByRole('textbox', { name: 'Enter key' }).click();
  //await skillBuilderPage.getByRole('textbox', { name: 'Enter key' }).fill('$testvar');
  //await skillBuilderPage.getByRole('textbox', { name: 'Enter description' }).click();
  //await skillBuilderPage.getByRole('textbox', { name: 'Enter description' }).fill('This is a test variable');
  //await skillBuilderPage.getByRole('checkbox').click();
  //await skillBuilderPage.getByRole('button', { name: 'Save' }).click();

  //await skillBuilderPage.getByRole('button', { name: 'Context Variables' }).click();
  //await skillBuilderPage.getByRole('button').filter({ hasText: /^$/ }).click();

  await skillBuilderPage.getByRole('button').nth(3).click();
  //*[name()='path' and contains(@d,'M19 12H5')]
  await expect(skillBuilderPage.getByRole('button', { name: 'Web search / Version History' })).toBeVisible();

    await skillBuilderPage.locator("(//button[@type='button'])[7]").click();
  //await skillBuilderPage.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();

  //await skillBuilderPage.getByRole('button').first().click();
  await skillBuilderPage.locator("(//*[name()='svg'][@class='lucide lucide-arrow-left w-4 h-4'])[1]").click();
  await expect(skillBuilderPage.locator('#root')).toContainText('Web search');

});

