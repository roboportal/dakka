import { useRef, useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'

import {
  EventListItem,
  ISelectorPayload,
  IEventBlockPayload,
} from 'store/eventRecorderSlice'

import EventsList from './components/EventsList/EventsList'
import Scroll from './components/Scroll'
import ActionsToolbox from './components/ActionsToolbox/ActionsToolbox'

interface IEventsWrapperProps {
  isWideScreen: boolean
  autoScroll: boolean
  events: EventListItem[]
  toggleHighlightedElement: React.MouseEventHandler<Element>
  onSelectSelector: (payload: ISelectorPayload) => void
  onEventClick: React.MouseEventHandler<Element>
  isManualEventInsert: boolean
  onInsertBlock: (payload: IEventBlockPayload) => void
}

export default function EventsWrapper({
  events,
  autoScroll,
  toggleHighlightedElement,
  onSelectSelector,
  onEventClick,
  isWideScreen,
  onInsertBlock,
  isManualEventInsert,
}: IEventsWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [eventsListScroll, setEventsListScroll] = useState(0)
  const [dragOverIndex, setDragOverIndex] = useState(Number.MIN_SAFE_INTEGER)
  const prevEventCounterRef = useRef(0)

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
  }, [events?.length, isManualEventInsert])

  const handleEventsScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollPosition = (e.target as any).scrollLeft
      setEventsListScroll(scrollPosition)
    },
    [setEventsListScroll],
  )

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: relative;
        width: ${isWideScreen ? '100%' : '80vw'};
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: row;
          overflow-x: scroll;

          height: calc(100% - 44px);
          &::-webkit-scrollbar {
            display: none;
          }
        `}
        onScroll={handleEventsScroll}
        onMouseOver={toggleHighlightedElement}
        onMouseOut={toggleHighlightedElement}
        onClick={onEventClick}
        ref={wrapperRef}
      >
        <EventsList
          setDragOverIndex={setDragOverIndex}
          dragOverIndex={dragOverIndex}
          onInsertBlock={onInsertBlock}
          events={events}
          onSelectSelector={onSelectSelector}
        />
      </div>
      <Scroll
        wrapper={wrapperRef.current}
        events={events}
        scrollPosition={eventsListScroll}
        isWideScreen={isWideScreen}
      />
      <ActionsToolbox setDragOverIndex={setDragOverIndex} />
    </div>
  )
}
