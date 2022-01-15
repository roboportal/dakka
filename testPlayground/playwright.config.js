const { devices } = require('@playwright/test')

module.exports = {
  testDir: './tests/playwright',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}
