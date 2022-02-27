import {
  eventTypes,
  resize,
  redirect,
} from '../../globalConstants/browserEvents'

export const eventsToTrack = Object.fromEntries(
  [...eventTypes, resize, redirect].map((t) => [t, true]),
)
