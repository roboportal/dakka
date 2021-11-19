import { css } from '@emotion/react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'

import CollapsibleGroupItem from './CollapsibleGroupItem'
import GroupEventsItem from './GroupEventsItem'
import useEventMask from '../../hooks/useEventMask'

export default function EventsSettings() {
  const {
    eventsList,
    collapseState,
    eventsToTrack,
    handleCollapseChange,
    handleActiveChange,
  } = useEventMask()

  return (
    <List
      subheader={
        <ListSubheader
          css={css`
            background-color: #0a1929;
            color: inherit;
          `}
        >
          <h3>Events to track</h3>
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
