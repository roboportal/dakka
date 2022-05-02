import { info } from '@roboportal/utils/logger'
import { eventTypes, resize } from '@roboportal/constants/browserEvents'

import { eventHandler, resizeEventHandler } from './eventLogger'

info('Script injected')

eventTypes.forEach((eventTypes) => {
  window.addEventListener(eventTypes, eventHandler, true)
})

window.addEventListener(resize, () =>
  resizeEventHandler(window.innerWidth, window.innerHeight),
)
