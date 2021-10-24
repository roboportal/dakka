import React, { useMemo } from 'react'

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
        <div>{JSON.stringify(event)}</div>
      ))
    }
    return null
  }, [activeTabID, events])

  return (
    <div>
      <input
        type="checkbox"
        checked={isRecorderEnabled}
        onChange={handleIsRecordEnabledChange}
      />

      <button onClick={handleClearEventsByTabId}>Clear Records</button>
      {eventsList}
    </div>
  )
}
