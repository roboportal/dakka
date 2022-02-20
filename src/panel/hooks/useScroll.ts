import { useRef, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getActiveEvents, getIsManualEventInsert } from 'store/eventSelectors'

export default function useScroll(autoScroll: boolean) {
  const events = useSelector(getActiveEvents)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [eventsListScroll, setEventsListScroll] = useState(0)
  const prevEventCounterRef = useRef(0)
  const isManualEventInsert = useSelector(getIsManualEventInsert)

  useEffect(() => {
    const nEvents = events?.length ?? 0
    if (
      !wrapperRef.current ||
      !autoScroll ||
      prevEventCounterRef.current >= nEvents ||
      isManualEventInsert
    ) {
      prevEventCounterRef.current = nEvents
      return
    }

    prevEventCounterRef.current = nEvents
    wrapperRef.current.scrollTo(wrapperRef.current.scrollWidth, 0)
  }, [events?.length, isManualEventInsert, autoScroll])

  const handleEventsScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollPosition = (e.target as HTMLDivElement).scrollLeft
      setEventsListScroll(scrollPosition)
    },
    [setEventsListScroll],
  )

  return {
    handleEventsScroll,
    wrapperRef,
    eventsListScroll,
  }
}
