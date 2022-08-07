import { dump } from 'js-yaml'

import { IEventBlock, ITestCase } from '@roboportal/types'
import { exportOptions } from '@roboportal/constants/exportOptions'

import { PlaywrightProcessor } from '@roboportal/export_processors/playwrightProcessor'
import { CypressProcessor } from '@roboportal/export_processors/cypressProcessor'
import { ExportProcessor } from '@roboportal/export_processors/abstractProcessor'
import { PuppeteerProcessor } from '@roboportal/export_processors/puppeteerProcessor'
import { DescribeProcessor } from '@roboportal/export_processors/describeProcessor'

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
  DescribeProcessor,
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
