import { useState, useCallback } from 'react'
import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'

import EventsSettings from './components/EventsSettings/EventsSettings'
import ControlPanel from './components/ControlPanel/ControlPanel'
import Events from './components/Events/Events'

import useEventRecorder from './hooks/useEventRecorder'

export default function App() {
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false)
  const toggleSidePanel = useCallback(
    () => setIsSidePanelVisible((v) => !v),
    [],
  )

  const {
    events,
    activeTabID,
    isRecorderEnabled,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
  } = useEventRecorder()

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: #0a1929;
      `}
    >
      <ControlPanel
        isRecorderEnabled={isRecorderEnabled}
        onRecordEnabledChange={handleIsRecordEnabledChange}
        onClearEventsByTabId={handleClearEventsByTabId}
        onSettingsClick={toggleSidePanel}
        isSettingsButtonActive={isSidePanelVisible}
      />
      <Box
        css={css`
          overflow: hidden;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: calc(100vh - 36px - 8px);
          padding-left: 8px;
          padding-right: 8px;
        `}
      >
        <Events
          events={events[activeTabID]}
          toggleHighlightedElement={toggleHighlightedElement}
          isWideScreen={!isSidePanelVisible}
        />
        <Collapse in={isSidePanelVisible} orientation="horizontal">
          <EventsSettings />
        </Collapse>
      </Box>
    </div>
  )
}
