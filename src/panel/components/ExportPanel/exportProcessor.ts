import { EventListItem } from 'store/eventRecorderSlice'
import { exportOptions } from './constants'
import { dump } from 'js-yaml'

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

const processorsEntries = [DakkaProcessor].map((P) => {
  const p = new P()
  return [p.type, p]
})

const processorsMap = Object.fromEntries(processorsEntries)

const getProcessor = (type: exportOptions): ExportProcessor =>
  processorsMap[type] ?? processorsMap[exportOptions.dakka]

export default function process(type: exportOptions, events: EventListItem[]) {
  const p = getProcessor(type)

  return {
    text: p.process(events),
    fileName: p.fileName,
  }
}
