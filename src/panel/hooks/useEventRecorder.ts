import { MouseEventHandler, useEffect, useState } from 'react'
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
} from '../../constants/messageTypes'

import { SLICE_NAMES, RootState } from '../redux'

export default function useEventRecorder() {
  const [highlightedEventIndex, setHighlightedEventIndex] = useState<number>(-1)

  const { isRecorderEnabled, activeTabID, events } = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder],
  )

  const dispatch = useDispatch()

  const handleIsRecordEnabledChange = () => {
    chrome.tabs.sendMessage(activeTabID, {
      type: ENABLE_RECORDER,
      isRecorderEnabled: !isRecorderEnabled,
    })
    dispatch(toggleIsRecorderEnabled())
  }

  const handleClearEventsByTabId = () =>
    dispatch(clearEvents({ tabId: activeTabID }))

  const toggleHighlightedElement: MouseEventHandler = (e) => {
    const eventId = Number(
      (e?.target as HTMLElement)?.dataset?.event_list_index,
    )
    if (!Number.isFinite(eventId)) {
      return
    }
    if (eventId === highlightedEventIndex) {
      setHighlightedEventIndex(-1)
    } else {
      setHighlightedEventIndex(eventId)
    }
  }

  useEffect(() => {
    if (activeTabID === -1) {
      return
    }
    const payload: { type: string; selector: string | null } = {
      type: HIGHLIGHT_ELEMENT,
      selector: null,
    }
    if (highlightedEventIndex > -1) {
      payload.selector = events[activeTabID][highlightedEventIndex].selector
    }
    chrome.tabs.sendMessage(activeTabID, payload)
  }, [highlightedEventIndex])

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

  return {
    events,
    isRecorderEnabled,
    activeTabID,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
  }
}
