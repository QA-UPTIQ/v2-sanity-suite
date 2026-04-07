import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  try {
    await page.goto('https://builder-qa.uptiq.dev/login');
  await page.evaluate(() => window.moveTo(0, 0));

  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  

// enter email And click on forgot password
await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagar123q@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('button', { name: 'Forgot your password?' }).click();

  // open mailinator and click on reset password link or extract password and store

// Go to Mailinator to get the password
const mailinatorPage = await page.context().newPage();
await mailinatorPage.goto(
    `https://www.mailinator.com/v4/public/inboxes.jsp?to=${encodeURIComponent('sagar123q')}`,
    { waitUntil: 'domcontentloaded', timeout: 60000 }
);

// Wait for email to arrive
await mailinatorPage.waitForTimeout(5000);

// Click on the first email from no-reply@uptiq.ai
const emailCell = await mailinatorPage.waitForSelector('xpath=//td[normalize-space()="no-reply@uptiq.ai"]', { timeout: 10000 });
await emailCell.click();

let emailText = '';
let newUserPassword = '';

// Try JSON tab first
try {
    const jsonTab = mailinatorPage.locator('text=JSON');
    if ((await jsonTab.count()) > 0) {
        await jsonTab.first().click({ timeout: 5000 }).catch(() => null);
        await mailinatorPage.waitForTimeout(1000);
        const pre = mailinatorPage.locator('pre, code, .json, .raw');
        if ((await pre.count()) > 0) {
            emailText = (await pre.first().innerText({ timeout: 3000 })).trim();
        }
    }
} catch (e) {
    console.log('JSON tab extraction failed:', e);
}

// Try RAW tab if JSON didn't work
if (!emailText) {
    try {
        const rawTab = mailinatorPage.locator('text=RAW');
        if ((await rawTab.count()) > 0) {
            await rawTab.first().click({ timeout: 5000 }).catch(() => null);
            await mailinatorPage.waitForTimeout(1000);
            const pre = mailinatorPage.locator('pre, code, .raw, .msg-raw');
            if ((await pre.count()) > 0) {
                emailText = (await pre.first().innerText({ timeout: 3000 })).trim();
            }
        }
    } catch (e) {
        console.log('RAW tab extraction failed:', e);
    }
}

// Try HTML/iframe content if still empty
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

console.log('\n--- EMAIL CONTENT (first 2000 chars) ---');
console.log(emailText.slice(0, 2000));
console.log('--- END EMAIL CONTENT ---\n');

// Normalize to plain text (strip HTML tags)
const plain = emailText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Try multiple extraction patterns
const patterns = [
    /New\s*Password\s*[:\u00A0]?\s*([A-Za-z0-9!@#$%^&*()_+\-=]{6,})/i,
    /password\s*[:\u00A0]?\s*([A-Za-z0-9!@#$%^&*()_+\-=]{6,})/i,
    /temporary\s*password\s*[:\u00A0]?\s*([A-Za-z0-9!@#$%^&*()_+\-=]{6,})/i,
    /(?:is|:)\s*([A-Za-z0-9!@#$%^&*()_+\-=]{8,})\s*(?:You|This|Use)/i
];

for (const pattern of patterns) {
    const match = plain.match(pattern);
    if (match && match[1]) {
        newUserPassword = match[1].trim();
        console.log('Password extracted using pattern:', pattern.source);
        break;
    }
}

if (!newUserPassword) {
    const debugPath = `mailinator-email-debug-${Date.now()}.txt`;
    try { 
        fs.writeFileSync(debugPath, emailText || 'No content captured', { encoding: 'utf8' }); 
        console.log('Debug file saved to:', debugPath);
    } catch(e) {}
    await mailinatorPage.close();
    throw new Error('Password not found in email; raw content saved to ' + debugPath);
}

console.log('Extracted password:', newUserPassword);
await mailinatorPage.close();

// Navigate back to login page and use the new password
await page.goto('https://builder-qa.uptiq.dev/login');
await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Continue with Email' }).click();
await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagar123q@mailinator.com');
await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(newUserPassword);
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();

  // Update password back to original for test re-runs
  await page.getByRole('textbox', { name: 'Old Password' }).click();
  await page.getByRole('textbox', { name: 'Old Password' }).fill(newUserPassword);
  await page.getByRole('textbox', { name: 'New Password' }).click();
  await page.getByRole('textbox', { name: 'New Password' }).fill('Sagar@1522');
  await page.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Sagar@1522');
  await page.getByRole('button', { name: 'Update Password' }).click();
    await page.waitForTimeout(3000);

  // Final assertion to confirm login success
    await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();

  
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });