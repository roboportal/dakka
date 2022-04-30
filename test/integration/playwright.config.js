const { devices } = require('@playwright/test')

module.exports = {
  testDir: './generated/playwright',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}
