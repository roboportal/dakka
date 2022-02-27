import { IEventBlock, ISelector } from '@/store/eventRecorderSlice'
import { exportOptions, INTERACTIVE_TAGS } from '../constants'
import { assertionTypes } from '@/constants/assertion'
import { selectorTypes } from '../selectorTypes'
import { normalizeString } from '../normalizer'
import { ExportProcessor } from './abstractProcessor'
import { ASSERTION } from '../../../constants/actionTypes'
import { redirect, resize } from '../../../constants/browserEvents'

export class PlaywrightProcessor extends ExportProcessor {
  type = exportOptions.playwright
  fileName = 'playwright.spec.js'

  private methodsMap: Record<string, (it: IEventBlock) => string> = {
    mouseClick: () => '.click()',
    dblclick: () => '.dblclick()',
    keyboard: ({ key }) => `.fill('${normalizeString(key ?? '')}')`,
    default: () => '',
  }

  private pageMethodsMap: Record<
    string,
    (it: IEventBlock, selector?: string) => string
  > = {
    keyboard: ({ key }, selector) =>
      `.fill('${normalizeString(selector)}', '${normalizeString(key ?? '')}')`,
    keydown: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
    mouseClick: (it, selector) => `.click('${normalizeString(selector)}')`,
    keyup: ({ key }) => (key ? `.keyboard.press('${key}')` : ''),
    default: () => '',
  }

  private getWrapper(testName: string, content: string) {
    const isAssertion = content?.indexOf('expect') > -1

    return `const { test${
      isAssertion ? ', expect' : ''
    } } = require('@playwright/test')
    
test('${testName}', async ({ page }) => {
  ${content}
})`
  }

  private getGoToTestedPage(url = '', innerWidth = 0, innerHeight = 0) {
    return `await page.setViewportSize({ width: ${innerWidth}, height: ${innerHeight} })
  await page.goto('${url}')`
  }

  private setViewPort(innerWidth = 0, innerHeight = 0) {
    return `  await page.setViewportSize({ width: ${innerWidth}, height: ${innerHeight} })`
  }

  private expectMethodsMap: Record<
    string,
    ({
      selector,
      assertionValue,
      assertionAttribute,
      firstSelector,
    }: {
      selector?: string
      assertionValue?: string
      assertionAttribute?: string
      firstSelector: string
    }) => string
  > = {
    [assertionTypes.toHaveTitle]: ({ assertionValue }) => {
      return `  await expect(page).toHaveTitle('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveTitle]: ({ assertionValue }) => {
      return `  await expect(page).not.toHaveTitle('${assertionValue}')\n`
    },

    [assertionTypes.toHaveURL]: ({ assertionValue }) => {
      return `  await expect(page).toHaveURL('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveURL]: ({ assertionValue }) => {
      return `  await expect(page).not.toHaveURL('${assertionValue}')\n`
    },

    [assertionTypes.toBeChecked]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeChecked()\n`
    },

    [assertionTypes.notToBeChecked]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeChecked()\n`
    },

    [assertionTypes.contains]: ({
      selector,
      assertionValue,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toContainText('${assertionValue}')\n`
    },

    [assertionTypes.notContains]: ({
      selector,
      assertionValue,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toContainText('${assertionValue}')\n`
    },

    [assertionTypes.equals]: ({ selector, assertionValue, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toHaveText('${assertionValue}')\n`
    },

    [assertionTypes.notEquals]: ({
      selector,
      assertionValue,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toHaveText('${assertionValue}')\n`
    },

    [assertionTypes.inDocument]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeTruthy()\n`
    },

    [assertionTypes.notInDocument]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeTruthy()\n`
    },

    [assertionTypes.toBeDisabled]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeDisabled()\n`
    },

    [assertionTypes.notToBeDisabled]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeDisabled()\n`
    },

    [assertionTypes.toBeEnabled]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeEnabled()\n`
    },

    [assertionTypes.notToBeEnabled]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeEnabled()\n`
    },

