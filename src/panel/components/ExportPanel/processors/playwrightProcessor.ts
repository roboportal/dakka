import { IEventBlock, IEventPayload, ISelector } from 'store/eventRecorderSlice'
import { exportOptions, interactiveTags } from '../constants'
import { assertionTypes } from 'constants/assertion'
import { selectorTypes } from '../selectorTypes'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { ASSERTION } from '../../../constants/actionTypes'

export class PlaywrightProcessor extends ExportProcessor {
  type = exportOptions.playwright
  fileName = 'playwright.spec.js'

  private methodsMap: Record<string, (it: IEventPayload) => string> = {
    mouseClick: () => '.click()',
    keyboard: ({ key }) => `.fill('${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private pageMethodsMap: Record<string, (it: IEventPayload) => string> = {
    keydown: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
    keyup: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
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

    [assertionTypes.toBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeChecked()\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeChecked()\n`
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

    [assertionTypes.toBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toBeVisible()\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toBeVisible()\n`
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

    [assertionTypes.toHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).toHaveCount('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({ selector, assertionValue }) => {
      const normalizedSelector = normalizeString(selector)
      return `  expect(await page.locator('${normalizedSelector}')).not.toHaveCount('${assertionValue}')\n`
    },
  }

  private generateSelector(it: IEventPayload | null) {
    if (!it?.selectedSelector) {
      return ''
    }

    const value = it.selectedSelector.value
    const name = it.selectedSelector.name
    if (name === selectorTypes.text) {
      return interactiveTags.includes(it.tagName ?? '')
        ? `${it.tagName}:has-text("${value}")`
        : `text="${value}"`
    }

    return `${value}`
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it) => {
      if (it.type === '_redirect') {
        acc += '\n  await page.waitForNavigation()\n'
      }

      const firstSelector =
        it.selectedSelector && (it.selectedSelector as ISelector)?.length > 1
          ? '.first()'
          : ''

      if (it.selectedSelector) {
        const selector = this.generateSelector(it)
        if (this.pageMethodsMap[it.type]) {
          acc += `  await page${this.pageMethodsMap[it?.type]?.(it)}\n`
        } else {
          const action =
            this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)
          acc += `  await page.locator('${normalizeString(
            selector,
          )}')${firstSelector}${action}\n`
        }
      }

      if (it.type === ASSERTION) {
        const element = it.element
        if (element) {
          const selector = this.generateSelector(element)
          acc += this.expectMethodsMap[
            it?.assertionType?.type as assertionTypes
          ]({
            selector: `${selector}${firstSelector}`,
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
