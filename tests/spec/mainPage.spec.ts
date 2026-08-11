import { test, expect } from '../../helpers/fixtures';

test.describe('Redmine.org — public / unauthenticated flows', () => {

  test('TC-01: Homepage loads successfully', async ({ page, homePage }) => {
    await homePage.goto();

    await expect(page).toHaveTitle('Overview - Redmine');
    await expect(homePage.mainHeading).toBeVisible();
  });

  test('TC-02: Unauthenticated user cannot access "My account"', async ({ page }) => {
    await page.goto('/my/account');

    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-04: Login fails with an invalid password', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.REDMINE_TEST_USERNAME ?? 'invalid_user', 'wrong-password-123');

    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.errorMessage).toBeVisible();
  });

});