import { test as base } from '@playwright/test';
import { HomePage } from '../tests/pages/Home.page';
import { LoginPage } from '../tests/pages/Login.page';
import { AccountPage } from '../tests/pages/Account.page';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect } from '@playwright/test';