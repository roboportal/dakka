import { createSelector } from '@reduxjs/toolkit'
import { SLICE_NAMES, RootState } from './index'

export const getIsRecorderEnabled = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.isRecorderEnabled,
)

export const getActiveBlockId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.activeBlockId,
)

export const getActiveEvents = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.events[state.activeTabID],
)

export const getIsManualEventInsert = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.isManualEventInsert,
)

export const getExpandedEventId = createSelector(
  (state: RootState) => state[SLICE_NAMES.eventRecorder],
  (state) => state.expandedId,
)
