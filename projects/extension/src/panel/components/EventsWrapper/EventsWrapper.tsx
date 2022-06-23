import { useState } from 'react'
import { css } from '@emotion/react'

import useScroll from '@/hooks/useScroll'
import useEventBlockActions from '@/hooks/useEventBlockActions'

import EventsList from './components/EventsList/EventsList'
import Scroll from './components/Scroll'
import ActionsToolbox from './components/ActionsToolbox/ActionsToolbox'

interface IEventsWrapperProps {
  autoScroll: boolean
  prefersDarkMode: boolean
}

export default function EventsWrapper({
  autoScroll,
  prefersDarkMode,
}: IEventsWrapperProps) {
  const [dragOverIndex, setDragOverIndex] = useState(Number.MIN_SAFE_INTEGER)

  const { handleEventsScroll, wrapperRef, eventsListScroll } =
    useScroll(autoScroll)

  const { toggleHighlightedElement, handleEventClick } = useEventBlockActions()

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        position: relative;
        height: calc(100vh - 52px);
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: row;
          overflow-x: scroll;
          width: calc(100vw - 35px);
          height: 100%;
          &::-webkit-scrollbar {
            display: none;
          }
        `}
        onScroll={handleEventsScroll}
        onMouseOver={toggleHighlightedElement}
        onMouseOut={toggleHighlightedElement}
        onClick={handleEventClick}
        ref={wrapperRef}
      >
        <EventsList
          prefersDarkMode={prefersDarkMode}
          setDragOverIndex={setDragOverIndex}
          dragOverIndex={dragOverIndex}
        />
      </div>
      <Scroll
        prefersDarkMode={prefersDarkMode}
        wrapperRef={wrapperRef}
        scrollPosition={eventsListScroll}
      />
      <ActionsToolbox setDragOverIndex={setDragOverIndex} />
    </div>
  )
}
