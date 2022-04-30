import { eventTypes, resize, redirect } from './browserEvents'

export const eventsToTrack = Object.fromEntries(
  [...eventTypes, resize, redirect].map((t) => [t, true]),
)
