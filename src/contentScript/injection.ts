import { eventHandler, resizeEventHandler } from './eventLogger'
import { eventTypes, resize } from '../globalConstants/browserEvents'
import { info } from '../shared/logger'

info('Script injected')

eventTypes.forEach((eventTypes) => {
  window.addEventListener(eventTypes, eventHandler, true)
})

window.addEventListener(resize, () =>
  resizeEventHandler(window.innerWidth, window.innerHeight),
)
