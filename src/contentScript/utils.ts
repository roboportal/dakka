import { ENABLE_RECORDER, HIGHLIGHT_ELEMENT } from '../constants/messageTypes'

export const shouldProcessMessage = (type: string) =>
  [ENABLE_RECORDER, HIGHLIGHT_ELEMENT].includes(type)
