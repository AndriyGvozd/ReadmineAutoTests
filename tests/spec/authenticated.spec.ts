import { test, expect } from '../../helpers/fixtures';

// serial: Guarantees the execution order — TC-03 must always run before TC-05, so that the logout action
// (which invalidates the session on the server) does not affect tests that have not yet been executed.
test.describe.serial('Redmine.org — authenticated flows', () => {

  test('TC-03: Authenticated session grants access and shows Sign out link', async ({ page, accountPage }) => {
    await page.goto('/');

    await expect(accountPage.signOutLink).toBeVisible();
    await expect(accountPage.signInLink).toHaveCount(0);
  });

  test('TC-05: User successfully logs out', async ({ page, accountPage }) => {
    await page.goto('/');

    await accountPage.signOut();

    await expect(accountPage.signInLink).toBeVisible();
    await page.goto('/my/account');
    await expect(page).toHaveURL(/\/login/);
  });

});