import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly twoFactorInput: Locator;
  readonly twoFactorSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-submit');
    this.errorMessage = page.locator('#flash_error, .flash.error');
    this.twoFactorInput = page.locator('#twofa_code');
    this.twoFactorSubmitButton = page.locator('#login-submit');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async twoFactorLogin(twoFactorCode: string) {
    await this.twoFactorInput.fill(twoFactorCode);
    await this.twoFactorSubmitButton.click();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}