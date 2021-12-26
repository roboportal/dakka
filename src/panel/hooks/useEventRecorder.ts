import { MouseEventHandler, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  IEventRecord,
  selectEventSelector,
  removeEvent,
  insertBlock,
  setActiveBlockId,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import { ENABLE_RECORDER, REDIRECT_STARTED } from 'constants/messageTypes'

import { SLICE_NAMES, RootState } from '../store'

import useEventHighlight from './useEventHighlight'

export default function useEventRecorder() {
  const {
    isRecorderEnabled,
    activeTabID,
    events,
    isManualEventInsert,
    activeBlockId,
  } = useSelector((state: RootState) => state[SLICE_NAMES.eventRecorder])

  const dispatch = useDispatch()

  const handleIsRecordEnabledChange = useCallback(() => {
    chrome.tabs.sendMessage(activeTabID, {
      type: ENABLE_RECORDER,
      isRecorderEnabled: !isRecorderEnabled,
    })
    dispatch(toggleIsRecorderEnabled())
  }, [activeTabID, isRecorderEnabled, dispatch])

  const handleSelectSelector = useCallback(
    (payload) =>
      dispatch(selectEventSelector({ ...payload, tabId: activeTabID })),
    [dispatch, activeTabID],
  )

  const handleClearEventsByTabId = useCallback(
    () => dispatch(clearEvents({ tabId: activeTabID })),
    [dispatch, activeTabID],
  )

  const handleInsertBlock = (payload: IEventBlockPayload) =>
    dispatch(insertBlock(payload))

  const handleSetActiveBlockId = (payload: string) =>
    dispatch(setActiveBlockId(payload))

  const handleEventClick: MouseEventHandler = useCallback(
    (e) => {
      const target = e?.target as HTMLElement

      const eventIds: number[] =
        target?.dataset?.event_list_index?.split('.').map((it) => Number(it)) ??
        []

      const action = target?.dataset?.event_list_action

      if (action === 'remove') {
        dispatch(removeEvent({ eventIds }))
      }
    },
    [dispatch],
  )

  useEffect(() => {
    const messageHandler = (
      eventRecord: IEventRecord,
      sender: chrome.runtime.MessageSender,
    ) => {
      const tabId = sender?.tab?.id
      if (!tabId) {
        return chrome.tabs.query({ active: true }).then((tab) => {
          dispatch(
            recordEvent({
              eventRecord,
              tabId: tab[0]?.id ?? -1,
            }),
          )
        })
      }
      dispatch(
        recordEvent({
          eventRecord,
          tabId,
        }),
      )
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
  }, [dispatch])

  useEffect(() => {
    const sendEnableRecorderMessage = (tabId: number) =>
      chrome.tabs.sendMessage(tabId, {
        type: ENABLE_RECORDER,
        isRecorderEnabled,
      })

    const messageHandler = (eventRecord: IEventRecord) => {
      if (eventRecord?.type === REDIRECT_STARTED && activeTabID > -1) {
        sendEnableRecorderMessage(activeTabID)
      }
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

  const toggleHighlightedElement = useEventHighlight(events, activeTabID)

  return {
    events,
    isRecorderEnabled,
    activeTabID,
    isManualEventInsert,
    activeBlockId,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
    handleSelectSelector,
    handleEventClick,
    handleInsertBlock,
    handleSetActiveBlockId,
  }
}
