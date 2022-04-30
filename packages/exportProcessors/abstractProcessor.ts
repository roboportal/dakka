import { exportOptions } from '@roboportal/constants/exportOptions'
import { IEventBlock, ITestCase } from '@roboportal/types'

export abstract class ExportProcessor {
  abstract type: exportOptions
  abstract fileName: string
  abstract process(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
  ): string
}
