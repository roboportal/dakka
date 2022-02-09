const { test, expect } = require('@playwright/test')

test('Testing https://www.roboportal.io/login/', async ({ page }) => {
  await page.goto('https://www.roboportal.io/login/')
  await page.locator('text="Cancel"').click()
  await page.locator('input[name="email"]').click()
  await page.locator('input[name="email"]').fill('gg')
  await page.locator('input[name="password"]').click()
  await page.locator('input[name="password"]').fill('g')
  await page.locator('div#root').click()
  expect(await page.locator('text="Invalid email"').textContent()).toBe(
    'Invalid email',
  )
  expect(
    await page
      .locator('text="Password should contain min 8 characters"')
      .textContent(),
  ).toBe('Password should contain min 8 characters')
})
