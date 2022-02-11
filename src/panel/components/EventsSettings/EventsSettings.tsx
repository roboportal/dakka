import { useCallback } from 'react'
import { css } from '@emotion/react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import CollapsibleGroupItem from './components/CollapsibleGroupItem'
import GroupEventsItem from './components/GroupEventsItem'
import useEventMask from './hooks/useEventMask'

export default function EventsSettings({
  prefersDarkMode,
}: {
  prefersDarkMode: boolean
}) {
  const {
    eventsList,
    collapseState,
    eventsToTrack,
    handleCollapseChange,
    handleSelectAllEvents,
    handleActiveChange,
  } = useEventMask()

  const toggleSelectAll = useCallback(
    () => handleSelectAllEvents(true),
    [handleSelectAllEvents],
  )

  const toggleDeselectAll = useCallback(
    () => handleSelectAllEvents(false),
    [handleSelectAllEvents],
  )

  return (
    <List
      subheader={
        <ListSubheader
          css={css`
            background-color: ${prefersDarkMode ? '#0a1929' : '#D3D3D3'};
            color: inherit;
            padding: 12px;
          `}
        >
          <h3
            css={css`
              margin: 0px;
            `}
          >
            Events to track
          </h3>
          <Box
            css={css`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <Button
              css={css`
                font-size: 0.6rem;
              `}
              onClick={toggleSelectAll}
            >
              Select All
            </Button>
            <Button
              css={css`
                font-size: 0.6rem;
              `}
              onClick={toggleDeselectAll}
            >
              Deselect All
            </Button>
          </Box>
        </ListSubheader>
      }
      disablePadding
      css={css`
        width: 20vw;
        min-width: 240px;
        height: 100%;
        overflow-y: auto;
      `}
    >
      {eventsList.map((group) => (
        <CollapsibleGroupItem
          key={group.groupName}
          group={group}
          handleCollapseChange={handleCollapseChange}
          collapseState={collapseState}
        >
          <GroupEventsItem
            group={group}
            eventsToTrack={eventsToTrack}
            handleActiveChange={handleActiveChange}
          />
        </CollapsibleGroupItem>
      ))}
    </List>
  )
}
