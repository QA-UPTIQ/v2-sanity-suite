import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-XXXXXXXX'
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sagar@uptiq.ai',
    pass: 'wvov omev uvnh bqwz'
  }
});

async function sendFailureEmail(error: any) {
  const mailOptions = {
    from: 'sagar@uptiq.ai',
    to: 'sj104850@gmail.com',
    subject: 'Test Failure Notification',
    text: `The script failed with error: ${error.message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Failure email sent');
  } catch (err) {
    console.error('Failed to send email', err);
  }
}

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
  try {
  await page.goto('https://builder-dev.uptiq.dev/login');
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

 // Create Workspase 

    await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();

  await page.getByRole('menuitem', { name: 'Create New Workspace' }).click();
  await page.getByRole('textbox', { name: 'Provide name to workspace' }).click();
const random4 = Math.floor(1000 + Math.random() * 9000);
await page.getByRole('textbox', { name: 'Provide name to workspace' }).fill(`V2.0.24 AgentSanity ${random4}`);
  await page.getByRole('button', { name: 'Create Workspace' }).click();

  await page.locator("//*[name()='path' and contains(@d,'m7 15 5 5 ')]").click();
   await page.getByText(`V2.0.24 AgentSanity ${random4}`).click();



// Create agent withot knowledge base

  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('You are an intelligent Math Problem Solver Agent. Your primary task is to understand mathematical problems provided by the user and solve them accurately, step by step, using clear explanations.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  await page.getByRole('link', { name: 'Logo' }).click();


  // Create agent with knowledge base
  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('You are a Question & Answer (QnA) Agent designed to answer user queries strictly based on the provided knowledge data.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  await page.getByRole('link', { name: 'Logo' }).click();


  // Tool Call Agent 
  await page.getByRole('link', { name: 'Agent Builder Agent Builder' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create Agent For Send Email.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('button', { name: 'Agent Config' })).toBeVisible();
  //connect MCP Server Gmail
  await page.getByTestId('rf__node-03f2c4a2-5730-4ee3-a7fa-962f201fc392').getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByText('MCP Server', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).click();
  await page.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
  await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill('https://backend.composio.dev/v3/mcp/1d86bff6-8e8b-4f35-b304-39335cd20414/mcp?user_id=pg-test-55d0dd53-ae9a-4fbd-89ca-5421cf695914');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('link', { name: 'Logo' }).click();












  await page.getByText(`V2.0.24 AppSanity ${random4}`).click();
  } catch (error) {
    await sendFailureEmail(error);
    throw error;
  }
});