import { EventListItem, IEventBlock } from 'store/eventRecorderSlice'
import { exportOptions } from './constants'
import { dump } from 'js-yaml'
import { PlaywrightProcessor } from './processors/playwrightProcessor'
import { CypressProcessor } from './processors/cypressProcessor'
import { ExportProcessor } from './processors/abstractProcessor'

export enum selectorTypes {
  role = 'role',
  labelText = 'label-text',
  placeholder = 'placeholder',
  text = 'text',
  className = 'classname',
  elementId = 'element-id',
  testId = 'test-id',
  uniquePath = 'unique-path',
}

export const selectorsFactoryMap: Record<selectorTypes, (v: string) => string> =
  {
    [selectorTypes.role]: (v) => `[role="${v}"]`,
    [selectorTypes.labelText]: (v) => `tag=label >> text="${v}"`,
    [selectorTypes.placeholder]: (v) => `[placeholder="${v}"]`,
    [selectorTypes.text]: (v) => `text="${v}"`,
    [selectorTypes.className]: (v) => `.${v}`,
    [selectorTypes.elementId]: (v) => `#${v}`,
    [selectorTypes.testId]: (v) => `data-test-id=${v}`,
    [selectorTypes.uniquePath]: (v) => v,
  }

class DakkaProcessor extends ExportProcessor {
  type = exportOptions.dakka
  fileName = 'dakka.yml'

  process(events: EventListItem[]) {
    return dump(events)
  }
}

const processorsEntries = [
  DakkaProcessor,
  CypressProcessor,
  PlaywrightProcessor,
].map((P) => {
  console.log('P', P)
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
