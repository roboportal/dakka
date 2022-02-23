import { eventHandler } from './eventLogger'
import { eventTypes } from '../globalConstants/browserEvents'

console.log('Script injected')

eventTypes.forEach((eventTypes) => {
  window.addEventListener(eventTypes, eventHandler, true)
})
