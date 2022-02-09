const puppeteer = require('puppeteer')

describe('Testing https://www.roboportal.io/login/', () => {
  it('Testing https://www.roboportal.io/login/', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
      await page.goto('https://www.roboportal.io/login/')

      await page.waitForXPath('//span[contains(text(), "Cancel")]')
      await page
        .$x('//span[contains(text(), "Cancel")]')
        .then(async (elements) => await elements[0].evaluate((e) => e.click()))
      await page.waitForSelector('input[name="email"]')
      await page.click('input[name="email"]')
      await page.waitForSelector('input[name="email"]')
      await page.type('input[name="email"]', 'ggg')
      await page.waitForSelector('input[name="password"]')
      await page.click('input[name="password"]')
      await page.waitForSelector('input[name="password"]')
      await page.click('input[name="password"]')
      await page.waitForSelector('input[name="password"]')
      await page.type('input[name="password"]', 'dddd')
      await page.waitForSelector('.css-186l5mh')
      await page.click('.css-186l5mh')
      await page.waitForXPath(
        '//div[contains(text(), "Password should contain min 8 characters")]',
      )
      expect(
        await page
          .$x(
            '//div[contains(text(), "Password should contain min 8 characters")]',
          )
          .then(async (elem) => page.evaluate((e) => e.textContent, elem[0])),
      ).toBe('Password should contain min 8 characters')

      await page.waitForXPath('//span[contains(text(), "Cancel")]')
      await page
        .$x('//span[contains(text(), "Cancel")]')
        .then(async (elements) => await elements[0].evaluate((e) => e.click()))

      await page.waitForXPath('//span[contains(text(), "Cancel")]')
      await page
        .$x('//span[contains(text(), "Cancel")]')
        .then(async (elements) => await elements[0].evaluate((e) => e.click()))

      await page.waitForXPath('//span[contains(text(), "Cancel")]')
      await page
        .$x('//span[contains(text(), "Cancel")]')
        .then(async (elements) => await elements[0].evaluate((e) => e.click()))
    } finally {
      await browser.close()
    }
  })
})
