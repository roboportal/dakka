import { useMemo } from 'react'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import useEventRecorder from './hooks/useEventRecorder'

export default function App() {
  const {
    events,
    activeTabID,
    isRecorderEnabled,
    handleIsRecordEnabledChange,
    handleClearEventsByTabId,
  } = useEventRecorder()

  const eventsList = useMemo(() => {
    if (activeTabID > -1) {
      return events[activeTabID]?.map((event) => (
        <div key={event.id}>{JSON.stringify(event)}</div>
      ))
    }
    return null
  }, [activeTabID, events])

  return (
    <div>
      <Switch
        checked={isRecorderEnabled}
        onChange={handleIsRecordEnabledChange}
      />

      <Button
        onClick={handleClearEventsByTabId}
        variant="outlined"
        startIcon={<DeleteIcon />}
      >
        Clear Records
      </Button>
      {eventsList}
    </div>
  )
}
