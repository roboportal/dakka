import { IEventBlock } from '../../eventRecorderSlice'

import { REDIRECT_STARTED } from 'constants/messageTypes'
import { internalEventsMap } from 'constants/internalEventsMap'

import AbstractEventAggregator from './AbstractEventAggregator'

import KeyboardAggregator from './KeyboardAggregator'
import MouseClickAggregator from './MouseClickAggregator'
import ResizeAggregator from './ResizeAggregator'

class DefaultAggregator extends AbstractEventAggregator {
  aggregatedEventName = 'default'

  shouldProcess(): boolean {
    return true
  }

  process(event: IEventBlock, events: IEventBlock[]): void {
    events.push(event)
  }
}

const aggregators: AbstractEventAggregator[] = [
  KeyboardAggregator,
  MouseClickAggregator,
  ResizeAggregator,
  DefaultAggregator,
].map((A) => new A())

function aggregatorSelector(event: IEventBlock) {
  return aggregators.find((aggregator) => aggregator.shouldProcess(event))
}

function shouldSkipRedirectDuplicate(
  events: IEventBlock[],
  event: IEventBlock,
) {
  const prevEvent = events[events.length - 1] ?? {}

  return (
    event.type === internalEventsMap[REDIRECT_STARTED] &&
    prevEvent.type === internalEventsMap[REDIRECT_STARTED] &&
    event.url === prevEvent.url
  )
}

function preprocessRedirect(events: IEventBlock[], event: IEventBlock) {
  if (
    events.length === 0 &&
    event.type !== internalEventsMap[REDIRECT_STARTED]
  ) {
    const redirectionEvent = {
      id: event.id + '_0',
      triggeredAt: event.triggeredAt - 1,
      url: event.url ?? '',
      title: event.title ?? '',
      type: internalEventsMap[REDIRECT_STARTED],
      selector: event.url ?? '',
      variant: '',
      innerHeight: event.innerHeight,
      innerWidth: event.innerWidth,
    }

    events.push(redirectionEvent)
  }
}

export function process(events: IEventBlock[], event: IEventBlock) {
  if (shouldSkipRedirectDuplicate(events, event)) {
    return
  }

  preprocessRedirect(events, event)

  aggregatorSelector(event)?.process(event, events)
}
