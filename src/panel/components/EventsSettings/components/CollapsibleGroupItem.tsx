import { ReactElement } from 'react'
import { css } from '@emotion/react'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import { IEventGroupItem } from 'constants/eventsList'

interface ICollapsibleGroupItemProps {
  children: ReactElement
  group: IEventGroupItem
  handleCollapseChange: (n: string) => void
  collapseState: Record<string, boolean>
}

export default function CollapsibleGroupItem({
  children,
  group,
  handleCollapseChange,
  collapseState,
}: ICollapsibleGroupItemProps) {
  return (
    <ListItem disablePadding disableGutters>
      <List
        disablePadding
        css={css`
          width: 100%;
        `}
      >
        <ListItemButton
          onClick={() => {
            handleCollapseChange(group.groupName)
          }}
          css={css`
            padding-top: 0;
            padding-bottom: 0;
          `}
        >
          <ListItemText primary={group.groupName} />
          {collapseState[group.groupName] ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse
          in={collapseState[group.groupName]}
          timeout="auto"
          unmountOnExit
        >
          {children}
        </Collapse>
      </List>
    </ListItem>
  )
}
