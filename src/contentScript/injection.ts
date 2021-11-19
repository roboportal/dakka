import { eventHandler } from './utils'

const EVENTS_TO_IGNORE = ['message']

console.log('Script injected')

const a = window.EventTarget.prototype.addEventListener
const r = window.EventTarget.prototype.removeEventListener

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  options,
) {
  a.call(this, type, callback, options)
  if (!EVENTS_TO_IGNORE.includes(type)) {
    a.call(this, type, eventHandler, options)
  }
}

window.EventTarget.prototype.removeEventListener = function (
  type,
  callback,
  options,
) {
  r.call(this, type, callback, options)
  r.call(this, type, eventHandler, options)
}
