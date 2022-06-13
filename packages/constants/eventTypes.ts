import { eventTypes, resize, redirect, fileUpload } from './browserEvents'

export const eventsToTrack = Object.fromEntries(
  [...eventTypes, resize, redirect, fileUpload].map((t) => [t, true]),
)
