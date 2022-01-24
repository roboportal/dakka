import {
  EventListItem,
  IEventBlock,
  IEventPayload,
} from 'store/eventRecorderSlice'
import { exportOptions } from './constants'
import { dump } from 'js-yaml'

import { assertionTypes } from 'constants/assertion'

enum selectorTypes {
  role = 'role',
  labelText = 'label-text',
  placeholder = 'placeholder',
  text = 'text',
  className = 'classname',
  elementId = 'element-id',
  testId = 'test-id',
  uniquePath = 'unique-path',
}

const selectorsFactoryMap: Record<selectorTypes, (v: string) => string> = {
  [selectorTypes.role]: (v) => `[role="${v}"]`,
  [selectorTypes.labelText]: (v) => `tag=label >> text="${v}"`,
  [selectorTypes.placeholder]: (v) => `[placeholder="${v}"]`,
  [selectorTypes.text]: (v) => `text="${v}"`,
  [selectorTypes.className]: (v) => `.${v}`,
  [selectorTypes.elementId]: (v) => `#${v}`,
  [selectorTypes.testId]: (v) => `data-test-id=${v}`,
  [selectorTypes.uniquePath]: (v) => v,
}

const normalizeString = (str: string | undefined) => {
  if (!str) {
    return ''
  }
  // eslint-disable-next-line
  str.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(`'`, `\\'`)
}

abstract class ExportProcessor {
  abstract type: exportOptions
  abstract fileName: string
  abstract process(events: EventListItem[]): string
}

class DakkaProcessor extends ExportProcessor {
  type = exportOptions.dakka
  fileName = 'dakka.yml'

  process(events: EventListItem[]) {
    return dump(events)
  }
}

class PlaywrightProcessor extends ExportProcessor {
  type = exportOptions.playwright
  fileName = 'playwright.spec.js'

  private methodsMap: Record<string, (it: IEventPayload) => string> = {
    mouseClick: () => '.click()',
    keyboard: ({ key }) => `.fill('${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private getWrapper(testName: string, content: string) {
    return `const { test, expect } = require('@playwright/test')
    
test('${testName}', async ({ page }) => {
  ${content}
})`
  }

  private getGoToTestedPage(url: string) {
    return `await page.goto('${url}')`
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
      return `  expect(page).toHaveTitle('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `  expect(page).not.toHaveTitle('${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `  expect(page).toHaveURL('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `  expect(page).not.toHaveURL('${assertionValue}')\n`
    },

    [assertionTypes.contains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}').textContent()).toBe('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}').textContent()).not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeTruthy()\n`
    },

    [assertionTypes.notInDocument]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeTruthy()\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeDisabled()\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeDisabled()\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeEnabled()\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeEnabled()\n`
    },

    [assertionTypes.toBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeHidden()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeHidden()\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}').getAttribute('${assertionAttribute}')).toBe('${assertionValue}')`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `expect(await page.locator('${normalizedSelector}').getAttribute('${assertionAttribute}')).not.toBe('${assertionValue}')`
    },
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.type === '_redirect') {
        acc += '\n  await page.waitForNavigation()\n'
      }

      if (it.selectedSelector) {
        const selector = selectorsFactoryMap[
          it.selectedSelector.name as selectorTypes
        ](it.selectedSelector.value)
        acc += `  await page.locator('${normalizeString(selector)}')${
          this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)
        }\n`
      }

      if (it.type === 'Assertion') {
        const element = it.element
        if (element) {
          const selector = selectorsFactoryMap[
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

const processorsEntries = [PlaywrightProcessor, DakkaProcessor].map((P) => {
  const p = new P()
  return [p.type, p]
})

const processorsMap = Object.fromEntries(processorsEntries)

const getProcessor = (type: exportOptions): ExportProcessor =>
  processorsMap[type] ?? processorsMap[exportOptions.dakka]

export default function process(type: exportOptions, events: IEventBlock[]) {
  const p = getProcessor(type)
  return {
    text: p.process(events),
    fileName: p.fileName,
  }
}
