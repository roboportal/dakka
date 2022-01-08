import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'

import EventsSettings from 'components/EventsSettings/EventsSettings'
import ControlPanel from 'components/ControlPanel'
import EventsWrapper from 'components/EventsWrapper/EventsWrapper'
import AllowInjection from 'components/AllowInjection'

import useEventRecorder from 'hooks/useEventRecorder'
import useAllowInjection from 'hooks/useAllowInjection'
import useElementSelect from 'hooks/useElementSelect'
import useToggle from 'hooks/useToggle'

export default function App() {
  const [isSidePanelVisible, toggleSidePanel] = useToggle(false)

  const [isAutoScrollEnabled, toggleAutoScroll] = useToggle(true)

  const {
    events,
    isManualEventInsert,
    activeTabID,
    isRecorderEnabled,
    expandedId,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
    toggleHighlightedElement,
    handleSelectSelector,
    handleEventClick,
    handleInsertBlock,
    handleSetActiveBlockId,
    handleSetExpandedId,
    activeBlockId,
  } = useEventRecorder()

  const { isInjectionAllowed, allowInjection } = useAllowInjection()
  const { enableSelectElement } = useElementSelect()

  if (!isInjectionAllowed) {
    return <AllowInjection allowInjection={allowInjection} />
  }

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
        <EventsWrapper
          activeBlockId={activeBlockId}
          handleSetActiveBlockId={handleSetActiveBlockId}
          handleSetExpandedId={handleSetExpandedId}
          expandedId={expandedId}
          enableSelectElement={enableSelectElement}
          isManualEventInsert={isManualEventInsert}
          onInsertBlock={handleInsertBlock}
          events={events[activeTabID]}
          toggleHighlightedElement={toggleHighlightedElement}
          onSelectSelector={handleSelectSelector}
          isWideScreen={!isSidePanelVisible}
          autoScroll={isAutoScrollEnabled}
          onEventClick={handleEventClick}
        />
        <Collapse in={isSidePanelVisible} orientation="horizontal">
          <EventsSettings />
        </Collapse>
      </Box>
    </div>
  )
}
