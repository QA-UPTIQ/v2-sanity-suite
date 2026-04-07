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
  await page.getByRole('textbox', { name: 'Password' }).fill('Sagar@1522');
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('link', { name: 'Dashboard Dashboard' })).toBeVisible();


// create rapid frontend app
  await page.locator("(//p[@title='App Builder'])[1]").click();

  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('.tiptap').fill('Create a Summary Generator app using the prototype provided in the attached document. The app should read the content, analyze it, and generate a clear, concise summary based on the users input. It must follow the layout and flow shown in the prototype and ensure the summary output is accurate, structured, and easy to understand. Also send the inputs to the attached agent and display the agents response.Also need one button where, on clicking Send Email, the generated summary should be sent to sagarjadhav61679@gmail.com.');
  await page.getByRole('button', { name: 'Send' }).click();
await page.waitForTimeout(180000);
// verify code tab
 await page.getByRole('tab', { name: 'Code' }).click();
 await expect(page.locator('#root')).toContainText('frontend');
 await page.getByRole('button', { name: 'src' }).click();
 await expect(page.locator('#root')).toContainText('main.tsx');


// open agent
  await page.getByRole('tab', { name: 'Agents' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByTestId('rf__node-root').getByText('AI Agent').click();
  const page1 = await page1Promise;
await page1.locator("//button[@id='radix-:r2:']//*[name()='svg']").click();
  await page1.getByRole('menuitem', { name: 'Rename Agent' }).click();
await page1.getByRole('textbox').clear();
await page1.getByRole('textbox').fill('Summery Agent');
  await page1.getByRole('textbox').press('Enter');
  await page1.getByRole('link', { name: 'Logo' }).click();
// create second agent
await page1.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page1.locator('.tiptap').fill('create send gmail agent');
  await page1.getByRole('button', { name: 'Send' }).click();
    await page1.waitForTimeout(30000);


await page1.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
  await page1.getByText('MCP Server', { exact: true }).click();
  await page1.getByRole('textbox', { name: 'Connection Name*' }).click();
  await page1.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
  await page1.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
  await page1.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill('https://backend.composio.dev/v3/mcp/1d86bff6-8e8b-4f35-b304-39335cd20414/mcp?user_id=pg-test-55d0dd53-ae9a-4fbd-89ca-5421cf695914');
  await page1.getByRole('button', { name: 'Next' }).click();
  await page1.getByRole('combobox').first().click();
  await page1.getByText('Allow Unsupervised').click();
  await page1.getByRole('button', { name: 'Create Connection' }).click();
  await page1.getByRole('link', { name: 'Logo' }).click();



//     await page.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
//   await page.getByText('MCP Server', { exact: true }).click();
//   await page.getByRole('textbox', { name: 'Connection Name*' }).click();
//   await page.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
//   await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
//   await page.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill('https://backend.composio.dev/v3/mcp/1d86bff6-8e8b-4f35-b304-39335cd20414/mcp?user_id=pg-test-55d0dd53-ae9a-4fbd-89ca-5421cf695914');
//   await page.getByRole('button', { name: 'Next' }).click();
//   await page.getByRole('combobox').first().click();
//   await page.getByText('Allow Unsupervised').click();
//   await page.getByRole('button', { name: 'Create Connection' }).click();
//   await page.getByRole('link', { name: 'Logo' }).click();
//   await page.getByText('Summery Agent').click();
//   await page.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
//   await page.getByRole('button', { name: 'Agents' }).click();
//   await page.getByText('Email Sender').click();
// // Add Agent to parat Agent
//   await page.getByRole('link', { name: 'Logo' }).click();
//   await page.getByText('Summery Agent').click();
//   await page.getByTestId('rf__node-b8901863-c931-48ef-9e32-b84a066d0ad7').getByRole('button').filter({ hasText: /^$/ }).click();
//   await page.getByRole('button', { name: 'Agents' }).click();
//   await page.locator('.shrink-0.w-10').first().click();

//   //create second agent
//   await page1.getByRole('paragraph').filter({ hasText: /^$/ }).click();
//   await page1.locator('.tiptap').fill('create send gmail agent');
//   await page1.getByRole('button', { name: 'Send' }).click();
 
// // Edit name of Send Email Agent and add skill to it

//   await page1.locator("//button[@id='radix-:r2:']//*[name()='svg']").click();
//   await page1.getByRole('menuitem', { name: 'Rename Agent' }).click();
// await page1.getByRole('textbox').clear();
// await page1.getByRole('textbox').fill('send Email');
//   await page1.getByRole('textbox').press('Enter');
//   await page1.getByRole('link', { name: 'Logo' }).click();


//   await page1.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
//   await page1.getByText('MCP Server', { exact: true }).click();
//   await page1.getByRole('textbox', { name: 'Connection Name*' }).click();
//   await page1.getByRole('textbox', { name: 'Connection Name*' }).fill('gmail');
//   await page1.getByRole('textbox', { name: 'Remote MCP Server URL*' }).click();
//   await page1.getByRole('textbox', { name: 'Remote MCP Server URL*' }).fill('https://backend.composio.dev/v3/mcp/1d86bff6-8e8b-4f35-b304-39335cd20414/mcp?user_id=pg-test-55d0dd53-ae9a-4fbd-89ca-5421cf695914');
//   await page1.getByRole('button', { name: 'Next' }).click();
//   await page1.getByRole('combobox').first().click();
//   await page1.getByText('Allow Unsupervised').click();
//   await page1.getByRole('button', { name: 'Create Connection' }).click();
//   await page1.getByRole('link', { name: 'Logo' }).click();
//   await page1.getByText('Summery Agent1').click();
//   await page1.locator("//div[@class='react-flow__node react-flow__node-AddSkillNode nopan selectable draggable']//div[@class='pointer-events-auto']//*[name()='svg']").click();
//   await page1.getByRole('button', { name: 'Agents' }).click();
//   await page1.getByText('Email Sender Agent1').click();

// // Add Agent to parat Agent
// await page.getByRole('link', { name: 'Logo' }).click();
//   await page.getByText('Summery Agent').click();
//   await page.getByTestId('rf__node-b8901863-c931-48ef-9e32-b84a066d0ad7').getByRole('button').filter({ hasText: /^$/ }).click();
//   await page.getByRole('button', { name: 'Agents' }).click();
//   await page.locator('.shrink-0.w-10').first().click();
});