    [assertionTypes.toBeHidden]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeHidden()\n`
    },

    [assertionTypes.notToBeHidden]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeHidden()\n`
    },

    [assertionTypes.toBeVisible]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).toBeVisible()\n`
    },

    [assertionTypes.notToBeVisible]: ({ selector, firstSelector }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}')${firstSelector}).not.toBeVisible()\n`
    },

    [assertionTypes.hasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}').getAttribute('${assertionAttribute}'))${firstSelector}.toBe('${assertionValue}')\n`
    },

    [assertionTypes.notHasAttribute]: ({
      selector,
      assertionValue,
      assertionAttribute,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}').getAttribute('${assertionAttribute}'))${firstSelector}.not.toBe('${assertionValue}')\n`
    },

    [assertionTypes.toHaveLength]: ({
      selector,
      assertionValue,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}'))${firstSelector}.toHaveCount('${assertionValue}')\n`
    },

    [assertionTypes.notToHaveLength]: ({
      selector,
      assertionValue,
      firstSelector,
    }) => {
      const normalizedSelector = normalizeString(selector)
      return `  await expect(page.locator('${normalizedSelector}'))${firstSelector}.not.toHaveCount('${assertionValue}')\n`
    },
  }

  private generateSelector(it: IEventBlock | null) {
    if (!it?.selectedSelector) {
      return ''
    }

    const value = it.selectedSelector.value
    const name = it.selectedSelector.name
    const tagName = it.selectedSelector.tagName
    if (name === selectorTypes.text) {
      return INTERACTIVE_TAGS.includes(tagName ?? '')
        ? `${tagName}:has-text("${value}")`
        : `text="${value}"`
    }

    return `${value}`
  }

  private serializeRedirect({
    playwrightAction,
    nextEventIndex,
    events,
  }: {
    playwrightAction: string
    nextEventIndex: number
    events: IEventBlock[]
  }) {
    if (events?.[nextEventIndex]?.type === redirect) {
      return `  await Promise.all([
    page.waitForNavigation(),
    ${playwrightAction},
  ])\n`
    }
    return `  await ${playwrightAction}\n`
  }

  private serializeRecordedEvents(events: IEventBlock[]) {
    return events.reduce((acc, it, index) => {
      const firstSelector =
        it.selectedSelector && (it.selectedSelector as ISelector)?.length > 1
          ? '.first()'
          : ''

      if (it.selectedSelector) {
        const selector = this.generateSelector(it)
        if (this.pageMethodsMap[it.type]) {
          acc += `  await page${this.pageMethodsMap[it?.type]?.(
            it,
            selector,
          )}\n`
        } else {
          const eventAction =
            this.methodsMap[it?.type]?.(it) ?? this.methodsMap.default(it)

          const playwrightAction = `page.locator('${normalizeString(
            selector,
          )}')${firstSelector}${eventAction}`

          acc += this.serializeRedirect({
            playwrightAction,
            nextEventIndex: index + 1,
            events,
          })
        }
      }

      if (it.type === ASSERTION) {
        const element = it.element
        const firstSelector =
          element && (element.selectedSelector as ISelector)?.length > 1
            ? '.first()'
            : ''
        const selector = element ? this.generateSelector(element) : ''

        acc += this.expectMethodsMap[it?.assertionType?.type as assertionTypes](
          {
            selector,
            firstSelector,
            assertionValue: it.assertionValue,
            assertionAttribute: it.assertionAttribute,
          },
        )
      }

      if (it.type === resize) {
        acc += this.setViewPort(it.innerWidth, it.innerHeight)
      }

      return acc
    }, '')
  }

  private getContent(events: IEventBlock[]) {
    const [{ url, innerWidth, innerHeight }, ...restEvents] = events
    return `${this.getGoToTestedPage(url, innerWidth, innerHeight)}
${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: IEventBlock[]) {
    const firstRedirect = events[0]
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events))
  }
}
