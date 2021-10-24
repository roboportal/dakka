import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EventRecorderState {
  isRecorderEnabled: boolean
  activeTabID: number
  events: Record<number, Array<Record<string, any>>>
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

const initialState: EventRecorderState = {
  isRecorderEnabled: false,
  activeTabID: -1,
  events: {},
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
  },
})

export const { setActiveTabID, toggleIsRecorderEnabled, recordEvent } =
  eventRecorderSlice.actions

export default eventRecorderSlice.reducer
