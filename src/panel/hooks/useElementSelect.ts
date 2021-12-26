import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SLICE_NAMES, RootState } from '../store'
import { ENABLE_SELECT_ELEMENT } from '../../globalConstants/messageTypes'

export default function useElementSelect() {
  const { activeTabID } = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder],
  )

  const enableSelectElement = useCallback(() => {
    if (activeTabID) {
      chrome.tabs.sendMessage(activeTabID, {
        type: ENABLE_SELECT_ELEMENT,
      })
    }
  }, [activeTabID])

  return { enableSelectElement }
}
