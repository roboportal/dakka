import { IEventBlock } from '@/store/eventRecorderSlice'
import { exportOptions } from '@/store/utils/constants'
import { assertionTypes } from '@/constants/assertion'
import { selectorTypes } from '../selectorTypes'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { WAIT_FOR_ELEMENT, ASSERTION } from '../../../constants/actionTypes'
import { resize } from '../../../constants/browserEvents'

const selectorOptions: Record<string, string> = {
  [selectorTypes.text]: '$x',
  default: '$',
}

const getByXpath = ({
  selector,
  value,
}: {
  selector: string | undefined
  value: string
}) =>
  `    expect(await page.$x('${selector}').then(async (elem) => page.evaluate((e) => ${value}, elem[0])))`

export class PuppeteerProcessor extends ExportProcessor {
  type = exportOptions.puppeteer
  fileName = 'puppeteer.spec.js'

  private methodsMap: Record<
    string,
    (it: { key: string; selector?: string }) => string
  > = {
    mouseClick: ({ selector }) =>
      selector ? `.click('${selector}')` : '.click()',
    dblclick: ({ selector }) =>
      selector
        ? `.click('${selector}', { clickCount: 2 })`
        : '.click({ clickCount: 2 })',
    keyboard: ({ key, selector }) =>
      selector
        ? `.type('${selector}', '${key ?? ''}')`
        : `.type('${key ?? ''}')`,
    default: () => '',
  }

