const { devices } = require('@playwright/test')

module.exports = {
  testDir: './tests/playwright',
  forbidOnly: false,
  retries: 2,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}
