import { useRef, useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'

import {
  EventListItem,
  ISelectorPayload,
  IEventBlockPayload,
  IAssetionPaylod,
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
  enableSelectElement: () => void
  handleSetActiveBlockId: (id: string) => void
  handleSetExpandedId: (id: string) => void
  activeBlockId: string | null
  expandedId: string | null
  handleSetAssertProperties: (payload: IAssetionPaylod) => void
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
  enableSelectElement,
  handleSetActiveBlockId,
  expandedId,
  handleSetExpandedId,
  handleSetAssertProperties,
  activeBlockId,
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
          onSetAssertProperties={handleSetAssertProperties}
          activeBlockId={activeBlockId}
          handleSetActiveBlockId={handleSetActiveBlockId}
          handleSetExpandedId={handleSetExpandedId}
          expandedId={expandedId}
          enableSelectElement={enableSelectElement}
          setDragOverIndex={setDragOverIndex}
          dragOverIndex={dragOverIndex}
          onInsertBlock={onInsertBlock}
          events={events}
          onSelectSelector={onSelectSelector}
        />
      </div>
      <Scroll
        expandedId={expandedId}
        wrapper={wrapperRef.current}
        events={events}
        scrollPosition={eventsListScroll}
        isWideScreen={isWideScreen}
      />
      <ActionsToolbox setDragOverIndex={setDragOverIndex} />
    </div>
  )
}
