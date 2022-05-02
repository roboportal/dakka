import { IEventBlock } from '@roboportal/types'

import AbstractEventAggregator from './AbstractEventAggregator'

enum mouseEvents {
  click = 'click',
  dblclick = 'dblclick',
}

class MouseClickAggregator extends AbstractEventAggregator {
  aggregatedEventName = 'mouseClick'

  private mouseEventFactory(event: IEventBlock) {
    return { ...event, type: this.aggregatedEventName, composedEvents: [event] }
  }

  shouldProcess(event: IEventBlock): boolean {
    const supportedTypes: string[] = Object.values(mouseEvents)
    return supportedTypes.includes(event.type)
  }

  private findCorrespondingEventIndex(
    event: IEventBlock,
    events: IEventBlock[],
  ) {
    const correspondingMouseEventIndex: number | undefined = (
      events ?? []
    ).reduceRight((result: number | undefined, e, index) => {
      if (Number.isFinite(result)) {
        return result
      }

      if (
        event.selector === e.selector &&
        e.type === this.aggregatedEventName
      ) {
        return index
      }
    }, undefined)

    return correspondingMouseEventIndex ?? -1
  }

  private handleClick = (event: IEventBlock, events: IEventBlock[]) => {
    const prevEventIndex = this.findCorrespondingEventIndex(event, events)
    const prevEvent = events[prevEventIndex] ?? ({} as IEventBlock)
    const lastComposedEvent =
      prevEvent.composedEvents?.[(prevEvent.composedEvents?.length ?? 0) - 1]

    const isLastEventOurClient = !lastComposedEvent

    if (
      prevEvent.type === this.aggregatedEventName &&
      event.selector === prevEvent.selector &&
      isLastEventOurClient
    ) {
      prevEvent.composedEvents?.push(event)
      return
    }
    events.push(this.mouseEventFactory(event))
  }

  private handlersMap: Record<
    string,
    (event: IEventBlock, events: IEventBlock[]) => void
  > = {
    [mouseEvents.click]: this.handleClick,

    [mouseEvents.dblclick]: (event: IEventBlock, events: IEventBlock[]) => {
      const DOUBLE_CLICK_COUNT = 2
      Array(DOUBLE_CLICK_COUNT)
        .fill(null)
        .forEach(() => {
          const eventIndex = this.findCorrespondingEventIndex(event, events)
          if (eventIndex > -1) {
            events.splice(eventIndex, 1)
          }
        })

      events.push(event)
    },
  }

  process(event: IEventBlock, events: IEventBlock[]): void {
    this.handlersMap[event.type]?.(event, events)
  }
}

export default MouseClickAggregator
