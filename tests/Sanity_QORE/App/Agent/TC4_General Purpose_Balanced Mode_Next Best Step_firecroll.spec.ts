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
  await page.locator('.tiptap').fill('You are a web scraping agent using Firecrawl. Scrape the content of the provided URL:');
  await page.getByRole('button', { name: 'Send' }).click();
  
// chenge to balanced mode and planner from config
  await page.getByRole('button', { name: 'Agent Config' }).click();
   await page.getByText('Reasoning', { exact: true }).click();
  await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
  await page.locator('button:has-text("Advanced")').click();
  await page.getByLabel('Balanced').getByText('Balanced').click();
  await page.getByRole('combobox').filter({ hasText: 'Intelligent Planner' }).click();
  await page.getByLabel('Next Best Step').getByText('Next Best Step').click();
  await page.getByRole('button', { name: 'Save' }).click();


  //add firecrawl skill
  await page.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
    await page.getByRole('button', { name: 'MCP Marketplace', exact: true }).click();
      await page.locator('section[aria-label="Notifications alt+T"] [data-sonner-toast]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);

  await page.getByLabel('', { exact: true }).getByText('Firecrawl').click();

  await page.getByRole('textbox', { name: 'Api Key' }).click();
  await page.getByRole('textbox', { name: 'Api Key' }).fill(process.env.FIRECRAWL_API_KEY || 'FIRECRAWL_API_KEY_HERE');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('combobox').first().click();
  await page.getByText('Allow Unsupervised').click();
  await page.getByRole('button', { name: 'Create Connection' }).click();

  // Try Agent
  await page.getByRole('button', { name: 'Try Agent' }).click();
    await page.waitForTimeout(3000);
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
await page.locator('.tiptap').fill(`
Scrape the content of the provided URL:

https://en.wikipedia.org/wiki/Model_Context_Protocol

Instructions:

1. Fetch and parse the full webpage content.

2. Extract the following sections clearly:
- Page title
- Introduction / summary
`);
  
  await page.locator('.uws-735ezk027ai.inline-flex.items-center.justify-center.rounded-md.text-base.transition-colors.focus-visible\\:outline-hidden.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.cursor-pointer.bg-primary').click();




















await page.waitForTimeout(60000);


  });
