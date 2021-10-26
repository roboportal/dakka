import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import eventsList from '../constants/eventsList'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Array<IEventPayload>>
  eventsToTrack: Record<string, boolean>
}

interface IEventPayload {
  id: string
  selector: string
  type: string
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
      { events, eventsToTrack },
      { payload: { tabId, eventRecord } }: PayloadAction<IRecordEventPayload>,
    ) => {
      if (tabId > -1 && eventsToTrack[eventRecord.payload.type]) {
        events[tabId] = [...(events[tabId] ?? []), eventRecord.payload]
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
