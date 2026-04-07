import { test, expect } from '@playwright/test';
import { AppBuilderApiHelper } from '../../utils/ApiHelper';

test('Create App + Deploy Validation', async ({ page }) => {
  test.setTimeout(480000);

  await page.goto('https://builder-qa.uptiq.dev');

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
    await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.locator('#root')).toContainText(
  'Help & Documentation',
    { timeout: 120000 } // waits up to 2 minutes
);

  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.locator('.tiptap').fill('Create Simple Expense Tracker App ');

  // Intercept POST /app-builder/projects to capture projectId
  const createResponsePromise = page.waitForResponse(res =>
    res.url().includes('/app-builder/projects') &&
    res.request().method() === 'POST'
  );

  await page.locator(".lucide.lucide-arrow-up").click();

  const createResponse = await createResponsePromise;
  const createBody = await createResponse.json();
  const projectId: string = createBody.data.id;
  console.log('Project ID:', projectId);

  // Wait for state = WAITING_FOR_USER_INPUT via API (replaces UI text check)
  const apiHelper = new AppBuilderApiHelper(page, 'https://api-builder-qa.uptiq.dev');
  const { state } = await apiHelper.waitForProjectState(
    projectId,
    'WAITING_FOR_USER_INPUT',
    360000   // up to 6 minutes — QA builds typically take ~5m40s
  );
  expect(state).toBe('WAITING_FOR_USER_INPUT');
  console.log('App is ready, state:', state);

  // Now interact with the UI to enable Google Authentication
 await page.getByRole('button', { name: 'App Config' }).click();
 await page.locator('p:has-text("Authentication")').click();
 await page.locator("//div[@class='p-2 flex flex-col flex-1 overflow-y-auto gap-1.5']//div[2]//div[2]//button[1]").click();
 await page.locator("//button[@value='on']").click();
 await page.getByRole('button', { name: 'Save' }).click();  

 // Validate API transitions after Save:
 // 1) generation starts (state moves away from WAITING_FOR_USER_INPUT)
 // 2) generation finishes (state returns to WAITING_FOR_USER_INPUT)
 const { state: generationStartedState } = await apiHelper.waitForStateChangeFrom(
   projectId,
   'WAITING_FOR_USER_INPUT',
   120000
 );
 expect(generationStartedState).not.toBe('WAITING_FOR_USER_INPUT');
 console.log('Generation started, state:', generationStartedState);

 const { state: postSaveState } = await apiHelper.waitForProjectState(
   projectId,
   'WAITING_FOR_USER_INPUT',
   360000
 );
 expect(postSaveState).toBe('WAITING_FOR_USER_INPUT');
 console.log('Post-save generation complete, state:', postSaveState);

});