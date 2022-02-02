import { IEventBlock, IEventPayload } from 'store/eventRecorderSlice'
import { exportOptions } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { selectorTypes } from '../selectorTypes'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'

const selectorsPuppeteerFactoryMap: Record<
  selectorTypes,
  (v: IEventPayload) => string
> = {
  [selectorTypes.role]: (v) => `[role="${v?.selectedSelector?.value}"]`,
  [selectorTypes.labelText]: (v) =>
    `//${v?.tagName}[contains(., "${v?.selectedSelector?.value}")]`,
  [selectorTypes.placeholder]: (v) =>
    `[placeholder="${v?.selectedSelector?.value}"]`,
  [selectorTypes.text]: (v) =>
    `//${v?.tagName}[contains(., "${v?.selectedSelector?.value}")]`,
  [selectorTypes.className]: (v) =>
    `.${v?.selectedSelector?.value.replace(' ', '.')}`,
  [selectorTypes.elementId]: (v) => `#${v?.selectedSelector?.value}`,
  [selectorTypes.testId]: (v) => `data-test-id=${v?.selectedSelector?.value}`,
  [selectorTypes.uniquePath]: (v) => v?.selectedSelector?.value ?? '',
}

const selectorOptions: Record<string, string> = {
  [selectorTypes.text]: '$x',
  [selectorTypes.labelText]: '$x',
  default: '$',
}

const getByXpath = ({
  normalizedSelector,
  value,
}: {
  normalizedSelector: string
  value: string
}) =>
  `expect(await page.$x('${normalizedSelector}').then(async (elem) => page.evaluate((e) => ${value}, elem[0])))`

export class PuppeteerProcessor extends ExportProcessor {
  type = exportOptions.puppeteer
  fileName = 'puppeteer.spec.js'

  private methodsMap: Record<
    string,
    (it: { key: string; selector?: string }) => string
  > = {
    mouseClick: ({ selector }) =>
      selector ? `.click('${selector}')` : '.click()',
    keyboard: ({ key, selector }) =>
      selector
        ? `.type('${selector}', '${key ?? ''}')`
        : `.type('${key ?? ''}')`,
    default: () => '',
  }

  private getWrapper(testName: string, content: string) {
    return `const puppeteer = require('puppeteer');

describe('${testName}', () => {
  it('${testName}', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    try {
      ${content}
    } finally {
      await browser.close();
    }
  }) 
})`
  }

  private expectMethodsMap: Record<
    string,
    ({
      selector,
      assertionValue,
      assertionAttribute,
      selectorName,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
      selectorName: string
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

    [assertionTypes.toBeChecked]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.checked',
        })}.toBe(true)\n`
      }

      return `  expect(await page.$eval('${normalizedSelector}', e => e.checked)).toBe(true)\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `   ${getByXpath({
          normalizedSelector,
          value: 'e.checked',
        })}.toBe(false)\n`
      }

      return `  expect(await page.$eval('${normalizedSelector}', e => e.checked)).toBe(false)\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue, selectorName }) => {
      const normalizedSelector = normalizeString(selector)

      if (selectorOptions[selectorName] === '$x') {
        return `   ${getByXpath({
          normalizedSelector,
          value: 'e.textContent',
        })}.toBe('${assertionValue}')\n`
      }

      return `  expect(await page.$eval('${normalizedSelector}', e => e.textContent)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.textContent',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.textContent)).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).toBeDefined()\n`
    },

    [assertionTypes.notInDocument]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).toBeUndefined()\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }

      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.getAttribute('disabled'))).toBe(true)\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.getAttribute('disabled'))).toBe(null)\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `  ${getByXpath({
        normalizedSelector,
        value: 'e.getAttribute("disabled")',
      })}.toBe(null)\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.getAttribute('disabled'))).toBe(true)\n`
    },

    [assertionTypes.toBeHidden]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).toBeNull()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).not.toBeNull()\n`
    },

    [assertionTypes.toBeVisible]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.style.visibility',
        })}.not.toBe('hidden')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.style.visibility)).not.toBe('hidden')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.style.visibility',
        })}.not.toBe('visible')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.style.visibility)).not.toBe('visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      selectorName,
    }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: `e.getAttribute('${assertionAttribute}')`,
        })}.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.getAttribute('${assertionAttribute}'))).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      selectorName,
    }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: `e.getAttribute('${assertionAttribute}')`,
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.getAttribute('${assertionAttribute}'))).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.length',
        })}.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.length)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          normalizedSelector,
          value: 'e.length',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', e => e.length)).not.toBe('${assertionValue}')\n`
    },
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.type === '_redirect') {
        acc += '\n  await page.waitForNavigation()\n'
      }

      if (it.selectedSelector) {
        const selector = normalizeString(
          selectorsPuppeteerFactoryMap[
            it.selectedSelector.name as selectorTypes
          ](it),
        )
        const byXPath = selectorOptions[it?.selectedSelector?.name] === '$x'
        if (byXPath) {
          const key = normalizeString(it?.key)
          acc += `  
              await page.waitForXPath('${selector}')
              await page.$x('${selector}').then(async (elements) => {
                await elements[0]${
                  this.methodsMap[it?.type]?.({ key }) ??
                  this.methodsMap.default({ key })
                }
              })\n
        `
        } else {
          const payload = {
            key: normalizeString(it?.key),
            selector: normalizeString(selector),
          }

          acc += `  await page.waitForSelector('${payload.selector}')
              await page${
                this.methodsMap[it?.type]?.(payload) ??
                this.methodsMap.default(payload)
              }\n`
        }
      }

      if (it.type === 'Assertion') {
        const element = it.element
        const selector = normalizeString(
          selectorsPuppeteerFactoryMap[
            element?.selectedSelector?.name as selectorTypes
          ](element as IEventPayload),
        )
        const byXPath =
          selectorOptions[element?.selectedSelector?.name ?? ''] === '$x'
        if (element) {
          if (byXPath) {
            acc += `  await page.waitForXPath('${selector}')\n`
          } else {
            acc += `  await page.waitForSelector('${normalizeString(
              selector,
            )}')\n`
          }

          acc += this.expectMethodsMap[
            it?.assertionType?.type as assertionTypes
          ]({
            selector,
            selectorName: element?.selectedSelector?.name ?? '',
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
