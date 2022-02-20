import { IEventBlock } from '../../eventRecorderSlice'

abstract class AbstractEventAggregator {
  abstract aggregatedEventName: string
  abstract shouldProcess(event: IEventBlock): boolean
  abstract process(event: IEventBlock, events: IEventBlock[]): void
}

export default AbstractEventAggregator
