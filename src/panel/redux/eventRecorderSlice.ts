import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'

import eventsList from '../constants/eventsList'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Array<IEventPayload | IEventPayload>>
  eventsToTrack: Record<string, boolean>
  firstEventStartedAt: number
  currentEventIndex: number
}

export interface ISelector {
  name: string
  value: string
  ariaLabel?: string
}

export interface ISelectorPayload {
  selectedSelector: ISelector
  record: IEventPayload
}

export interface IEventPayload {
  id: string
  selector: string
  type: string
  triggeredAt: number
  eventRecordIndex: number
  deltaTime: number
  validSelectors?: ISelector[]
  selectedSelector?: ISelector
  url?: string
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
    ((prevEvent as IEventPayload[])?.[0]?.triggeredAt ??
      (prevEvent as IEventPayload)?.triggeredAt)
  return Number.isFinite(delta) ? delta : 0
}

function composeEvents(
  events: Array<IEventPayload | IEventPayload[]>,
  event: IEventPayload,
  index: number,
) {
  if (index === 0) {
    events.push({ ...event, deltaTime: 0 })
  }

  if (index > 0) {
    const previous = events[events.length - 1]
    if (Array.isArray(previous)) {
      const previousEvents = previous as IEventPayload[]
      const l = previousEvents.length
      event.deltaTime = calculateDeltaTime(previousEvents[0], event)
      if (event.triggeredAt === previousEvents[l - 1].triggeredAt) {
        ;(events[events.length - 1] as IEventPayload[]).push(event)
      } else {
        events.push(event)
      }
    } else {
      const previousEvent = previous as IEventPayload
      event.deltaTime = calculateDeltaTime(previousEvent, event)
      if (event?.triggeredAt === previousEvent?.triggeredAt) {
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
      const { events, eventsToTrack, isRecorderEnabled } = state

      if (!isRecorderEnabled) {
        return state
      }

      const hasInValidTabIdOrEventShouldNotBeRecorded =
        tabId < 0 || !eventsToTrack[eventRecord.payload.type]

      if (hasInValidTabIdOrEventShouldNotBeRecorded) {
        return state
      }

      const isFirstEventRecordedForTab = !events[tabId] || !events[tabId].length

      if (isFirstEventRecordedForTab) {
        state.firstEventStartedAt = eventRecord.payload.triggeredAt
        events[tabId] = []
      }
      eventRecord.payload.triggeredAt -= state.firstEventStartedAt

      if (!Number.isFinite(eventRecord.payload.triggeredAt)) {
        eventRecord.payload.triggeredAt = 0
      }

      if (checkIsDuplicatedEvent(events[tabId], eventRecord)) {
        return state
      }

      eventRecord.payload.eventRecordIndex = state.currentEventIndex
      composeEvents(events[tabId], eventRecord.payload, state.currentEventIndex)
      state.currentEventIndex++
    },
    clearEvents: (state, { payload: { tabId } }) => {
      state.events[tabId] = []
      state.firstEventStartedAt = 0
      state.currentEventIndex = 0
    },
    selectEventSelector: (
      { events },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const updateSelector = (eventRecord: IEventPayload) => {
        if (eventRecord.selector === record.selector) {
          eventRecord.selectedSelector = selectedSelector
        }
      }

      events[tabId].flat().forEach(updateSelector)
    },
    toggleEventToTrack: (
      { eventsToTrack },
      { payload }: PayloadAction<string>,
    ) => {
      eventsToTrack[payload] = !eventsToTrack[payload]
    },
    toggleEventsToTrack: (
      { eventsToTrack },
      { payload }: PayloadAction<boolean>,
    ) => {
      Object.keys(eventsToTrack).forEach(
        (key) => (eventsToTrack[key] = payload),
      )
    },
    removeEvent: (
      state,
      {
        payload: { eventIds, tabId },
      }: PayloadAction<{ eventIds: number[]; tabId: number }>,
    ) => {
      console.log(eventIds, tabId)
      const [first, second] = eventIds
      if (Array.isArray(state.events[tabId][first])) {
        const it = state.events[tabId][first] as unknown as WritableDraft<
          IEventPayload[]
        >
        it.splice(second, 1)
        if (it.length === 1) {
          state.events[tabId][first] = it[0]
        }
        if (it.length === 0) {
          state.events[tabId].splice(first, 1)
        }
      } else {
        state.events[tabId].splice(first, 1)
      }

      state.currentEventIndex -= 1
      state.firstEventStartedAt =
        (
          state.events[tabId][0] as unknown as WritableDraft<IEventPayload[]>
        )?.[0]?.triggeredAt ?? state.events[tabId][0]?.triggeredAt

      if (state.events[tabId].length > 1) {
        state.events[tabId].flat().forEach((it, index, arr) => {
          if (index === 0) {
            it.deltaTime = 0
            return
          }
          it.deltaTime = calculateDeltaTime(arr[index - 1], it)
        })
      }
    },
  },
})

export const {
  toggleEventsToTrack,
  selectEventSelector,
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  toggleEventToTrack,
  removeEvent,
} = eventRecorderSlice.actions

export default eventRecorderSlice.reducer
