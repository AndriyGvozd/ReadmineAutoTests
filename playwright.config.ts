import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'environment/.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  globalSetup: './helpers/global-setup.ts',
  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: 'https://www.redmine.org',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // --- Chromium  ---
    {
      name: 'mainPage-chromium',
      testMatch: /mainPage\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated-chromium',
      testMatch: /authenticated\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: './helpers/storageState.json',
      },
    },
    // --- Firefox  ---
    {
      name: 'mainPage-firefox',
      testMatch: /mainPage\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    // --- WebKit  ---
    {
      name: 'mainPage-webkit',
      testMatch: /mainPage\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    }
  ],
});