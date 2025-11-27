import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(120000);

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
  await expect(page.getByText('Welcome to Uptiq')).toBeVisible();
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
  await page.getByText('Logout').click();
  //await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

  // Start login flow for the newly created user
  //await page.getByRole('button', { name: 'Continue with Email' }).click();
  //await page.getByRole('textbox', { name: 'Enter your email' }).fill(uniqueEmail);
  //await page.getByRole('button', { name: 'Continue with Email' }).click();
  //await expect(page.getByRole('textbox', { name: 'Email Id' })).toBeVisible();

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
  await expect(newPage.getByRole('row', { name: 'Dynamic Dynamic 5 Claude' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Model Hub' }).click();
  await expect(newPage.getByRole('button', { name: 'Fine Tune' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Security & Monitoring' }).click();
  await expect(newPage.getByRole('row', { name: '66cc…39d7 Document' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Config and Utils' }).click();
  await expect(newPage.getByRole('row', { name: 'Name Created At Actions' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Connections' }).click();
  await expect(newPage.getByRole('button', { name: 'Return' })).toBeVisible();

  await newPage.getByRole('link', { name: 'Insights' }).click();

  await newPage.getByRole('button', { name: 'Marketplace' }).click();
  await expect(newPage.getByRole('button', { name: 'Return' })).toBeVisible();

  await newPage.getByRole('button', { name: 'News & Alerts' }).click();
});
