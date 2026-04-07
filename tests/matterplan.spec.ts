import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://mattr-qa.uptiq.dev');
  await page.evaluate(() => window.moveTo(0, 0));


// login new User

  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).click();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('Sagar@uptiq.ai');
  await page.getByRole('button', { name: 'Continue with Email' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.MATTR_PASSWORD || 'PASSWORD_HERE');
    await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();


  // Create New App

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create Simple TODO App');
  //await page.locator('iframe[title="chat widget"]').nth(3).contentFrame().getByRole('button', { name: 'Chat attention grabber' }).click();
  await page.getByRole('button', { name: 'Send' }).click();
  
  // Wait for response before clicking Upgrade Plan
  await page.waitForTimeout(5000);
  
  // Handle first popup (Upgrade Plan page)
  const [page3] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Upgrade Plan' }).click()
  ]);
  
  // Wait for page3 to load
  await page3.waitForLoadState('domcontentloaded');
  await page3.waitForTimeout(2000);
  
  // Handle second popup (payment form)
  const getStartedButton = page3.locator('body > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > button:nth-child(4)');
  await getStartedButton.waitFor({ state: 'visible', timeout: 15000 });
  
  const [page4] = await Promise.all([
    page.waitForEvent('popup'),
    getStartedButton.click()
  ]);


  const [page5] = await Promise.all([
    page4.waitForEvent('popup'),
    page4.getByRole('button', { name: 'Get Started' }).click()
  ]);
  
  await page5.getByRole('textbox', { name: 'Email' }).click();
  await page5.getByRole('textbox', { name: 'Email' }).fill('sagar');
  await page5.getByRole('textbox', { name: 'Email' }).fill('sagar@Uptiq.ai'); 
  await page5.getByRole('textbox', { name: 'Card number' }).click();
  await page5.getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');
  await page5.getByRole('textbox', { name: 'CVC' }).click();
  await page5.getByRole('textbox', { name: 'CVC' }).fill('123');
  await page5.getByRole('textbox', { name: 'Expiration' }).click();
  await page5.getByRole('textbox', { name: 'Expiration' }).fill('11 / 28');
  await page5.getByRole('textbox', { name: 'Cardholder name' }).click();
  await page.getByRole('textbox', { name: 'Cardholder name' }).fill(process.env.TEST_CARD_NAME || 'CARD_NAME_HERE');
  await page5.getByTestId('hosted-payment-submit-button').click();
  await page5.getByRole('textbox', { name: 'PIN' }).click();
  await page5.getByRole('textbox', { name: 'PIN' }).fill('123456');
  await page5.getByTestId('hosted-payment-submit-button').click();


});