import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setActiveTabID,
  setLastSelectedEventId,
  recordEvent,
  IEventRecord,
} from '@/store/eventRecorderSlice'
import { getIsRecorderEnabled, getActiveTabId } from '@/store/eventSelectors'
import {
  ELEMENT_SELECTED,
  ENABLE_RECORDER,
  REDIRECT_STARTED,
  DISABLE_SELECT_ELEMENT,
} from '@/constants/messageTypes'
import { internalEventsMap } from '@/constants/internalEventsMap'

export default function useEventRecorder() {
  const isRecorderEnabled = useSelector(getIsRecorderEnabled)
  const activeTabID = useSelector(getActiveTabId)

  const dispatch = useDispatch()

  useEffect(() => {
    const messageHandler = (
      eventRecord: IEventRecord,
      sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse()
      const tabId = sender?.tab?.id

      if (eventRecord?.type === ELEMENT_SELECTED) {
        dispatch(setLastSelectedEventId(eventRecord.payload.id))
        chrome.tabs.sendMessage(activeTabID, {
          type: DISABLE_SELECT_ELEMENT,
        })
      }

      if (internalEventsMap[eventRecord.type]) {
        eventRecord.payload.type = internalEventsMap[eventRecord.type]
      }

      if (!tabId) {
        chrome.tabs.query({ active: true }).then((tab) => {
          dispatch(
            recordEvent({
              eventRecord,
              tabId: tab[0]?.id ?? -1,
            }),
          )
        })
        return true
      }
      dispatch(
        recordEvent({
          eventRecord,
          tabId,
        }),
      )
      return true
    }

    const activeTabChangeHandler = ({ tabId }: chrome.tabs.TabActiveInfo) =>
      dispatch(setActiveTabID(tabId))

    chrome.runtime.onMessage.addListener(messageHandler)
    chrome.tabs.onActivated.addListener(activeTabChangeHandler)

    chrome.tabs
      .query({ active: true })
      .then((tab) => dispatch(setActiveTabID(tab[0]?.id ?? -1)))

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
      chrome.tabs.onActivated.removeListener(activeTabChangeHandler)
    }
  }, [dispatch, activeTabID])

  useEffect(() => {
    const sendEnableRecorderMessage = (tabId: number) =>
      chrome.tabs.sendMessage(tabId, {
        type: ENABLE_RECORDER,
        isRecorderEnabled,
      })

    const messageHandler = (
      eventRecord: IEventRecord,
      sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse()
      if (eventRecord?.type === REDIRECT_STARTED && activeTabID > -1) {
        sendEnableRecorderMessage(activeTabID)
      }
      return true
    }

    const activeTabChangeHandler = (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      const shouldLogRedirect =
        tab.status === 'complete' &&
        tab.active &&
        tab?.url?.indexOf('chrome://') === -1

      if (shouldLogRedirect) {
        sendEnableRecorderMessage(tabId)
      }
    }

    chrome.runtime.onMessage.addListener(messageHandler)

    chrome.tabs.onUpdated.addListener(activeTabChangeHandler)

    chrome.tabs
      .query({ active: true })
      .then((tab) => sendEnableRecorderMessage(tab[0]?.id ?? -1))

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler)
      chrome.tabs.onUpdated.removeListener(activeTabChangeHandler)
    }
  }, [isRecorderEnabled, activeTabID])
}
