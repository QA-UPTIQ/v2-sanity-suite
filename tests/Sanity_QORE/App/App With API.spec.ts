import { test, expect } from '@playwright/test';
import { AppBuilderApiHelper } from '../../utils/ApiHelper';

test('Create App + Deploy Validation', async ({ page }) => {
  test.setTimeout(300000);

  await page.goto('https://builder-dev.uptiq.dev');

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByText('App Builder').click();

  await page.locator('.tiptap').fill('Create Simple TODO Application');

  // ── 1. Intercept the POST /app-builder/projects response to capture projectId ──
  const createResponsePromise = page.waitForResponse(res =>
    res.url().includes('/app-builder/projects') &&
    res.request().method() === 'POST'
  );

  await page.locator(".lucide.lucide-arrow-up").click();

  const createResponse = await createResponsePromise;
  expect(createResponse.status()).toBe(201);

  const createBody = await createResponse.json();
  expect(createBody.message).toBe("Project generation started successfully.");

  const projectId: string = createBody.data.id;
  console.log("Project ID:", projectId);

  // ── 2. Poll the GET /app-builder/projects/{projectId} responses that the
  //       browser fires automatically and wait until state = WAITING_FOR_USER_INPUT
  //       (meaning the app is fully built and live preview is ready). ──────────
  const apiHelper = new AppBuilderApiHelper(page);

  const { state, data } = await apiHelper.waitForProjectState(
    projectId,
    'WAITING_FOR_USER_INPUT',
    180000   // up to 3 minutes
  );

  expect(state).toBe('WAITING_FOR_USER_INPUT');
  console.log("Final state  :", state);
  console.log("Preview URL  :", (data as { previewUrl?: string }).previewUrl ?? 'n/a');
  console.log("App status   :", (data as { status?: string }).status ?? 'n/a');

});