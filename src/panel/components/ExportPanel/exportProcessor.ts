import { EventListItem, IEventPayload } from 'store/eventRecorderSlice'
import { exportOptions } from './constants'
import { dump } from 'js-yaml'

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

const normalizeString = (str: string) =>
  // eslint-disable-next-line
  str.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(`'`, `\\'`)

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

  private serializeRecordedEvents(events: IEventPayload[]) {
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
      return acc
    }, '')
  }

  private getContent(events: IEventPayload[]) {
    const [firstEvent, ...restEvents] = events as IEventPayload[]
    return `${this.getGoToTestedPage(firstEvent.url ?? '')}
${this.serializeRecordedEvents(restEvents)}`
  }

  process(events: EventListItem[]) {
    const firstRedirect = events[0] as IEventPayload
    const testName = `Testing ${firstRedirect.url}`

    return this.getWrapper(testName, this.getContent(events as IEventPayload[]))
  }
}

const processorsEntries = [PlaywrightProcessor, DakkaProcessor].map((P) => {
  const p = new P()
  return [p.type, p]
})

const processorsMap = Object.fromEntries(processorsEntries)

const getProcessor = (type: exportOptions): ExportProcessor =>
  processorsMap[type] ?? processorsMap[exportOptions.dakka]

export default function process(type: exportOptions, events: EventListItem[]) {
  const p = getProcessor(type)
  console.log(p)
  return {
    text: p.process(events),
    fileName: p.fileName,
  }
}
