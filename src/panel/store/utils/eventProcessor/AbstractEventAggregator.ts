import { IEventBlock } from '@roboportal/types'

abstract class AbstractEventAggregator {
  abstract aggregatedEventName: string
  abstract shouldProcess(event: IEventBlock): boolean
  abstract process(event: IEventBlock, events: IEventBlock[]): void
}

export default AbstractEventAggregator