  private pageMethodsMap: Record<string, (it: IEventBlock) => string> = {
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
      isIframe,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
      selectorName: string
      isIframe: boolean
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({ assertionValue, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      return `      expect(await ${scope}.title()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      return `      expect(await ${scope}.title()).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      return `      expect(${scope}.url()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      return `      expect(${scope}.url()).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.checked',
        })}.toBe(true)\n`
      }

      return `      expect(await ${scope}.$eval('${selector}', e => e.checked)).toBe(true)\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.checked',
        })}.toBe(false)\n`
      }

      return `      expect(await ${scope}.$eval('${selector}', e => e.checked)).toBe(false)\n`
    },

    [assertionTypes.contains]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.toContain('${assertionValue}')\n`
      }

      return `      expect(await ${scope}.$eval('${selector}', e => e.textContent)).toContain('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.not.toContain('${assertionValue}')\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', e => e.textContent)).not.toContain('${assertionValue}')\n`
    },

    [assertionTypes.equals]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.toBe('${assertionValue}')\n`
      }

      return `      expect(await ${scope}.$eval('${selector}', e => e.textContent)).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notEquals]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.textContent',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', e => e.textContent)).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      const normalizedSelector = normalizeString(selector)
      return `      expect(await ${scope}.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).toBeDefined()\n`
    },

    [assertionTypes.notInDocument]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      const normalizedSelector = normalizeString(selector)
      return `      expect(await ${scope}.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).toBeUndefined()\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }

      return `      expect(await ${scope}.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe('disabled')\n`
    },

    [assertionTypes.notToBeDisabled]: ({
      selector,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `      expect(await ${scope}.$eval('${normalizedSelector}', (e) => e.getAttribute('disabled'))).toBe(null)\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(null)\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe(null)\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.getAttribute("disabled")',
        })}.toBe(true)\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', (e) => e.getAttribute('disabled'))).toBe('disabled')\n`
    },

    [assertionTypes.toBeHidden]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      return `      expect(await ${scope}.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${selector}')).toBeNull()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      const normalizedSelector = normalizeString(selector)
      return `      expect(await ${scope}.${
        selectorOptions[selectorName] ?? selectorOptions.default
      }('${normalizedSelector}')).not.toBeNull()\n`
    },

    [assertionTypes.toBeVisible]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.style.visibility',
        })}.not.toBe('hidden')\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', e => e.style.visibility)).not.toBe('hidden')\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector, selectorName, isIframe }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.style.visibility',
        })}.not.toBe('visible')\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', e => e.style.visibility)).not.toBe('visible')\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      const normalizedSelector = normalizeString(selector)
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: `e.getAttribute('${assertionAttribute}')`,
        })}.toBe('${assertionValue}')\n`
      }
      return `      expect(await ${scope}.$eval('${normalizedSelector}', e => e.getAttribute('${assertionAttribute}'))).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: `e.getAttribute('${assertionAttribute}')`,
        })}.not.toBe('${assertionValue}')\n`
      }
      return `      expect(await ${scope}.$eval('${selector}', e => e.getAttribute('${assertionAttribute}'))).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.length',
        })}.toBe('${assertionValue}')\n`
      }
      return `  expect(await ${scope}.$$eval('${selector}', e => e.length)).toBe(${Number(
        assertionValue,
      )})\n`
    },

    [assertionTypes.notToHaveLength]: ({
      selector,
      assertionValue,
      selectorName,
      isIframe,
    }) => {
      const scope = isIframe ? 'frame' : 'page'
      if (selectorOptions[selectorName] === '$x') {
        return `  ${getByXpath({
          selector,
          value: 'e.length',
        })}.not.toBe('${assertionValue}')\n`
      }
      return `  expect(await ${scope}.$$eval('${selector}', e => e.length)).not.toBe(${Number(
        assertionValue,
      )})\n`
    },
  }

  private generateSelector(it: IEventBlock | null | undefined) {
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

  private generateIframeSelector(it: IEventBlock) {
    const defaultSelector = {
      name: 'src',
      tagName: 'iframe',
      value: `iframe[src="${it.url ?? it.element?.url}"]`,
    }
    return this.generateSelector({
      selectedSelector:
        it?.selectedIframeSelector ??
        it?.element?.selectedIframeSelector ??
        defaultSelector,
    } as IEventBlock)
  }

  private generateAction(it: IEventBlock) {
    const selector = this.generateSelector(it)
    const key = normalizeString(it?.key)
    const payload = { key, selector }
    const scope = it.isInIframe ? 'frame' : 'page'

    if (this.pageMethodsMap[it.type]) {
      return `      await ${scope}${this.pageMethodsMap[it?.type]?.(it)}\n`
    }

    if (selectorOptions[it?.selectedSelector?.name ?? ''] === '$x') {
      return `  
      await ${scope}.waitForXPath('${selector}[not(@disabled)]')
      await ${scope}.$x('${selector}').then(async (elements) => await elements[0].evaluate((e) => e${
        this.methodsMap[it?.type]?.({ key }) ?? this.methodsMap.default({ key })
      }))\n`
    }

    return `      
      await ${scope}.waitForSelector('${payload.selector}:not([disabled])')
      await ${scope}${
      this.methodsMap[it?.type]?.(payload) ?? this.methodsMap.default(payload)
    }\n`
  }

  private waitForElement(
    selector: string,
    element: IEventBlock | null | undefined,
  ) {
    const byXPath =
      selectorOptions[element?.selectedSelector?.name ?? ''] === '$x'

    const scope = element?.isInIframe ? 'frame' : 'page'
    if (byXPath) {
      return `      await ${scope}.waitForXPath('${selector}')\n`
    }

    return `      await ${scope}.waitForSelector('${selector}')\n`
  }

  private generateIframeInit(it: IEventBlock) {
    const selector = this.generateIframeSelector(it)

    return `
      frameHandle = await page.$('${selector}')
      frame = await frameHandle.contentFrame()\n`
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      const isInIframe = it.element?.isInIframe ?? it.isInIframe

      if (isInIframe) {
        acc += this.generateIframeInit(it)
      }

      if (it.selectedSelector) {
        acc += this.generateAction(it)
      }

      if (it.type === ASSERTION) {
        const element = it.element
        const selector = this.generateSelector(element) ?? ''

        if (selector) {
          acc += this.waitForElement(selector, element)
        }

        acc += this.expectMethodsMap[it?.assertionType?.type as assertionTypes](
          {
            selector,
            selectorName: element?.selectedSelector?.name ?? '',
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
            isIframe: it.isInIframe ?? it.element?.isInIframe ?? false,
          },
        )
      }

      if (it.type === WAIT_FOR_ELEMENT) {
        const element = it.element
        const selector = this.generateSelector(element) ?? ''
        acc += this.waitForElement(selector, element)
      }

      if (it.type === resize) {
        acc += this.setViewPort(it.innerWidth, it.innerHeight)
      }

      return acc
    }, '')
  }

  private getGoToTestedPage(url = '', innerWidth = 0, innerHeight = 0) {
    return `await page.setViewport({ width: ${innerWidth}, height: ${innerHeight} })
      await page.goto('${url}')`
  }

  private setViewPort(innerWidth = 0, innerHeight = 0) {
    return `      await page.setViewport({ width: ${innerWidth}, height: ${innerHeight} })`
  }

  private getIframeVariables(events: IEventBlock[]) {
    const shouldCreateVariables = events.some(
      (it) => it.element?.isInIframe ?? it.isInIframe,
    )

    if (shouldCreateVariables) {
      return `
      let frameHandle = null
      let frame = null`
    }
    return ''
  }

  private getContent(events: IEventBlock[]) {
    const [{ url, innerWidth, innerHeight }, ...restEvents] = events
    return `${this.getGoToTestedPage(url, innerWidth, innerHeight)}
${this.getIframeVariables(events)}
${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: IEventBlock[]) {
    const firstRedirect = events[0]
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events))
  }
}
