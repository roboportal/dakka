import { useRef, useState, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'

import EventsList from './EventsList'
import Scroll from './Scroll'
import ActionsToolbox from './ActionsToolbox'

import { IEventPayload, ISelectorPayload } from '../../redux/eventRecorderSlice'

interface IEventsProps {
  isWideScreen: boolean
  autoScroll: boolean
  events: IEventPayload[]
  toggleHighlightedElement: React.MouseEventHandler<Element>
  onSelectSelector: (payload: ISelectorPayload) => void
  onEventClick: React.MouseEventHandler<Element>
}

export default function Events({
  events,
  autoScroll,
  toggleHighlightedElement,
  onSelectSelector,
  onEventClick,
  isWideScreen,
}: IEventsProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [eventsListScroll, setEventsListScroll] = useState(0)
  const prevEventCounterRef = useRef(0)

  useEffect(() => {
    const nEvents = events?.length ?? 0
    if (
      !wrapperRef.current ||
      !autoScroll ||
      prevEventCounterRef.current >= nEvents
    ) {
      prevEventCounterRef.current = nEvents
      return
    }
    prevEventCounterRef.current = nEvents
    wrapperRef.current.scrollTo(wrapperRef.current.scrollWidth, 0)
  }, [events?.length])

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
        <EventsList events={events} onSelectSelector={onSelectSelector} />
      </div>
      <Scroll
        wrapper={wrapperRef.current}
        events={events}
        scrollPosition={eventsListScroll}
        isWideScreen={isWideScreen}
      />
      <ActionsToolbox />
    </div>
  )
}
