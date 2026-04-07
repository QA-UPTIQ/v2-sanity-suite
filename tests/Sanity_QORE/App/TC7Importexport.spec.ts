import { test, expect } from '@playwright/test';
 test.setTimeout(300000);
 
 test('login flow (email)', async ({ page }) => {
   await page.goto('https://builder-dev.uptiq.dev/');
   await page.evaluate(() => window.moveTo(0, 0));
 
   await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
 
   await page.getByRole('button', { name: 'Continue with Email' }).click();
   await page.getByRole('textbox', { name: 'Enter your email' }).click();
   await page.getByRole('textbox', { name: 'Enter your email' }).fill('sagartest222@mailinator.com');
   await page.getByRole('button', { name: 'Continue with Email' }).click();
   await expect(page.getByRole('textbox', { name: 'Email Id' })).toBeVisible();
 
   await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
   await page.getByRole('button', { name: 'Continue' }).click();
   await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();
 
 // import app
  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.getByRole('button').nth(5).click();
  await page.getByRole('menuitem', { name: 'Import App Package' }).click();
  
  // Upload the import package file (target zip file input specifically)
  const fileInput = page.locator('input[type="file"][accept*="zip"]');
  await fileInput.setInputFiles('C:/Users/denzo/Downloads/download (56).zip');
  
  await page.getByRole('button', { name: 'Import' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('QA Test').click();
  await page.getByRole('button', { name: 'Connect' }).click();

  await page.waitForTimeout(180000);

});