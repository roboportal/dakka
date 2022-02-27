import { PlaywrightProcessor } from '../playwrightProcessor'
import { IEventBlock } from '@/store/eventRecorderSlice'
import events from './events.json'

describe('playwrightProcessor', () => {
  it('generates correct test file', () => {
    const result = new PlaywrightProcessor().process(events as IEventBlock[])
    const expected = `const { test, expect } = require('@playwright/test')
    
test('Testing https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 629 })
  await page.goto('https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j35i39l2j0i433i512j69i60j69i61l3.1477j0j4&sourceid=chrome&ie=UTF-8')
  await page.click('input[aria-label="Search"]')
  await page.fill('input[aria-label="Search"]', 'ff')
  await page.locator('div#rcnt').dblclick()
  await page.setViewportSize({ width: 1309, height: 539 })  await page.keyboard.press('Backspace')
  await expect(page.locator('input[aria-label="Search"]').getAttribute('class')).toBe('gLFyf gsfi')
})`
    expect(result).toStrictEqual(expected)
  })
})
