import { css } from '@emotion/react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'

import { IEventGroupItem } from '../../constants/eventsList'

interface IGroupEventsItemProps {
  group: IEventGroupItem
  eventsToTrack: Record<string, boolean>
  handleActiveChange: (n: string) => void
}

export default function GroupEventsItem({
  group,
  eventsToTrack,
  handleActiveChange,
}: IGroupEventsItemProps) {
  return (
    <List disablePadding>
      {group.events.map((event) => (
        <ListItem
          key={event.key}
          disablePadding
          css={css`
            padding-left: 32px;
          `}
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={eventsToTrack[event.key]}
              tabIndex={-1}
              disableRipple
              onClick={() => handleActiveChange(event.key)}
              css={css`
                padding-top: 0;
                padding-bottom: 0;
              `}
            />
          </ListItemIcon>
          <ListItemText primary={event.title} />
        </ListItem>
      ))}
    </List>
  )
}
