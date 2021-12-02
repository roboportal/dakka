import { EventListItem, IEventPayload } from '../eventRecorderSlice'
import { UTILITY_KEYS } from './constants'

abstract class EventAggregator {
  abstract aggregatedEventName: string
  abstract shouldProcess(event: IEventPayload): boolean
  abstract process(event: IEventPayload, events: IEventPayload[]): void
}

class KeyboardAggregator extends EventAggregator {
  aggregatedEventName = 'keyboard'
  shouldProcess(event: IEventPayload): boolean {
    const supportedTypes = ['keydown', 'keypress', 'keyup', 'input']
    return supportedTypes.includes(event.type)
  }

  private keyboardEventFactory(event: IEventPayload) {
    return { ...event, type: this.aggregatedEventName, composedEvents: [event] }
  }

  private findLastCorrespondingEvent(
    event: IEventPayload,
    events: IEventPayload[],
  ) {
    const lastEventForTheKeyIndex: number | undefined = (
      events ?? []
    ).reduceRight((result: number | undefined, e, index) => {
      if (Number.isFinite(result)) {
        return result
      }

      const isMatch =
        (e.key ?? e.data) === (event.key ?? event.data) &&
        e.selector === event.selector

      if (isMatch) {
        return index
      }
    }, undefined)

    return events[lastEventForTheKeyIndex ?? -1] ?? {}
  }

  private checkIsUtilityKey(e: IEventPayload) {
    return UTILITY_KEYS.includes(e.key ?? e.data ?? '')
  }

  private checkIsLastEventOurClient(
    event: IEventPayload,
    lastEvent: IEventPayload,
  ) {
    return (
      lastEvent?.type === this.aggregatedEventName &&
      lastEvent?.selector === event.selector
    )
  }

  private processLastEvent(
    event: IEventPayload,
    lastEvent: IEventPayload,
    eventTypes: string[] = [],
  ) {
    if (
      !eventTypes.length ||
      !eventTypes.includes(
        this.findLastCorrespondingEvent(event, lastEvent.composedEvents ?? [])
          .type,
      )
    ) {
      lastEvent.key =
        (lastEvent.key ?? lastEvent.data ?? '') +
        (event.key ?? event.data ?? '')
      lastEvent.composedEvents?.push(event)
    }
  }

  private handleNonKeydownEventComposition(
    event: IEventPayload,
    events: IEventPayload[],
    eventTypes: string[],
  ) {
    const lastEvent = events[events.length - 1]

    if (
      this.checkIsUtilityKey(event) &&
      !eventTypes.includes(this.findLastCorrespondingEvent(event, events).type)
    ) {
      events.push(event)
      return
    }

    if (this.checkIsLastEventOurClient(event, lastEvent)) {
      this.processLastEvent(event, lastEvent, eventTypes)
      return
    }

    if (
      !eventTypes.includes(this.findLastCorrespondingEvent(event, events).type)
    ) {
      events.push(this.keyboardEventFactory(event))
    }
  }

  private handlersMap: Record<
    string,
    (event: IEventPayload, events: IEventPayload[]) => void
  > = {
    keydown: (event: IEventPayload, events: IEventPayload[]) => {
      const lastEvent = events[events.length - 1]

      if (this.checkIsUtilityKey(event) && !event.repeat) {
        events.push(event)
        return
      }

      if (this.checkIsLastEventOurClient(event, lastEvent) && !event.repeat) {
        this.processLastEvent(event, lastEvent)
        return
      }

      if (!event.repeat) {
        events.push(this.keyboardEventFactory(event))
      }
    },
    keypress: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, ['keydown'])
    },

    input: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        'keydown',
        'keypress',
      ])
    },

    keyup: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        'keydown',
        'keypress',
        'input',
      ])
    },
  }

  process(event: IEventPayload, events: IEventPayload[]): void {
    this.handlersMap[event.type]?.(event, events)
  }
}

class MouseClickAggregator extends EventAggregator {
  aggregatedEventName = 'mouseClick'

  shouldProcess(event: IEventPayload): boolean {
    const supportedTypes = ['mousedown', 'click', 'mouseup', 'dblclick']
    return supportedTypes.includes(event.type)
  }

  process(event: IEventPayload, events: IEventPayload[]): void {
    events.push(event)
  }
}

class DefaultAggregator extends EventAggregator {
  aggregatedEventName = 'default'

  shouldProcess(): boolean {
    return true
  }

  process(event: IEventPayload, events: IEventPayload[]): void {
    events.push(event)
  }
}

const aggregators: EventAggregator[] = [
  KeyboardAggregator,
  MouseClickAggregator,
  DefaultAggregator,
].map((A) => new A())

function aggregatorSelector(event: IEventPayload) {
  return aggregators.find((aggregator) => aggregator.shouldProcess(event))
}

export function process(events: EventListItem[], event: EventListItem) {
  aggregatorSelector(event as IEventPayload)?.process(
    event as IEventPayload,
    events as IEventPayload[],
  )
}
