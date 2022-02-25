import { IEventBlock } from '../../eventRecorderSlice'
import AbstractEventAggregator from './AbstractEventAggregator'
import { resize } from 'constants/browserEvents'

class ResizeAggregator extends AbstractEventAggregator {
  aggregatedEventName = resize

  shouldProcess(event: IEventBlock): boolean {
    return event.type === resize
  }

  process(event: IEventBlock, events: IEventBlock[]): void {
    const lastEvent = events[events.length - 1]

    if (lastEvent.type === resize) {
      events[events.length - 1] = event
    } else {
      events.push(event)
    }
  }
}

export default ResizeAggregator
