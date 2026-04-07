import { test, expect } from '@playwright/test';
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

// Create normal Agent
await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Knowledge preProcessing Agent');
  await page.getByRole('button', { name: 'Send' }).click();

// chenge Agent to knowledge worker config
  await page.getByRole('button', { name: 'Agent Config' }).click();
  await page.getByRole('combobox', { name: 'Agent Type*' }).click();
  await page.getByLabel('Knowledge Worker').getByText('Knowledge Worker').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Logo' }).click();

    await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
await page.locator('svg').locator('path').nth(0).click();
  await page.locator('.tiptap').fill('Knowledge Processing Agent');

  await page.getByRole('button', { name: 'Send' }).click();

  await page.getByRole('button', { name: 'Agent Config' }).click();
  await page.getByRole('combobox', { name: 'Agent Type*' }).click();
  await page.getByLabel('Knowledge Manager').getByText('Knowledge Manager').click();
  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();


  await page.getByRole('button', { name: 'Try Agent' }).click();
  await page.getByRole('group').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByText('Drag and drop files here, or').click();
  await page.locator('div').filter({ hasText: 'Drag and drop files here, or' }).nth(5).setInputFiles('7 page game data.pdf');
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Provide Chunks of Document');
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
});