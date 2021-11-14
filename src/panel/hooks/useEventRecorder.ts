import { MouseEventHandler, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setActiveTabID,
  toggleIsRecorderEnabled,
  recordEvent,
  clearEvents,
  IEventRecord,
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

  const handleClearEventsByTabId = useCallback(
    () => dispatch(clearEvents({ tabId: activeTabID })),
    [dispatch, clearEvents, activeTabID],
  )

  const toggleHighlightedElement: MouseEventHandler = useCallback(
    (e) => {
      const eventIds: number[] =
        (e?.target as HTMLElement)?.dataset?.event_list_index
          ?.split('.')
          .map((it) => Number(it)) ?? []

      if (
        JSON.stringify(eventIds) === JSON.stringify(highlightedEventIndexes)
      ) {
        setHighlightedEventIndexes([])
      } else {
        setHighlightedEventIndexes(eventIds)
      }
    },
    [highlightedEventIndexes, setHighlightedEventIndexes],
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
        payload.selector = item?.selector ?? null
      }
    }

    chrome.tabs.sendMessage(activeTabID, payload)
  }, [highlightedEventIndexes])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (eventRecord: IEventRecord, sender) => {
        const tabId = sender?.tab?.id ?? -1
        dispatch(
          recordEvent({
            eventRecord,
            tabId,
          }),
        )
      },
    )

    chrome.tabs.onActivated.addListener(({ tabId }) =>
      dispatch(setActiveTabID(tabId)),
    )

    chrome.tabs
      .query({ active: true })
      .then((tab) => dispatch(setActiveTabID(tab[0]?.id ?? -1)))
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (eventRecord: IEventRecord, sender) => {
        const tabId = sender?.tab?.id ?? -1

        if (eventRecord?.type === REDIRECT_STARTED && isRecorderEnabled) {
          chrome.tabs.sendMessage(tabId, {
            type: ENABLE_RECORDER,
            isRecorderEnabled: true,
          })
        }
      },
    )
  }, [isRecorderEnabled])

  return {
    events,
    isRecorderEnabled,
    activeTabID,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
  }
}
