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
  await page.locator('.tiptap').fill('You are a fast Q&A agent. Answer questions directly using available knowledge.');
  await page.getByRole('button', { name: 'Send' }).click();

    // chenge Agent to knowledge manager config
    await page.getByRole('button', { name: 'Agent Config' }).click();
  await page.getByRole('combobox', { name: 'Agent Type*' }).click();
  await page.getByLabel('Knowledge Manager').getByText('Knowledge Manager').click();
  await page.getByRole('button', { name: 'Save' }).click();

// upload flash file
await page.locator("//div[@class='react-flow__node react-flow__node-AddKnowledgeNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await page.getByRole('button', { name: 'Flash Knowledge' }).click();
  
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Click to upload' }).click()
  ]);
  await fileChooser.setFiles('C:/Users/denzo/Downloads/Resume Sample (1).pdf');
  
  await page.getByRole('button', { name: 'Done' }).click();
// Switch to Flash mode
  await page.getByRole('button', { name: 'Agent Config' }).click();
  await page.getByText('Reasoning', { exact: true }).click();
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await page.locator('button:has-text("Advanced")').click();
  await page.getByLabel('Flash').getByText('Flash').click();
  await page.getByRole('button', { name: 'Save' }).click();
  // Try Agent in Flash mode
  await page.getByRole('button', { name: 'Try Agent' }).click();
    await page.waitForTimeout(3000);
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('what is tecnical skill of sagar sharma?');
  
  await page.locator('.uws-735ezk027ai.inline-flex.items-center.justify-center.rounded-md.text-base.transition-colors.focus-visible\\:outline-hidden.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.cursor-pointer.bg-primary').click();

   await page.waitForTimeout(60000);
});

