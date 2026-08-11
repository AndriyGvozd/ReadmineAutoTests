import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly mainHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.locator('.current-project');
  }

  async goto() {
    await this.page.goto('/');
  }
}