import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import eventsList from 'constants/eventsList'
import {
  toggleEventToTrack,
  toggleEventsToTrack,
} from 'store/eventRecorderSlice'

import { SLICE_NAMES, RootState } from 'store/index'

const defaultCollapseState = Object.fromEntries(
  Object.entries(eventsList).map(([, { groupName }]) => [groupName, false]),
)

export default function useEventMask() {
  const dispatch = useDispatch()

  const eventsToTrack = useSelector(
    (state: RootState) => state[SLICE_NAMES.eventRecorder].eventsToTrack,
  )

  const [collapseState, setCollapseState] = useState(defaultCollapseState)

  const handleCollapseChange = (name: string) => {
    setCollapseState({ ...collapseState, [name]: !collapseState[name] })
  }

  const handleActiveChange = (name: string) => {
    dispatch(toggleEventToTrack(name))
  }

  const handleSelectAllEvents = (checked: boolean) =>
    dispatch(toggleEventsToTrack(checked))

  return {
    eventsList,
    collapseState,
    eventsToTrack,
    handleCollapseChange,
    handleActiveChange,
    handleSelectAllEvents,
  }
}