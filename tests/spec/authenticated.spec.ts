import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/Account.page';

test.describe('Redmine.org — authenticated flows', () => {

  test('TC-03: Authenticated session grants access and shows Sign out link', async ({ page }) => {
    const account = new AccountPage(page);
    await page.goto('/');

    await expect(account.signOutLink).toBeVisible();
    await expect(account.signInLink).toHaveCount(0);
  });

  test('TC-05: User successfully logs out', async ({ page }) => {
    const account = new AccountPage(page);
    await page.goto('/');

    await account.signOut();

    await expect(account.signInLink).toBeVisible();
    await page.goto('/my/account');
    await expect(page).toHaveURL(/\/login/);
  });

});