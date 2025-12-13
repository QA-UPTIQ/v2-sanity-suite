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
 await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator("xpath=//p[@class='text-sm font-medium']").click()
  ]);
await fileChooser.setFiles('C:\Users\denzo\Downloads\Summey Proto.pdf');

await page.getByRole('button', { name: 'Attach (1)' }).click();
await page.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the user’s input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand. Also send the inputs to the attached agent and display the agent’s response. Also need one button where, on clicking Send Email, the generated summary should be sent to sagarjadhav61679@gmail.com.');
await page.locator("//button[normalize-space()='Send']").click();

});

