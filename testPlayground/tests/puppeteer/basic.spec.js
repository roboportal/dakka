const puppeteer = require('puppeteer')

describe('Testing https://vg05y.csb.app/', () => {
  it('Testing https://vg05y.csb.app/', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
      await page.goto('https://vg05y.csb.app/')
      await page.$x("//*[contains(., 'First Name')]").then(async (elements) => {
        await elements[0].click()
      })

      expect(await page.$('h1')).toBeDefined()
    } finally {
      await browser.close()
    }
  })
})
