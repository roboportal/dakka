import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircle from '@mui/icons-material/PlayCircle'
import PauseCircle from '@mui/icons-material/PauseCircle'
import { css } from '@emotion/react'

const ControlPanel = ({
  isRecorderEnabled,
  onRecordEnabledChange,
  onClearEventsByTabId,
}: any) => {
  console.log('isRecorderEnabled', isRecorderEnabled)
  return (
    <AppBar
      css={css`
        margin-bottom: 20px;
      `}
      position="static"
    >
      <Toolbar>
        <IconButton onClick={onRecordEnabledChange} color="primary">
          {isRecorderEnabled ? <PauseCircle /> : <PlayCircle />}
        </IconButton>

        <Button
          size="small"
          onClick={onClearEventsByTabId}
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default ControlPanel
