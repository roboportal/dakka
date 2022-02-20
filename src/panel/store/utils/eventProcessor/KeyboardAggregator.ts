import { IEventBlock } from '../../eventRecorderSlice'
import { UTILITY_KEYS, INPUT_TYPE_TO_KEY_MAP } from '../constants'
import AbstractEventAggregator from './AbstractEventAggregator'

enum keyboardEvents {
  keydown = 'keydown',
  keypress = 'keypress',
  keyup = 'keyup',
  input = 'input',
}

class KeyboardAggregator extends AbstractEventAggregator {
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

export default KeyboardAggregator
