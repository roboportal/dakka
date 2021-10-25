import { useMemo } from 'react'
import ControlPanel from './components/ControlPanel/ControlPanel'
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
      return events[activeTabID]?.map(({ payload }) => (
        <div key={payload.id}>{JSON.stringify(payload)}</div>
      ))
    }
    return null
  }, [activeTabID, events])

  return (
    <div>
      <ControlPanel
        isRecorderEnabled={isRecorderEnabled}
        onRecordEnabledChange={handleIsRecordEnabledChange}
        onClearEventsByTabId={handleClearEventsByTabId}
      />
      {eventsList}
    </div>
  )
}
