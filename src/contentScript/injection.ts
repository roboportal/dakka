import { eventHandler } from './eventLogger'
import { eventTypes } from '../constants/browserEvents'

console.log('Script injected')

const eventsToRecordMap = Object.fromEntries(eventTypes.map((it) => [it, true]))

const _addEventListener = window.EventTarget.prototype.addEventListener
const _removeEventListener = window.EventTarget.prototype.removeEventListener

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  options,
) {
  _addEventListener.call(this, type, callback, options)

  if (eventsToRecordMap.hasOwnProperty(type)) {
    _addEventListener.call(this, type, eventHandler, options)
  }
}

window.EventTarget.prototype.removeEventListener = function (
  type,
  callback,
  options,
) {
  _removeEventListener.call(this, type, callback, options)
  _removeEventListener.call(this, type, eventHandler, options)
}
