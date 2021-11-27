import { useCallback, useState } from 'react'
import { css } from '@emotion/react'

import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'

import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import { SpeedAction } from './Action'

export const actions = [
  { icon: <KeyboardTabIcon />, name: 'Wait For Element' },
  { icon: <HelpCenterIcon />, name: 'Assertion' },
]

export default function ActionsToolbox() {
  const [isOpen, setOpen] = useState(false)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <SpeedDial
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      ariaLabel="Add Element"
      FabProps={{ size: 'medium' }}
      css={css`
        position: absolute;
        bottom: 44px;
        right: 16px;
      `}
      icon={<SpeedDialIcon sx={{ display: 'flex', alignItems: 'center' }} />}
    >
      {actions.map((action) => (
        <SpeedAction
          key={action.name}
          action={action}
          isOpen={isOpen}
          onDragEnd={handleClose}
        />
      ))}
    </SpeedDial>
  )
}
