import { eventTypes, resize } from '../../globalConstants/browserEvents'

export const eventsToTrack = Object.fromEntries(
  [...eventTypes, resize].map((t) => [t, true]),
)
