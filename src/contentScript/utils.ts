import {
  ENABLE_RECORDER,
  HIGHLIGHT_ELEMENT,
} from '../globalConstants/messageTypes'

export const shouldProcessMessage = (type: string) =>
  [ENABLE_RECORDER, HIGHLIGHT_ELEMENT].includes(type)
