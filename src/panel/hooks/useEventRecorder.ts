import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
} from '../redux/eventRecorderSlice'

import { SLICE_NAMES, RootState } from '../redux'

export default function useEventRecorder() {
  const { isRecorderEnabled, activeTabID, events } = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder],
  )

  const dispatch = useDispatch()

  const handleIsRecordEnabledChange = () => dispatch(toggleIsRecorderEnabled())

  const handleClearEventsByTabId = () =>
    dispatch(clearEvents({ tabId: activeTabID }))

  useEffect(() => {
    chrome.runtime.onMessage.addListener((eventRecord, sender) => {
      const tabId = sender?.tab?.id ?? -1
      dispatch(
        recordEvent({
          eventRecord,
          tabId,
        }),
      )
    })

    chrome.tabs.onActivated.addListener(({ tabId }) =>
      dispatch(setActiveTabID(tabId)),
    )

    chrome.tabs
      .query({ active: true })
      .then((tab) => dispatch(setActiveTabID(tab[0]?.id ?? -1)))
  }, [])

  return {
    events,
    isRecorderEnabled,
    activeTabID,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
  }
}
