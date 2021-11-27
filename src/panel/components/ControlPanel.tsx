import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked'
import Stack from '@mui/material/Stack'
import { grey, green, red } from '@mui/material/colors'
import Divider from '@mui/material/Divider'

export type IControlPanelProps = {
  isRecorderEnabled: boolean
  isSettingsButtonActive: boolean
  onRecordEnabledChange: () => void
  onClearEventsByTabId: () => void
  onSettingsClick: () => void
  onAutoScrollToggle: () => void
  isAutoScrollEnabled: boolean
}

const ControlPanel = ({
  isRecorderEnabled,
  onRecordEnabledChange,
  onClearEventsByTabId,
  onSettingsClick,
  isSettingsButtonActive,
  onAutoScrollToggle,
  isAutoScrollEnabled,
}: IControlPanelProps) => {
  return (
    <AppBar sx={{ marginBottom: '8px' }} position="static">
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
          <Button
            onClick={onRecordEnabledChange}
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

          <Button
            onClick={onClearEventsByTabId}
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
                }}
              >
                Auto scroll
              </Typography>
            }
          />
        </Stack>
        <IconButton
          onClick={onSettingsClick}
          aria-label="toggle-setup"
          size="small"
        >
          <SettingsApplicationsIcon
            fontSize="small"
            sx={{ color: isSettingsButtonActive ? grey[50] : grey[600] }}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default ControlPanel
