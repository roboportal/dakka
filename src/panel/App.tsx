import { css } from '@emotion/react'
import Box from '@mui/material/Box'

import EventsMask from './components/EventsMask/EventsMask'
import ControlPanel from './components/ControlPanel/ControlPanel'
import EventsList from './components/EventsList'

import useEventRecorder from './hooks/useEventRecorder'

export default function App() {
  const {
    events,
    activeTabID,
    isRecorderEnabled,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
  } = useEventRecorder()

  return (
    <div>
      <ControlPanel
        isRecorderEnabled={isRecorderEnabled}
        onRecordEnabledChange={handleIsRecordEnabledChange}
        onClearEventsByTabId={handleClearEventsByTabId}
      />
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: row;
            width: 80vw;
            overflow-x: scroll;
            padding-left: 8px;
            padding-right: 8px;
          `}
          onMouseOver={toggleHighlightedElement}
          onMouseOut={toggleHighlightedElement}
        >
          <EventsList events={events[activeTabID]} />
        </div>
        <EventsMask />
      </Box>
    </div>
  )
}
