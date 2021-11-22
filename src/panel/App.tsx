import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'

import EventsSettings from './components/EventsSettings/EventsSettings'
import ControlPanel from './components/ControlPanel/ControlPanel'
import Events from './components/Events/Events'

import useEventRecorder from './hooks/useEventRecorder'
import useToggle from './hooks/useToggle'
export default function App() {
  const [isSidePanelVisible, toggleSidePanel] = useToggle(false)

  const [isAutoScrollEnabled, toggleAutoScroll] = useToggle(true)

  const {
    events,
    activeTabID,
    isRecorderEnabled,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
    handleSelectSelector,
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
        onAutoScrollToggle={toggleAutoScroll}
        isAutoScrollEnabled={isAutoScrollEnabled}
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
          handleSelectSelector={handleSelectSelector}
          isWideScreen={!isSidePanelVisible}
          autoScroll={isAutoScrollEnabled}
        />
        <Collapse in={isSidePanelVisible} orientation="horizontal">
          <EventsSettings />
        </Collapse>
      </Box>
    </div>
  )
}
