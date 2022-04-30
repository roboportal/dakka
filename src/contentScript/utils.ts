import {
  ENABLE_RECORDER,
  HIGHLIGHT_ELEMENT,
} from '@roboportal/constants/messageTypes'

export const shouldProcessMessage = (type: string) =>
  [ENABLE_RECORDER, HIGHLIGHT_ELEMENT].includes(type)
