import { useMemo } from 'react'
import Switch from '@mui/material/Switch'
import Buttun from '@mui/material/Button'

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

      <Buttun variant="contained" onClick={handleClearEventsByTabId}>
        Clear Records
      </Buttun>
      {eventsList}
    </div>
  )
}
