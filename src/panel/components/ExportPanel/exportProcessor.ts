import { dump } from 'js-yaml'
import { IEventBlock } from '@/store/eventRecorderSlice'
import { exportOptions } from '@/store/utils/constants'
import { PlaywrightProcessor } from './processors/playwrightProcessor'
import { CypressProcessor } from './processors/cypressProcessor'
import { ExportProcessor } from './processors/abstractProcessor'
import { PuppeteerProcessor } from './processors/puppeteerProcessor'

class DakkaProcessor extends ExportProcessor {
  type = exportOptions.dakka
  fileName = 'dakka.yml'

  process(events: IEventBlock[]) {
    return dump(events)
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

export default function process(type: exportOptions, events: IEventBlock[]) {
  const p = getProcessor(type)
  return {
    text: p.process(events),
    fileName: p.fileName,
  }
}
