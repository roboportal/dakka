import { IEventBlock, ITestCase } from '@/store/eventRecorderSlice'
import { exportOptions } from '@/store/utils/constants'

export abstract class ExportProcessor {
  abstract type: exportOptions
  abstract fileName: string
  abstract process(
    testCaseEvents: Record<string, IEventBlock[]>,
    testCaseMeta: ITestCase,
  ): string
}
