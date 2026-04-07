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
  await page.locator('.tiptap').fill('Create a send email agent ');
  await page.getByRole('button', { name: 'Send' }).click();
  
// chenge to balanced mode and planner from config
  await page.getByRole('button', { name: 'Agent Config' }).click();
  await page.getByText('Reasoning', { exact: true }).click();
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await page.locator('button:has-text("Advanced")').click();
  await page.getByLabel('Balanced').getByText('Balanced').click();
  await page.getByRole('button', { name: 'Save' }).click();

  //add MCP skill\
  await page.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await page.getByText('MCP Server', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill(process.env.MCP_URL || 'MCP_SERVER_URL_HERE');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox').first().click();
  await page.getByText('Allow Unsupervised').click();
  await page.getByRole('button', { name: 'Create Connection' }).click();
  await page.waitForTimeout(3000);

  // Try Agent
  await page.getByRole('button', { name: 'Try Agent' }).click();
    await page.waitForTimeout(3000);
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('send email to sagar@uptiq.ai with subject hello and body hi Sanity Working Fine dont Warry');
  
  await page.locator('.uws-735ezk027ai.inline-flex.items-center.justify-center.rounded-md.text-base.transition-colors.focus-visible\\:outline-hidden.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.cursor-pointer.bg-primary').click();



     await page.waitForTimeout(60000);
});

