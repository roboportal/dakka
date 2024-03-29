import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import { Tooltip } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked'
import Stack from '@mui/material/Stack'
import { grey, green, red } from '@mui/material/colors'
import Divider from '@mui/material/Divider'

import ExportPanel from './ExportPanel/ExportPanel'
import useControlPanel from '../hooks/useControlPanel'

export type IControlPanelProps = {
  onAutoScrollToggle: () => void
  isAutoScrollEnabled: boolean
}

const ControlPanel = ({
  onAutoScrollToggle,
  isAutoScrollEnabled,
}: IControlPanelProps) => {
  const {
    isRecorderEnabled,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
  } = useControlPanel()

  return (
    <AppBar
      sx={{ backgroundColor: 'background.default', marginBottom: '8px' }}
      position="static"
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Tooltip title="Toggle event recording">
            <Button
              onClick={handleIsRecordEnabledChange}
              sx={{
                color: `${isRecorderEnabled ? green.A400 : red.A200}`,
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                },
              }}
            >
              <RadioButtonChecked fontSize="small" />
              <Typography
                sx={{
                  textTransform: 'none',
                  color: grey[600],
                  marginLeft: '0.2rem',
                  width: 60,
                  fontSize: '0.7rem',
                }}
                variant="caption"
              >
                {isRecorderEnabled ? 'Recording' : 'Record'}
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip title="Clear recorded events">
            <Button
              onClick={handleClearEventsByTabId}
              sx={{
                color: grey[500],
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                },
              }}
              variant="text"
            >
              <DeleteIcon sx={{ color: grey[500] }} fontSize="small" />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: grey[600],
                  marginLeft: '0.2rem',
                }}
                variant="caption"
              >
                Clear
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip title="Toggle Auto Scroll">
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isAutoScrollEnabled}
                  onChange={onAutoScrollToggle}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    marginLeft: '0.2rem',
                    color: grey[600],
                    width: '56px',
                  }}
                >
                  Auto scroll
                </Typography>
              }
            />
          </Tooltip>
          <ExportPanel />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default ControlPanel
