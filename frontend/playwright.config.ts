import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration for Keras Luxury Athletic Wear
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 14'],
        // Use chromium engine for mobile emulation with iPhone 14 viewport (390x844) & touch
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'bun run preview',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
