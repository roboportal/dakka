import { css } from '@emotion/react'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'

import CollapsibleGroupItem from './CollapsibleGroupItem'
import GroupEventsItem from './GroupEventsItem'
import useEventMask from '../../hooks/useEventMask'

export default function EventsMask() {
  const {
    eventsList,
    collapseState,
    eventsToTrack,
    handleCollapseChange,
    handleActiveChange,
  } = useEventMask()

  return (
    <List
      subheader={<ListSubheader>Events to track</ListSubheader>}
      disablePadding
      css={css`
        width: 20vw;
        min-width: 240px;
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