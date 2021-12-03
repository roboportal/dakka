import { EventListItem, IEventPayload } from '../eventRecorderSlice'
import { UTILITY_KEYS, INPUT_TYPE_TO_KEY_MAP } from './constants'

enum keyboardEvents {
  keydown = 'keydown',
  keypress = 'keypress',
  keyup = 'keyup',
  input = 'input',
}

enum mouseEvents {
  mousedown = 'mousedown',
  click = 'click',
  mouseup = 'mouseup',
  dblclick = 'dblclick',
}

abstract class EventAggregator {
  abstract aggregatedEventName: string
  abstract shouldProcess(event: IEventPayload): boolean
  abstract process(event: IEventPayload, events: IEventPayload[]): void
}

class KeyboardAggregator extends EventAggregator {
  aggregatedEventName = 'keyboard'
  shouldProcess(event: IEventPayload): boolean {
    const supportedTypes: string[] = Object.values(keyboardEvents)
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

      const areSelectorsMatching = e.selector === event.selector
      const isDataMatching = (e.key ?? e.data) === (event.key ?? event.data)

      const isMatch =
        (this.isMatchingKeyModifiers(e, event) || isDataMatching) &&
        areSelectorsMatching

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
    const isCorrespondingEventMatchEventTypes = eventTypes.includes(
      this.findLastCorrespondingEvent(event, lastEvent.composedEvents ?? [])
        .type,
    )
    if (!eventTypes.length || !isCorrespondingEventMatchEventTypes) {
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

    const isUtilKey = this.checkIsUtilityKey(event)

    if (this.checkIsLastEventOurClient(event, lastEvent)) {
      if (!isUtilKey) {
        this.processLastEvent(event, lastEvent, eventTypes)
      } else {
        const correspondingEventTypeFromComposedEvents =
          this.findLastCorrespondingEvent(
            event,
            lastEvent.composedEvents ?? [],
          ).type

        if (!eventTypes.includes(correspondingEventTypeFromComposedEvents)) {
          events.push(event)
        }
      }

      return
    }

    const isCorrespondingEventTypeMatchEventTypes = eventTypes.includes(
      this.findLastCorrespondingEvent(event, events).type,
    )

    if (isUtilKey && !isCorrespondingEventTypeMatchEventTypes) {
      events.push(event)
      return
    }

    if (!isUtilKey && !isCorrespondingEventTypeMatchEventTypes) {
      events.push(this.keyboardEventFactory(event))
    }
  }

  private isMatchingKeyModifiers(
    event: IEventPayload,
    lastEvent: IEventPayload,
  ) {
    return (
      (event?.altKey && lastEvent?.key === 'Alt') ||
      (event?.ctrlKey && lastEvent?.key === 'Control') ||
      (event?.metaKey && lastEvent?.key === 'Meta') ||
      (event?.shiftKey && lastEvent?.key === 'Shift')
    )
  }

  private processHoldUtilityKeyCase(
    event: IEventPayload,
    events: IEventPayload[],
  ) {
    const lastEvent = events[events.length - 1]

    const isMatch = this.isMatchingKeyModifiers(event, lastEvent)

    if (isMatch) {
      events.pop()
    }

    return isMatch
  }

  private handlersMap: Record<
    string,
    (event: IEventPayload, events: IEventPayload[]) => void
  > = {
    keydown: (event: IEventPayload, events: IEventPayload[]) => {
      const lastEvent = events[events.length - 1]

      if (this.checkIsUtilityKey(event) && !event.repeat) {
        this.processHoldUtilityKeyCase(event, events)
        events.push(event)
        return
      }

      if (this.checkIsLastEventOurClient(event, lastEvent) && !event.repeat) {
        this.processHoldUtilityKeyCase(event, events)
        this.processLastEvent(event, lastEvent)
        return
      }

      if (!event.repeat) {
        if (this.processHoldUtilityKeyCase(event, events)) {
          this.handlersMap[event.type]?.(event, events)
        } else {
          events.push(this.keyboardEventFactory(event))
        }
      }
    },
    keypress: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
      ])
    },

    input: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
        keyboardEvents.keypress,
      ])
    },

    keyup: (event: IEventPayload, events: IEventPayload[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
        keyboardEvents.keypress,
        keyboardEvents.input,
      ])
    },
  }

  process(event: IEventPayload, events: IEventPayload[]): void {
    if (event.inputType) {
      event.key = INPUT_TYPE_TO_KEY_MAP[event.inputType]
    }
    this.handlersMap[event.type]?.(event, events)
  }
}

class MouseClickAggregator extends EventAggregator {
  aggregatedEventName = 'mouseClick'

  shouldProcess(event: IEventPayload): boolean {
    const supportedTypes: string[] = Object.values(mouseEvents)
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
