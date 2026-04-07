import { test, expect } from '@playwright/test';
test.setTimeout(900000); 

test('Create App + Mobile OTP integration', async ({ page }) => {

await page.goto('https://builder-qa.uptiq.dev');

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('automation2026@mailinator.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD || 'PASSWORD_HERE');
    await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.locator('#root')).toContainText(
  'Help & Documentation',
    { timeout: 120000 } // waits up to 2 minutes
);

  await page.getByRole('link', { name: 'App Builder App Builder' }).click();
  await page.locator('.tiptap').fill('Create Simple TODO Application');
  await page.locator(".lucide.lucide-arrow-up").click();

// waiT for app generation to complete
    await page.waitForTimeout(300000); // 5 minutes


    // Now interact with the UI to enable mobile OTP Authentication
 await page.getByRole('button', { name: 'App Config' }).click();
 await page.locator('p:has-text("Authentication")').click();
 await page.locator("body > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > button:nth-child(1)").click();
 await page.getByRole('textbox', { name: 'Account SID' }).fill(process.env.TWILIO_ACCOUNT_SID || 'AC_XXXXX');
 await page.getByRole('textbox', { name: 'Auth Token' }).fill(process.env.TWILIO_AUTH_TOKEN || 'TOKEN_HERE');
 await page.getByRole('textbox', { name: 'From Number' }).fill(process.env.TWILIO_FROM_NUMBER || 'whatsapp:+1XXXXXXXXX');
 await page.getByRole('button', { name: 'Save' }).click();
 await page.getByRole('textbox', { name: 'Publish Account SID' }).fill(process.env.TWILIO_PUBLISH_ACCOUNT_SID || 'AC_XXXXX');
 await page.getByRole('textbox', { name: 'Publish Auth Token' }).fill(process.env.TWILIO_PUBLISH_AUTH_TOKEN || 'TOKEN_HERE');
 await page.getByRole('textbox', { name: 'Publish From Number' }).fill(process.env.TWILIO_PUBLISH_FROM_NUMBER || 'whatsapp:+1XXXXXXXXX');
 await page.getByRole('button', { name: 'Save' }).click();

 await page.waitForTimeout(300000); // 5 minutes

});