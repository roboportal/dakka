import { IEventBlock } from 'store/eventRecorderSlice'
import { exportOptions } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { selectorTypes } from '../exportProcessor'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'

const selectorsPuppeteerFactoryMap: Record<
  selectorTypes,
  (v: string) => string
> = {
  [selectorTypes.role]: (v) => `[role="${v}"]`,
  [selectorTypes.labelText]: (v) => `tag=label >> text="${v}"`,
  [selectorTypes.placeholder]: (v) => `[placeholder="${v}"]`,
  [selectorTypes.text]: (v) => `text="${v}"`,
  [selectorTypes.className]: (v) => `.${v}`,
  [selectorTypes.elementId]: (v) => `#${v}`,
  [selectorTypes.testId]: (v) => `data-test-id=${v}`,
  [selectorTypes.uniquePath]: (v) => v,
}

export class PuppeteerProcessor extends ExportProcessor {
  type = exportOptions.puppeteer
  fileName = 'puppeteer.spec.js'

  private methodsMap: Record<
    string,
    (it: { key: string; selector: string }) => string
  > = {
    mouseClick: ({ selector }) => `.click(${selector})`,
    keyboard: ({ key, selector }) =>
      `.type('${selector}', '${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private getWrapper(testName: string, content: string) {
    return `const puppeteer = require('puppeteer');
    
test('${testName}', async ({ page }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage()

  try {
    ${content}
  } finally {
    await browser.close();
  }
})`
  }

  private expectMethodsMap: Record<
    string,
    ({
      selector,
      assertionValue,
      assertionAttribute,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({ assertionValue }) => {
      return `  expect(await page.title()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `  expect(await page.title()).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `  expect(page.url()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `  expect(page.url()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.checked)).toBe(true)\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.checked)).toBe(false)\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.textContent)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.textContent)).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$('${normalizedSelector}')).toBe(true)\n`
    },

    [assertionTypes.notInDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$('${normalizedSelector}')).toBe(false)\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.disabled)).toBe(true)\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.disabled)).toBe(false)\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.disabled)).toBe(false)\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.disabled)).toBe(true)\n`
    },

    [assertionTypes.toBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$('${normalizedSelector}')).toBeHidden()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$('${normalizedSelector}')).not.toBeHidden()\n`
    },

    [assertionTypes.toBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.style.visibility)).toBe('visible')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.style.visibility)).not.toBe('visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.${assertionAttribute})).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.${assertionAttribute})).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.length)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.$eval('${normalizedSelector}', e => e.length)).not.toBe('${assertionValue}')\n`
    },
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.type === '_redirect') {
        acc += '\n  await page.waitForNavigation()\n'
      }
      if (it.selectedSelector) {
        const selector = selectorsPuppeteerFactoryMap[
          it.selectedSelector.name as selectorTypes
        ](it.selectedSelector.value)
        const payload = {
          key: normalizeString(it?.key),
          selector: normalizeString(selector),
        }
        acc += `  await page.${
          this.methodsMap[it?.type]?.(payload) ??
          this.methodsMap.default(payload)
        }\n`
      }
      if (it.type === 'Assertion') {
        const element = it.element
        if (element) {
          const selector = selectorsPuppeteerFactoryMap[
            element?.selectedSelector?.name as selectorTypes
          ](element?.selectedSelector?.value ?? '')
          acc += this.expectMethodsMap[
            it?.assertionType?.type as assertionTypes
          ]({
            selector,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
          })
        }
      }
      return acc
    }, '')
  }

  private getGoToTestedPage(url: string) {
    return `await page.goto('${url}')`
  }

  private getContent(events: IEventBlock[]) {
    const [firstEvent, ...restEvents] = events
    return `${this.getGoToTestedPage(firstEvent.url ?? '')}
    ${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: IEventBlock[]) {
    const firstRedirect = events[0]
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events))
  }
}
