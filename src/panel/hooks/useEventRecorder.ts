import { MouseEventHandler, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  IEventPayload,
  IEventRecord,
  selectEventSelector,
  removeEvent,
  insertBlock,
  IEventBlockPayload,
} from '../redux/eventRecorderSlice'
import {
  ENABLE_RECORDER,
  HIGHLIGHT_ELEMENT,
  REDIRECT_STARTED,
} from '../../constants/messageTypes'

import { SLICE_NAMES, RootState } from '../redux'

export default function useEventRecorder() {
  const [highlightedEventIndexes, setHighlightedEventIndexes] = useState<
    number[]
  >([])

  const { isRecorderEnabled, activeTabID, events } = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder],
  )

  const dispatch = useDispatch()

  const handleIsRecordEnabledChange = useCallback(() => {
    chrome.tabs.sendMessage(activeTabID, {
      type: ENABLE_RECORDER,
      isRecorderEnabled: !isRecorderEnabled,
    })
    dispatch(toggleIsRecorderEnabled())
  }, [activeTabID, isRecorderEnabled, dispatch, toggleIsRecorderEnabled])

  const handleSelectSelector = useCallback(
    (payload) =>
      dispatch(selectEventSelector({ ...payload, tabId: activeTabID })),
    [dispatch, selectEventSelector, activeTabID],
  )

  const handleClearEventsByTabId = useCallback(
    () => dispatch(clearEvents({ tabId: activeTabID })),
    [dispatch, clearEvents, activeTabID],
  )

  const handleInsertBlock = (payload: IEventBlockPayload) =>
    dispatch(insertBlock(payload))

  const toggleHighlightedElement: MouseEventHandler = useCallback(
    (e) => {
      const eventIds: number[] =
        (e?.target as HTMLElement)?.dataset?.event_list_index
          ?.split('.')
          .map((it) => Number(it)) ?? []

      const shouldSkipHighlight: boolean =
        !!eventIds.length &&
        eventIds.reduce((acc: any, id) => acc?.[id], events?.[activeTabID])
          ?.type === REDIRECT_STARTED

      if (
        JSON.stringify(eventIds) === JSON.stringify(highlightedEventIndexes) ||
        shouldSkipHighlight
      ) {
        setHighlightedEventIndexes([])
      } else {
        setHighlightedEventIndexes(eventIds)
      }
    },
    [highlightedEventIndexes, setHighlightedEventIndexes],
  )

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
    [removeEvent, activeTabID],
  )

  useEffect(() => {
    if (activeTabID === -1) {
      return
    }
    const payload: { type: string; selector: string | null } = {
      type: HIGHLIGHT_ELEMENT,
      selector: null,
    }

    if (highlightedEventIndexes.length) {
      const item = events[activeTabID][highlightedEventIndexes[0]]
      if (Array.isArray(item)) {
        payload.selector = item[highlightedEventIndexes[1]]?.selector ?? null
      } else {
        payload.selector = (item as IEventPayload)?.selector ?? null
      }
    }

    chrome.tabs.sendMessage(activeTabID, payload)
  }, [highlightedEventIndexes])

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
  }, [])

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
  }, [isRecorderEnabled])

  return {
    events,
    isRecorderEnabled,
    activeTabID,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
    handleSelectSelector,
    handleEventClick,
    handleInsertBlock,
  }
}
