const { test, expect } = require('@playwright/test')

test('Testing https://javascript.info/promise-chaining', async ({ page }) => {
  await page.goto('https://javascript.info/promise-chaining')
  await page.locator('.sitetoolbar__login').click()
  await page.locator('#auth-email').fill('test@gmail.com')
  await page.locator('#auth-password').click()
  await page.locator('#auth-password').fill('test')
  await page.locator('button:has-text("Log in")').click()
  expect(
    await page.locator(
      'text="Password incorrect. Or maybe the password is too old, then please update it using password reset."',
    ),
  ).toBeTruthy()
  await page.locator('.close-button:nth-child(1)').click()
  await page.locator('.sitetoolbar__login').click()
})
