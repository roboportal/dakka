import { IEventBlock } from '../eventRecorderSlice'
import { UTILITY_KEYS, INPUT_TYPE_TO_KEY_MAP } from './constants'
import { REDIRECT_STARTED } from 'constants/messageTypes'
import { internalEventsMap } from 'constants/internalEventsMap'

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
  abstract shouldProcess(event: IEventBlock): boolean
  abstract process(event: IEventBlock, events: IEventBlock[]): void
}

class KeyboardAggregator extends EventAggregator {
  aggregatedEventName = 'keyboard'
  shouldProcess(event: IEventBlock): boolean {
    const supportedTypes: string[] = Object.values(keyboardEvents)
    return supportedTypes.includes(event.type)
  }

  private keyboardEventFactory(event: IEventBlock) {
    return { ...event, type: this.aggregatedEventName, composedEvents: [event] }
  }

  private findLastCorrespondingEvent(
    event: IEventBlock,
    events: IEventBlock[],
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

  private checkIsUtilityKey(e: IEventBlock) {
    return UTILITY_KEYS.includes(e.key ?? e.data ?? '')
  }

  private checkIsLastEventOurClient(
    event: IEventBlock,
    lastEvent: IEventBlock,
  ) {
    return (
      lastEvent?.type === this.aggregatedEventName &&
      lastEvent?.selector === event.selector
    )
  }

  private processLastEvent(
    event: IEventBlock,
    lastEvent: IEventBlock,
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
    event: IEventBlock,
    events: IEventBlock[],
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

  private isMatchingKeyModifiers(event: IEventBlock, lastEvent: IEventBlock) {
    return (
      (event?.altKey && lastEvent?.key === 'Alt') ||
      (event?.ctrlKey && lastEvent?.key === 'Control') ||
      (event?.metaKey && lastEvent?.key === 'Meta') ||
      (event?.shiftKey && lastEvent?.key === 'Shift')
    )
  }

  private processHoldUtilityKeyCase(event: IEventBlock, events: IEventBlock[]) {
    const lastEvent = events[events.length - 1]

    const isMatch = this.isMatchingKeyModifiers(event, lastEvent)

    if (isMatch) {
      events.pop()
    }

    return isMatch
  }

  private handlersMap: Record<
    string,
    (event: IEventBlock, events: IEventBlock[]) => void
  > = {
    [keyboardEvents.keydown]: (event: IEventBlock, events: IEventBlock[]) => {
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
    [keyboardEvents.keypress]: (event: IEventBlock, events: IEventBlock[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
      ])
    },

    [keyboardEvents.input]: (event: IEventBlock, events: IEventBlock[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
        keyboardEvents.keypress,
      ])
    },

    [keyboardEvents.keyup]: (event: IEventBlock, events: IEventBlock[]) => {
      this.handleNonKeydownEventComposition(event, events, [
        keyboardEvents.keydown,
        keyboardEvents.keypress,
        keyboardEvents.input,
      ])
    },
  }

  process(event: IEventBlock, events: IEventBlock[]): void {
    if (event.inputType) {
      event.key = INPUT_TYPE_TO_KEY_MAP[event.inputType]
    }
    this.handlersMap[event.type]?.(event, events)
  }
}

class MouseClickAggregator extends EventAggregator {
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

    const isLastEventOurClient =
      !lastComposedEvent ||
      [mouseEvents.mousedown, mouseEvents.mouseup].includes(
        lastComposedEvent?.type as mouseEvents,
      )

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

  private handleMouseUp = (event: IEventBlock, events: IEventBlock[]) => {
    const prevEventIndex = this.findCorrespondingEventIndex(event, events)
    const prevEvent = events[prevEventIndex] ?? ({} as IEventBlock)
    const lastComposedEvent =
      prevEvent.composedEvents?.[(prevEvent.composedEvents?.length ?? 0) - 1]

    const isLastEventOurClient =
      !lastComposedEvent ||
      [mouseEvents.mousedown].includes(lastComposedEvent?.type as mouseEvents)

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
    [mouseEvents.mousedown]: (event: IEventBlock, events: IEventBlock[]) => {
      events.push(this.mouseEventFactory(event))
    },

    [mouseEvents.mouseup]: this.handleMouseUp,

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

class DefaultAggregator extends EventAggregator {
  aggregatedEventName = 'default'

  shouldProcess(): boolean {
    return true
  }

  process(event: IEventBlock, events: IEventBlock[]): void {
    events.push(event)
  }
}

const aggregators: EventAggregator[] = [
  KeyboardAggregator,
  MouseClickAggregator,
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
