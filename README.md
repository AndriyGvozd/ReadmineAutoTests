# Redmine.org — Playwright Test Automation

Automated end-to-end tests for [redmine.org](https://www.redmine.org/), covering critical authentication flows. Built with **Playwright** + **TypeScript**, following the **Page Object Model** pattern, with **Allure** reporting published automatically to **GitHub Pages** via GitHub Actions.

## 📋 Test Plan

The full test plan (5 critical test cases with Module, Sub-Module, Type, Preconditions, Test Steps, and Expected Results) is available in [`Redmine_TestPlan_5Critical_Auth`](https://docs.google.com/spreadsheets/d/1uTjYeGTNvqtHfeBIbUcg5yCYMVnKitPKaWi7_GsxCmo/edit?gid=1637333109#gid=1637333109).

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-01 | Homepage of redmine.org loads successfully | Functional | Critical |
| TC-02 | Unauthenticated user cannot access the "My account" page | Security | Critical |
| TC-03 | User successfully logs in with valid credentials | Functional | Critical |
| TC-04 | Login fails with an invalid password | Negative | High |
| TC-05 | Authenticated user successfully logs out | Functional | High |

## 🛠 Tech Stack

- **[Playwright](https://playwright.dev/)** (TypeScript) — end-to-end testing framework
- **Page Object Model** — page locators and actions are isolated from test logic
- **[Allure Report](https://allurereport.org/)** — rich HTML test reporting with history/trend charts
- **GitHub Actions** — CI pipeline, runs on every push/PR to `main`
- **GitHub Pages** — hosts the generated Allure report, published from the `gh-pages` branch
- **otplib** — generates valid TOTP codes for the mandatory two-factor authentication on redmine.org

## 📁 Project Structure

```
redmine-playwright-tests/
├── tests/
│   ├── pages/
│   │   ├── HomePage.ts        # Page Object — homepage
│   │   ├── LoginPage.ts       # Page Object — login form
│   │   └── AccountPage.ts     # Page Object — account/header auth state
│   ├── mainPage.spec.ts       # TC-01, TC-02, TC-04 (unauthenticated)
│   └── authenticated.spec.ts  # TC-03, TC-05 (authenticated session)
├── helpers/
│   └── global-setup.ts        # Logs in once (incl. 2FA/TOTP), saves session state
├── env/
│   ├── .env                   # Real credentials (gitignored)
│   └── .env.example           # Template for required variables
├── .github/
│   └── workflows/
│       └── playwright.yml     # CI pipeline + Allure + GitHub Pages deploy
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ How the Tests Work

**Page Object Model:** every element and page action lives in a dedicated class under `tests/pages/`. Test files only describe *what* should happen (`login.login(user, pass)`, `account.signOut()`), never raw selectors — so if the site's markup changes, only one file needs updating.

**Authentication helper:** rather than logging in inside every test, `helpers/global-setup.ts` runs once before the whole suite:
1. Logs in via the UI using credentials from `environment/.env`
2. Since redmine.org now **requires two-factor authentication for all accounts**, it also generates a valid TOTP code on the fly using `otplib` and the account's stored secret
3. Saves the resulting authenticated session to `helpers/storageState.json`

The `authenticated` project then simply loads that saved session — no repeated logins, faster and more reliable tests.

**Multi-browser coverage:** both the unauthenticated and authenticated test suites run across multiple browser engines (Chromium, Firefox, WebKit) via separate Playwright `projects`, each pointing to the same spec file but a different `devices[...]` preset.

**Core commands/APIs used:**
- `page.goto()` — navigates to a URL
- `page.getByRole()` / `page.locator()` — selects elements semantically or by CSS
- `expect(locator).toBeVisible()`, `expect(page).toHaveURL()` — assertions
- `page.waitForURL()` / `locator.waitFor()` — waits for navigation or element state
- `test.describe()` / `test()` — groups and defines test cases, one `test()` per test case (TC-01 … TC-05)

## 🚀 Getting Started

### Install dependencies
```bash
npm install
npx playwright install
```

### Configure credentials
Copy the template and fill in your own test account:
```bash
cp environment/.env.example environment/.env
```
```
REDMINE_TEST_USERNAME=your_test_login
REDMINE_TEST_PASSWORD=your_test_password
REDMINE_TOTP_SECRET=your_totp_secret
```

### Run tests
```bash
npm test                # all projects, all browsers
npm run test:public     # unauthenticated flows only
npm run test:auth       # authenticated flows only
npm run test:headed     # run with a visible browser window
npm run test:ui         # interactive Playwright UI Mode
```

### Generate & view the Allure report locally
```bash
npm run report:generate
npm run report:open
```

## 🔁 CI/CD Pipeline

Every push or pull request to `main` triggers `.github/workflows/playwright.yml`, which:
1. Installs dependencies and Playwright browsers
2. Runs the full test suite
3. Checks out the previous `gh-pages` branch to preserve Allure's trend/history data
4. Generates a new Allure HTML report, merging in that history
5. Publishes the report to the `gh-pages` branch

### Setup requirements
- `REDMINE_TEST_USERNAME`, `REDMINE_TEST_PASSWORD`, `REDMINE_TOTP_SECRET` added as GitHub Actions secrets (Repo → Settings → Secrets and variables → Actions)
- GitHub Pages enabled: Settings → Pages → Source → Deploy from branch → `gh-pages` / `(root)`

### 📊 Reports
Live Allure report (updated on every pipeline run):
📊 **[Open Allure Report](https://andriygvozd.github.io/ReadmineAutoTests/)**

## 📌 Notes
- The `environment/` folder and `helpers/storageState.json` are excluded from version control — never commit real credentials or session tokens.
- A dedicated test account is used for automation; no destructive actions (creating/editing real issues or projects) are performed against the live redmine.org instance.