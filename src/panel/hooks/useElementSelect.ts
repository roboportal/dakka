import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { getActiveTabId } from '@/store/eventSelectors'

import {
  ENABLE_SELECT_ELEMENT,
  DISABLE_SELECT_ELEMENT,
} from '@/constants/messageTypes'

export default function useElementSelect() {
  const activeTabID = useSelector(getActiveTabId)
  const enableSelectElement = useCallback(() => {
    if (activeTabID) {
      chrome.tabs.sendMessage(activeTabID, {
        type: ENABLE_SELECT_ELEMENT,
      })
    }
  }, [activeTabID])

  const disableSelectElement = useCallback(() => {
    if (activeTabID) {
      chrome.tabs.sendMessage(activeTabID, {
        type: DISABLE_SELECT_ELEMENT,
      })
    }
  }, [activeTabID])

  return { enableSelectElement, disableSelectElement }
}
