import { configureStore } from '@reduxjs/toolkit'
import devToolsEnhancer from 'remote-redux-devtools'
import { exportOptions } from '@/store/utils/constants'
import eventRecorderReducer from './eventRecorderSlice'
import { setExportType } from './eventRecorderSlice'

export enum SLICE_NAMES {
  eventRecorder = 'eventRecorder',
}
export const store = configureStore({
  reducer: {
    [SLICE_NAMES.eventRecorder]: eventRecorderReducer,
  },
  enhancers: [devToolsEnhancer({ port: 8000 })],
})

store.subscribe(() => {
  const { exportType } = store.getState()[SLICE_NAMES.eventRecorder]

  chrome.storage.local.set({ exportType })
})

chrome.storage.local.get(['exportType'], (data) => {
  const type =
    exportOptions[data.exportType as exportOptions] ?? exportOptions.none

  store.dispatch(setExportType(type))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
