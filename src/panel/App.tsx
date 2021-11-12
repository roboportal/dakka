import { css } from '@emotion/react'
import Box from '@mui/material/Box'

import EventsMask from './components/EventsMask/EventsMask'
import ControlPanel from './components/ControlPanel/ControlPanel'
import Events from './components/Events/Events'

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

  console.log('events', events)
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
        <Events
          events={events[activeTabID]}
          toggleHighlightedElement={toggleHighlightedElement}
        />
        <EventsMask />
      </Box>
    </div>
  )
}
