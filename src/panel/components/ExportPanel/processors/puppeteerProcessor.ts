import { IEventBlock, IEventPayload } from 'store/eventRecorderSlice'
import { exportOptions } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { selectorTypes } from '../selectorTypes'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { WAIT_FOR_ELEMENT, ASSERTION } from '../../../constants/actionTypes'

const selectorOptions: Record<string, string> = {
  [selectorTypes.text]: '$x',
  [selectorTypes.labelText]: '$x',
  default: '$',
}

const getByXpath = ({
  selector,
  value,
}: {
  selector: string | undefined
  value: string
}) =>
  `expect(await page.$x('${selector}').then(async (elem) => page.evaluate((e) => ${value}, elem[0])))`

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

  private pageMethodsMap: Record<string, (it: IEventPayload) => string> = {
    keydown: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
    keyup: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
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
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.checked',
        })}.toBe(true)\n`
      }

      return `  expect(await page.$eval('${selector}', e => e.checked)).toBe(true)\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `   ${getByXpath({
          selector,
          value: 'e.checked',
        })}.toBe(false)\n`
      }

      return `  expect(await page.$eval('${selector}', e => e.checked)).toBe(false)\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `   ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.toContain('${assertionValue}')\n`
      }

      return `  expect(await page.$eval('${selector}', e => e.textContent)).toContain('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.not.toContain('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${selector}', e => e.textContent)).not.toContain('${assertionValue}')\n`
    },

    [assertionTypes.equals]: ({ selector, assertionValue, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `   ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.toBe('${assertionValue}')\n`
      }

      return `  expect(await page.$eval('${selector}', e => e.textContent)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notEquals]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${selector}', e => e.textContent)).not.toBe('${assertionValue}')\n`
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
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }

      return `  expect(await page.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe(true)\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `  expect(await page.$eval('${normalizedSelector}', (e) => e.getAttribute('disabled'))).toBe(null)\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `  expect(await page.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe(null)\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }
      return `  expect(await page.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe(true)\n`
    },

    [assertionTypes.toBeHidden]: ({ selector, selectorName }) => {
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${selector}')).toBeNull()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector, selectorName }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).not.toBeNull()\n`
    },

    [assertionTypes.toBeVisible]: ({ selector, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.style.visibility',
        })}.not.toBe('hidden')\n`
      }
      return `  expect(await page.$eval('${selector}', e => e.style.visibility)).not.toBe('hidden')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector, selectorName }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.style.visibility',
        })}.not.toBe('visible')\n`
      }
      return `  expect(await page.$eval('${selector}', e => e.style.visibility)).not.toBe('visible')\n`
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
          selector,
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
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: `e.getAttribute('${assertionAttribute}')`,
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$eval('${selector}', e => e.getAttribute('${assertionAttribute}'))).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.length',
        })}.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$$eval('${selector}', e => e.length)).toBe(${Number(
        assertionValue,
      )})\n`
    },

    [assertionTypes.notToHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
    }) => {
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.length',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await page.$$eval('${selector}', e => e.length)).not.toBe(${Number(
        assertionValue,
      )})\n`
    },
  }

  private generateSelector(it: IEventPayload | null) {
    if (!it?.selectedSelector) {
      return ''
    }

    const value = it.selectedSelector.value
    const name = it.selectedSelector.name
    const tagName = it.selectedSelector.tagName
    if (name === selectorTypes.text) {
      return normalizeString(`//${tagName}[contains(text(), "${value}")]`)
    }

    return normalizeString(value)
  }

  private generateAction(it: IEventPayload) {
    const selector = this.generateSelector(it)
    const key = normalizeString(it?.key)
    const payload = { key, selector }

    if (this.pageMethodsMap[it.type]) {
      return `  await page${this.pageMethodsMap[it?.type]?.(it)}\n`
    }

    if (selectorOptions[it?.selectedSelector?.name ?? ''] === '$x') {
      return `  
      await page.waitForXPath('${selector}')
      await page.$x('${selector}').then(async (elements) => await elements[0].evaluate((e) => e${
        this.methodsMap[it?.type]?.({ key }) ?? this.methodsMap.default({ key })
      }))\n`
    }

    return `  await page.waitForSelector('${payload.selector}')
        await page${
          this.methodsMap[it?.type]?.(payload) ??
          this.methodsMap.default(payload)
        }\n`
  }

  private waitForElement(selector: string, element: IEventPayload | null) {
    const byXPath =
      selectorOptions[element?.selectedSelector?.name ?? ''] === '$x'

    if (byXPath) {
      return `  await page.waitForXPath('${selector}')\n`
    }

    return `  await page.waitForSelector('${selector}')\n`
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.selectedSelector) {
        acc += this.generateAction(it)
      }

      if (it.type === ASSERTION) {
        const element = it.element
        const selector = this.generateSelector(element) ?? ''

        if (element) {
          acc += this.waitForElement(selector, element)

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

      if (it.type === WAIT_FOR_ELEMENT) {
        const element = it.element
        const selector = this.generateSelector(element) ?? ''
        acc += this.waitForElement(selector, element)
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
