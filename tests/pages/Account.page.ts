import { Page, Locator } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly signOutLink: Locator;
  readonly signInLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signOutLink = page.locator('.logout');
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async goToMyAccount() {
    await this.page.goto('/my/account');
  }

  async signOut() {
    await this.signOutLink.click();
  }
}