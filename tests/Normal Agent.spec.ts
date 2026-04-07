import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-XXXXXXXX'
});

async function validateAnswer(question: string, answer: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a strict QA validator. Reply only CORRECT or INCORRECT.'
      },
      {
        role: 'user',
        content: `Question: ${question}\nAnswer: ${answer}`
      }
    ]
  });

  return response.choices[0].message.content?.trim() || 'UNKNOWN';
}

// Increase test timeout to allow external site (Mailinator) navigation
test.setTimeout(300000);

test('login flow (email)', async ({ page }) => {
  await page.goto('https://builder-qa.uptiq.dev/login');
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


// Navigate to Agent Builder 
await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('You are an intelligent Math Problem Solver Agent. Your primary task is to understand mathematical problems provided by the user and solve them accurately, step by step, using clear explanations.');
  await page.getByRole('button', { name: 'Send' }).click();
// Try Agent
    await page.getByRole('button', { name: 'Try Agent' }).click();
  await page.getByRole('group').getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('What is Uses of MCP server?');
await page.waitForTimeout(3000);

  // Capture agent response and validate it
  const agentResponse = await page.getByRole('paragraph').last().innerText().catch(() => '');
  console.log('Agent Response:', agentResponse);

  if (agentResponse) {
    const validationResult = await validateAnswer(
      'What is Uses of MCP server?',
      agentResponse
    );
    console.log('Validation Result:', validationResult);
    expect(validationResult).toBe('CORRECT');
  }
});