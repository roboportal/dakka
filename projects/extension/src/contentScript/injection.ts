import { info } from '@roboportal/utils/logger'
import { eventTypes, resize, change } from '@roboportal/constants/browserEvents'

import {
  eventHandler,
  resizeEventHandler,
  changeEventHandler,
} from './eventLogger'

info('Script injected')

eventTypes.forEach((eventTypes) => {
  window.addEventListener(eventTypes, eventHandler, true)
})

window.addEventListener(resize, () =>
  resizeEventHandler(window.innerWidth, window.innerHeight),
)

window.addEventListener(change, changeEventHandler, true)
