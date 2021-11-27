import { configureStore } from '@reduxjs/toolkit'
import eventRecorderReducer from './eventRecorderSlice'

export enum SLICE_NAMES {
  eventRecorder = 'eventRecorder',
}
export const store = configureStore({
  reducer: {
    [SLICE_NAMES.eventRecorder]: eventRecorderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
