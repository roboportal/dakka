import { IEventBlock } from '@/store/eventRecorderSlice'
import { exportOptions } from '@/store/utils/constants'

export abstract class ExportProcessor {
  abstract type: exportOptions
  abstract fileName: string
  abstract process(events: IEventBlock[]): string
}
