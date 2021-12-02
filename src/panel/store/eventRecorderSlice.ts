import { nanoid } from 'nanoid'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'

import eventsList from 'constants/eventsList'

import { process } from './utils/eventProcessor'

export type EventListItem = IEventPayload | IEventBlock

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, EventListItem[]>
  eventsToTrack: Record<string, boolean>
  isManualEventInsert: boolean
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

export interface IEventBlock {
  type: string
  id: string
  triggeredAt: number
  variant: string
}

export interface IEventBlockPayload {
  type: string
  eventIndex: number
}

export interface IEventPayload {
  id: string
  selector: string
  type: string
  triggeredAt: number
  validSelectors?: ISelector[]
  selectedSelector?: ISelector
  url?: string
  variant: string
  key?: string
  data?: string
  repeat?: boolean
  composedEvents?: IEventPayload[]
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
  isManualEventInsert: false,
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
        events[tabId] = []
      }

      process(events[tabId], eventRecord.payload)

      state.isManualEventInsert = false
    },
    clearEvents: (state, { payload: { tabId } }) => {
      state.events[tabId] = []
    },
    selectEventSelector: (
      { events },
      { payload: { record, selectedSelector, tabId } },
    ) => {
      const updateSelector = (eventRecord: WritableDraft<IEventPayload>) => {
        if (eventRecord.selector === record.selector) {
          eventRecord.selectedSelector = selectedSelector
        }
      }
      events[tabId].forEach((e) =>
        updateSelector(e as WritableDraft<IEventPayload>),
      )
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
      { payload: { eventIds } }: PayloadAction<{ eventIds: number[] }>,
    ) => {
      const tabId = state.activeTabID
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
    },
    insertBlock: (state, { payload: { type, eventIndex, triggeredAt } }) => {
      const tabId = state.activeTabID
      const index = eventIndex + 1
      const block = {
        id: nanoid(),
        eventRecordIndex: index,
        type,
        variant: 'InteractiveElement',
        triggeredAt,
      } as WritableDraft<IEventBlock>

      state.events[tabId].splice(index, 0, block)

      const shouldPreventAutoScroll = index !== state.events[tabId].length - 1

      state.isManualEventInsert = shouldPreventAutoScroll
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
  insertBlock,
} = eventRecorderSlice.actions

export default eventRecorderSlice.reducer
