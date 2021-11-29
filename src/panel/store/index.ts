import { configureStore } from '@reduxjs/toolkit'
import eventRecorderReducer from './eventRecorderSlice'
import devToolsEnhancer from 'remote-redux-devtools'

export enum SLICE_NAMES {
  eventRecorder = 'eventRecorder',
}
export const store = configureStore({
  reducer: {
    [SLICE_NAMES.eventRecorder]: eventRecorderReducer,
  },
  enhancers: [devToolsEnhancer({ port: 8000 })],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
