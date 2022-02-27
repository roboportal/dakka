import { MouseEventHandler, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { removeEvent } from '@/store/eventRecorderSlice'
import { getEvents, getActiveTabId } from '@/store/eventSelectors'

import useEventHighlight from './useEventHighlight'

export default function useEventBlockActions() {
  const activeTabID = useSelector(getActiveTabId)
  const events = useSelector(getEvents)

  const dispatch = useDispatch()

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

  const toggleHighlightedElement = useEventHighlight(events, activeTabID)

  return {
    toggleHighlightedElement,
    handleEventClick,
  }
}
