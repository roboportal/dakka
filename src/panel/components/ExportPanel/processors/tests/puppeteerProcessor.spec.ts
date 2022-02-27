import { PuppeteerProcessor } from '../puppeteerProcessor'
import { IEventBlock } from '@/store/eventRecorderSlice'
import events from './events.json'

describe('puppeteerProcessor', () => {
  it('generates correct test file', () => {
    const result = new PuppeteerProcessor().process(events as IEventBlock[])
    const expected = `const puppeteer = require('puppeteer');

describe('Testing https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', () => {
  it('Testing https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    try {
      await page.setViewport({ width: 1440, height: 629 })
      await page.goto('https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8')
          
      await page.waitForSelector('input[aria-label="Search"]:not([disabled])')
      await page.click('input[aria-label="Search"]')
      
      await page.waitForSelector('input[aria-label="Search"]:not([disabled])')
      await page.type('input[aria-label="Search"]', 'ff')
      
      await page.waitForSelector('div#rcnt:not([disabled])')
      await page.click('div#rcnt', { clickCount: 2 })
      await page.setViewport({ width: 1309, height: 539 })      await page.keyboard.press('Backspace')
      await page.waitForSelector('input[aria-label="Search"]')
  expect(await page.$eval('input[aria-label="Search"]', e => e.getAttribute('class'))).toBe('gLFyf gsfi')
      await page.waitForXPath('//b[contains(text(), "light download")]')

    } finally {
      await browser.close();
    }
  }) 
})`

    expect(result).toStrictEqual(expected)
  })
})
