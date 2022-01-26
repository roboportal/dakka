import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import eventsList from 'constants/eventsList'
import {
  toggleEventToTrack,
  toggleAllEventsToTrack,
} from 'store/eventRecorderSlice'

import { SLICE_NAMES, RootState } from 'store/index'

const filteredEvents = eventsList.filter((e) => e.groupName)

const defaultCollapseState = Object.fromEntries(
  Object.values(filteredEvents).map(({ groupName }) => [groupName, false]),
)

export default function useEventMask() {
  const dispatch = useDispatch()

  const eventsToTrack = useSelector((state: RootState) => {
    const { composedEventsToTrack } = state[SLICE_NAMES.eventRecorder]
    return Object.fromEntries(
      Object.entries(composedEventsToTrack).map(([key, { selected }]) => [
        key,
        selected,
      ]),
    )
  })

  const [collapseState, setCollapseState] = useState(defaultCollapseState)

  const handleCollapseChange = (name: string) => {
    setCollapseState({ ...collapseState, [name]: !collapseState[name] })
  }

  const handleActiveChange = (name: string) => {
    dispatch(toggleEventToTrack(name))
  }

  const handleSelectAllEvents = (checked: boolean) =>
    dispatch(toggleAllEventsToTrack(checked))

  return {
    eventsList: filteredEvents,
    collapseState,
    eventsToTrack,
    handleCollapseChange,
    handleActiveChange,
    handleSelectAllEvents,
  }
}
