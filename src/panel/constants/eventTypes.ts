import { eventTypes } from '../../globalConstants/browserEvents'

export const eventsToTrack = Object.fromEntries(
  eventTypes.map((t) => [t, true]),
)
