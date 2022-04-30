import { MouseEventHandler, useCallback } from 'react'

import { IEventBlock } from '@roboportal/types'
import {
  HIGHLIGHT_ELEMENT,
  REDIRECT_STARTED,
} from '@roboportal/constants/messageTypes'
import { internalEventsMap } from '@roboportal/constants/internalEventsMap'

function highlightElement(
  tabId: number,
  highlightedEventIndexes: number[],
  events: IEventBlock[],
) {
  if (tabId === -1) {
    return
  }
  const payload: {
    type: string
    selector: string | null
    location: string | null
    isInIframe: boolean | null
  } = {
    type: HIGHLIGHT_ELEMENT,
    selector: null,
    location: null,
    isInIframe: null,
  }

  if (highlightedEventIndexes.length) {
    const item = events[highlightedEventIndexes[0]]
    if (Array.isArray(item)) {
      const el = item[highlightedEventIndexes[1]]
      payload.selector = el?.selector ?? null
      payload.selector = el?.url ?? null
      payload.isInIframe = el?.isInIframe ?? null
    } else {
      const selector = item.element?.selector || item.selector
      const location = item.element?.url ?? item.url
      const isInIframe = item.element?.isInIframe ?? item.isInIframe
      payload.selector = selector ?? null
      payload.location = location ?? null
      payload.isInIframe = isInIframe ?? null
    }
  }

  chrome.tabs.sendMessage(tabId, payload)
}

export default function useEventHighlight(
  tabId: number,
  events: IEventBlock[],
) {
  const toggleHighlightedElement: MouseEventHandler = useCallback(
    (e) => {
      const eventIds: number[] =
        (e?.target as HTMLElement)?.dataset?.event_list_index
          ?.split('.')
          .map((it) => Number(it)) ?? []

      const shouldHighlight: boolean =
        !!eventIds.length &&
        (
          eventIds.reduce(
            (acc: unknown, id) => (acc as IEventBlock[])?.[id],
            events,
          ) as IEventBlock
        )?.type !== internalEventsMap[REDIRECT_STARTED]

      const ids = shouldHighlight ? eventIds : []

      highlightElement(tabId, ids, events)
    },
    [events, tabId],
  )

  return toggleHighlightedElement
}
