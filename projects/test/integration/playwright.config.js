const { devices } = require('@playwright/test')

module.exports = {
  testDir: './dist/generated/playwright',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
}
