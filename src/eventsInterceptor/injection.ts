import { EVENT_INTERCEPTED } from '../constants/messageTypes'

const EVENTS_TO_IGNORE = ['message']

console.log('Injected to the page')

const id =
  (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
    ?.extid ?? ''

function eventHandler(event: any) {
  const {
    target: { className },
    type,
    value,
  } = event
  const message = {
    id,
    type: EVENT_INTERCEPTED,
    payload: { className, type, value },
  }

  try {
    window.postMessage(message)
  } catch {}
}

const a = window.EventTarget.prototype.addEventListener
const r = window.EventTarget.prototype.removeEventListener

const handlersMap = new Map()

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  ...rest
) {
  function eventCallbackWrapper(e: any) {
    if (!EVENTS_TO_IGNORE.includes(type)) {
      eventHandler(e)
    }

    if (typeof callback === 'function') {
      callback(e)
    }
  }

  handlersMap.set(callback, eventCallbackWrapper)

  a.call(this, type, eventCallbackWrapper, ...rest)
}

window.EventTarget.prototype.removeEventListener = function (
  type,
  callback,
  ...rest
) {
  const c = handlersMap.get(callback)
  handlersMap.delete(callback)
  r.call(this, type, c, ...rest)
}
