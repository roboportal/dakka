import { css } from '@emotion/react'

import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'

import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'

const actions = [
  { icon: <KeyboardTabIcon />, name: 'Wait For Element' },
  { icon: <HelpCenterIcon />, name: 'Assertion' },
]

export default function ActionsToolbox() {
  return (
    <SpeedDial
      ariaLabel="Add Element"
      css={css`
        position: absolute;
        bottom: 16px;
        right: 16px;
      `}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          draggable
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  )
}
