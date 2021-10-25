import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import eventsList from '../constants/eventsList'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Array<Record<string, any>>>
  eventsToTrack: Record<string, boolean>
}

interface IEventRecord {
  id: string
  type: string
  payload: {
    id: string
    className: string
    type: string
  }
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
      { events },
      { payload: { tabId, eventRecord } }: PayloadAction<IRecordEventPayload>,
    ) => {
      if (tabId > -1) {
        events[tabId] = [...(events[tabId] ?? []), eventRecord]
      }
    },
    clearEvents: ({ events }, { payload: { tabId } }) => {
      events[tabId] = []
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
