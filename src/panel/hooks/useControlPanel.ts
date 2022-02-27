import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ENABLE_RECORDER } from '@/constants/messageTypes'
import {
  clearEvents,
  toggleIsRecorderEnabled,
} from '@/store/eventRecorderSlice'
import { getIsRecorderEnabled, getActiveTabId } from '@/store/eventSelectors'

export default function useControlPanel() {
  const isRecorderEnabled = useSelector(getIsRecorderEnabled)
  const activeTabID = useSelector(getActiveTabId)

  const dispatch = useDispatch()

  const handleIsRecordEnabledChange = useCallback(() => {
    chrome.tabs.sendMessage(activeTabID, {
      type: ENABLE_RECORDER,
      isRecorderEnabled: !isRecorderEnabled,
    })
    dispatch(toggleIsRecorderEnabled())
  }, [activeTabID, isRecorderEnabled, dispatch])

  const handleClearEventsByTabId = useCallback(
    () => dispatch(clearEvents({ tabId: activeTabID })),
    [dispatch, activeTabID],
  )

  return {
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    isRecorderEnabled,
  }
}
