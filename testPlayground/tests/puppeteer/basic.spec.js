const puppeteer = require('puppeteer')

describe('Testing https://javascript.info/promise-chaining', () => {
  it('Testing https://javascript.info/promise-chaining', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
      await page.goto('https://javascript.info/promise-chaining')
      await page.waitForSelector("get('.sitetoolbar__login')")
      await page.click("get('.sitetoolbar__login')")
      await page.waitForSelector("get('#auth-email')")
      await page.type("get('#auth-email')", 'test@gmail.com')
      await page.waitForSelector("get('#auth-password')")
      await page.click("get('#auth-password')")
      await page.waitForSelector("get('#auth-password')")
      await page.type("get('#auth-password')", 'test')

      await page.waitForXPath('//button[contains(., "Log in")]')
      await page
        .$x('//button[contains(., "Log in")]')
        .then(async (elements) => {
          await elements[0].click()
        })

      await page.waitForXPath(
        '//p[contains(., "Password incorrect. Or maybe the password is too old, then please update it using password reset.")]',
      )
      expect(
        await page.$x(
          '//p[contains(., "Password incorrect. Or maybe the password is too old, then please update it using password reset.")]',
        ),
      ).toBeDefined()
      await page.waitForSelector("get('.close-button:nth-child(1)')")
      await page.click("get('.close-button:nth-child(1)')")
      await page.waitForSelector("get('.sitetoolbar__login')")
      await page.click("get('.sitetoolbar__login')")
    } finally {
      await browser.close()
    }
  })
})
