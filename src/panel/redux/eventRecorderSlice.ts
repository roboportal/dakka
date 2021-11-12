import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import eventsList from '../constants/eventsList'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Array<IEventPayload | IEventPayload>>
  eventsToTrack: Record<string, boolean>
  firstEventStartedAt: number
  currentEventIndex: number
}

export interface IEventPayload {
  id: string
  selector: string
  type: string
  triggeredAt: number
  eventRecordIndex: number
  deltaTime: number
}

export interface IEventRecord {
  id: string
  type: string
  payload: IEventPayload
}

export interface IRecordEventPayload {
  tabId: number
  eventRecord: IEventRecord
}

const defaultEventsToTrack = Object.fromEntries(
  eventsList
    .map((group) => group.events)
    .flat()
    .map(({ key, defaultSelected }) => [key, defaultSelected ?? false]),
)

const initialState: EventRecorderState = {
  isRecorderEnabled: false,
  activeTabID: -1,
  events: {},
  eventsToTrack: defaultEventsToTrack,
  firstEventStartedAt: 0,
  currentEventIndex: 0,
}

function checkIsDuplicatedEvent(
  events: Array<IEventPayload[] | IEventPayload>,
  eventRecord: IEventRecord,
) {
  const currentIndex = (events.length ?? 1) - 1

  const prevEvents = events?.[currentIndex] as IEventPayload[]

  const { triggeredAt, selector, type } = ((Array.isArray(
    events?.[currentIndex],
  )
    ? prevEvents[prevEvents.length - 1]
    : events?.[currentIndex]) ?? {}) as IEventPayload

  const isDuplicatedEvent =
    currentIndex >= 1 &&
    triggeredAt === eventRecord.payload.triggeredAt &&
    selector === eventRecord.payload.selector &&
    type === eventRecord.payload.type

  return isDuplicatedEvent
}

function calculateDeltaTime(
  prevEvent: IEventPayload | IEventPayload[],
  currentEvent: IEventPayload,
) {
  const delta =
    currentEvent.triggeredAt -
    ((prevEvent as IEventPayload[])[0]?.triggeredAt ??
      (prevEvent as IEventPayload)?.triggeredAt)
  return (Number.isFinite(delta) ? delta : delta) ?? 0
}

function composeEvents(
  events: Array<IEventPayload | IEventPayload[]>,
  event: IEventPayload,
  index: number,
) {
  if (index === 0) {
    events.push(event)
  }
  if (index > 0) {
    const previous = events[events.length - 1]
    if (Array.isArray(previous)) {
      const previousEvents = previous as IEventPayload[]
      const l = previousEvents.length
      event.deltaTime = calculateDeltaTime(previousEvents[0], event)
      if (event.triggeredAt === previousEvents[l - 1].triggeredAt) {
        previousEvents.push(event)
      } else {
        events.push(event)
      }
    } else {
      const previousEvent = previous as IEventPayload
      event.deltaTime = calculateDeltaTime(previousEvent, event)
      if (event.triggeredAt === previousEvent.triggeredAt) {
        events[events.length - 1] = [previousEvent, event]
      } else {
        events.push(event)
      }
    }
  }
}

export const eventRecorderSlice = createSlice({
  name: 'eventRecorder',
  initialState,
  reducers: {
    setActiveTabID: (state, action: PayloadAction<number>) => {
      state.activeTabID = action.payload
    },
    toggleIsRecorderEnabled: (state) => {
      state.isRecorderEnabled = !state.isRecorderEnabled
    },
    recordEvent: (
      state,
      { payload: { tabId, eventRecord } }: PayloadAction<IRecordEventPayload>,
    ) => {
      const { events, eventsToTrack } = state

      // console.log('33333', eventRecord.payload)
      // if (eventRecord.type === 'started') {
      //   composeEvents(
      //     events[tabId],
      //     eventRecord.payload,
      //     state.currentEventIndex++,
      //   )
      //   return
      // }

      const hasInValidTabIdOrEventShouldNotBeRecorded =
        tabId < 0 || !eventsToTrack[eventRecord.payload.type]

      if (hasInValidTabIdOrEventShouldNotBeRecorded) {
        return
      }

      const isFirstEventRecordedForTab = !events[tabId] || !events[tabId].length

      if (isFirstEventRecordedForTab) {
        state.firstEventStartedAt = eventRecord.payload.triggeredAt
        events[tabId] = []
      }

      eventRecord.payload.triggeredAt -= state.firstEventStartedAt

      if (checkIsDuplicatedEvent(events[tabId], eventRecord)) {
        return
      }

      eventRecord.payload.eventRecordIndex = state.currentEventIndex

      composeEvents(
        events[tabId],
        eventRecord.payload,
        state.currentEventIndex++,
      )
    },
    clearEvents: (state, { payload: { tabId } }) => {
      state.events[tabId] = []
      state.firstEventStartedAt = 0
      state.currentEventIndex = 0
    },
    toggleEventToTrack: (
      { eventsToTrack },
      { payload }: PayloadAction<string>,
    ) => {
      eventsToTrack[payload] = !eventsToTrack[payload]
    },
  },
})

export const {
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  toggleEventToTrack,
} = eventRecorderSlice.actions

export default eventRecorderSlice.reducer
