import { dump } from 'js-yaml'
import { IEventBlock, ITestCase } from '@/store/eventRecorderSlice'
import { exportOptions } from '@/store/utils/constants'
import { PlaywrightProcessor } from './processors/playwrightProcessor'
import { CypressProcessor } from './processors/cypressProcessor'
import { ExportProcessor } from './processors/abstractProcessor'
import { PuppeteerProcessor } from './processors/puppeteerProcessor'

class DakkaProcessor extends ExportProcessor {
  type = exportOptions.dakka
  fileName = 'dakka.yml'

  process(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
  ) {
    const testName = testCaseMeta.describe || 'Dakka test'
    const test = {
      describe: testName,
      cases: testCaseMeta.its.map((it) => {
        return {
          it: it.value,
          events: testCaseEvents[it.id],
        }
      }),
    }
    return dump(test)
  }
}

const processorsEntries = [
  DakkaProcessor,
  CypressProcessor,
  PlaywrightProcessor,
  PuppeteerProcessor,
].map((P) => {
  const p = new P()
  return [p.type, p]
})

const processorsMap = Object.fromEntries(processorsEntries)

const getProcessor = (type: exportOptions): ExportProcessor =>
  processorsMap[type] ?? processorsMap[exportOptions.dakka]

export default function process(
  type: exportOptions,
  testCaseEvents: Record<string, IEventBlock[]>,
  testCaseMeta: ITestCase,
) {
  const p = getProcessor(type)
  return {
    text: p.process(testCaseEvents, testCaseMeta),
    fileName: p.fileName,
  }
}
