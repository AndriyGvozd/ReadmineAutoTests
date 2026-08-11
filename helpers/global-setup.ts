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
    throw new Error(
      'Missing REDMINE_TEST_USERNAME / REDMINE_TEST_PASSWORD / REDMINE_2FA_SECRET. Set them in environment/.env or CI secrets.'
    );
  }

  const twoFactorCode = await generate({
    secret,
  });

  const browser = await chromium.launch({ // for debugging, you can set headless: false and slowMo: 500
    // headless: false,
    // slowMo: 500
  });

  const page = await browser.newPage({ baseURL });

  const login = new LoginPage(page);

  await login.goto();
  await login.login(username, password);
  await login.twoFactorLogin(twoFactorCode);

  await page.waitForURL(/redmine\.org\/my\/page$/, {
    timeout: 10000
  });

  const storageStatePath = path.resolve(
    __dirname,
    'storageState.json'
  );

  await page.context().storageState({
    path: storageStatePath
  });

  console.log(`Storage state saved to: ${storageStatePath}`);

  await browser.close();
}

export default globalSetup;