const puppeteer = require('puppeteer')

describe('Testing https://www.roboportal.io/login/', () => {
  it('Testing https://www.roboportal.io/login/', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
      await page.goto('https://www.roboportal.io/login/')

      await page.waitForXPath('//span[contains(., "Cancel")]')
      await page.$x('//span[contains(., "Cancel")]').then(async (elements) => {
        await elements[0].click()
      })
      await page.waitForSelector('input[name="email"]')
      await page.click('input[name="email"]')
      await page.waitForSelector('input[name="email"]')
      await page.type('input[name="email"]', 'gg')
      await page.waitForSelector('input[name="password"]')
      await page.click('input[name="password"]')
      await page.waitForSelector('input[name="password"]')
      await page.type('input[name="password"]', 'g')
      await page.waitForSelector('div#root')
      await page.click('div#root')
      await page.waitForXPath('//div[contains(., "Invalid email")]')
      expect(
        await page
          .$x('//div[contains(., "Invalid email")]')
          .then(async (elem) => page.evaluate((e) => e.textContent, elem[0])),
      ).toBe('Invalid email')
      await page.waitForXPath(
        '//div[contains(., "Password should contain min 8 characters")]',
      )
      expect(
        await page
          .$x('//div[contains(., "Password should contain min 8 characters")]')
          .then(async (elem) => page.evaluate((e) => e.textContent, elem[0])),
      ).toBe('Password should contain min 8 characters')
    } finally {
      await browser.close()
    }
  })
})
