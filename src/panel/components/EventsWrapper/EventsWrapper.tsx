import { useRef, useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'
import { useSelector } from 'react-redux'

import {
  ISelectorPayload,
  IEventBlockPayload,
  IAssertionPayload,
} from 'store/eventRecorderSlice'
import { getActiveEvents, getIsManualEventInsert } from 'store/eventSelectors'
import EventsList from './components/EventsList/EventsList'
import Scroll from './components/Scroll'
import ActionsToolbox from './components/ActionsToolbox/ActionsToolbox'

interface IEventsWrapperProps {
  isWideScreen: boolean
  autoScroll: boolean
  toggleHighlightedElement: React.MouseEventHandler<Element>
  onSelectSelector: (payload: ISelectorPayload) => void
  onEventClick: React.MouseEventHandler<Element>
  onInsertBlock: (payload: IEventBlockPayload) => void
  enableSelectElement: () => void
  onSetActiveBlockId: (id: string) => void
  onSetExpandedId: (id: string) => void
  onSetAssertProperties: (payload: IAssertionPayload) => void
  prefersDarkMode: boolean
}

export default function EventsWrapper({
  autoScroll,
  toggleHighlightedElement,
  onSelectSelector,
  onEventClick,
  isWideScreen,
  onInsertBlock,
  enableSelectElement,
  onSetActiveBlockId,
  onSetExpandedId,
  onSetAssertProperties,
  prefersDarkMode,
}: IEventsWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [eventsListScroll, setEventsListScroll] = useState(0)
  const [dragOverIndex, setDragOverIndex] = useState(Number.MIN_SAFE_INTEGER)
  const prevEventCounterRef = useRef(0)
  const events = useSelector(getActiveEvents)
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

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: relative;
        width: ${isWideScreen ? '100%' : '80vw'};
        height: calc(100vh - 52px);
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: row;
          overflow-x: scroll;
          height: 100%;
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
          onSetAssertProperties={onSetAssertProperties}
          prefersDarkMode={prefersDarkMode}
          onSetActiveBlockId={onSetActiveBlockId}
          onSetExpandedId={onSetExpandedId}
          enableSelectElement={enableSelectElement}
          setDragOverIndex={setDragOverIndex}
          dragOverIndex={dragOverIndex}
          onInsertBlock={onInsertBlock}
          events={events}
          onSelectSelector={onSelectSelector}
        />
      </div>
      <Scroll
        prefersDarkMode={prefersDarkMode}
        wrapper={wrapperRef.current}
        events={events}
        scrollPosition={eventsListScroll}
        isWideScreen={isWideScreen}
      />
      <ActionsToolbox setDragOverIndex={setDragOverIndex} />
    </div>
  )
}
