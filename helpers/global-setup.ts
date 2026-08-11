import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../tests/pages/Login.page';
import { generate } from 'otplib';
import path from 'path';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  const username = process.env.REDMINE_TEST_USERNAME;
  const password = process.env.REDMINE_TEST_PASSWORD;
  const secret = process.env.REDMINE_2FA_SECRET;

  if (!username || !password || !secret) {
    console.warn(
      'REDMINE_TEST_USERNAME / REDMINE_TEST_PASSWORD / REDMINE_2FA_SECRET are not set. ' +
      'Skipping authenticated session setup — only unauthenticated (mainPage) tests can run.'
    );
    return;
  }

  const twoFactorCode = await generate({ secret });

  const browser = await chromium.launch({ 
    // headless: false, // for debugging, set to false to see the browser
    // slowMo: 500
   });
  const page = await browser.newPage({ baseURL });

  const login = new LoginPage(page);

  await login.goto();
  await login.login(username, password);
  await login.twoFactorLogin(twoFactorCode);

  try {
    await page.waitForURL(/redmine\.org\/my\/page$/, { timeout: 10000 });
  } catch {
    await page.screenshot({ path: 'helpers/login-failure.png' });
    await browser.close();
    console.warn(
      'Authenticated login failed. Authenticated tests will fail, ' +
      'but public tests are unaffected. See helpers/login-failure.png.'
    );
    return;
  }

  const storageStatePath = path.resolve(__dirname, 'storageState.json');
  await page.context().storageState({ path: storageStatePath });

  console.log(`Storage state saved to: ${storageStatePath}`);
  await browser.close();
}

export default globalSetup;