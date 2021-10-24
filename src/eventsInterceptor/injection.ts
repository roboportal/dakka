import { EVENT_INTERCEPTED } from '../constants/messageTypes'

const EVENTS_TO_IGNORE = ['message']

console.log('Script injected')

class HandlersCache {
  storage: Map<
    EventListenerOrEventListenerObject,
    { event: EventListenerOrEventListenerObject; count: number }
  >

  constructor() {
    this.storage = new Map()
  }

  set(
    handler: EventListenerOrEventListenerObject,
    event: EventListenerOrEventListenerObject,
  ) {
    const v = this.storage.get(handler) ?? { event, count: 0 }
    v.count++
    this.storage.set(handler, v)
  }

  get(
    handler: EventListenerOrEventListenerObject,
  ): EventListenerOrEventListenerObject | undefined {
    const v = this.storage.get(handler)

    if (!v) {
      return
    }
    v.count--
    if (v.count === 0) {
      this.storage.delete(handler)
    }
    return v.event
  }
}

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

const handlersCache = new HandlersCache()

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  ...rest
) {
  if (!callback) {
    return
  }
  function eventCallbackWrapper(e: any) {
    if (!EVENTS_TO_IGNORE.includes(type)) {
      eventHandler(e)
    }
    if (typeof callback === 'function') {
      callback(e)
      return
    }
    if (typeof callback === 'object') {
      callback?.handleEvent(e)
    }
  }
  handlersCache.set(callback, eventCallbackWrapper)

  a.call(this, type, eventCallbackWrapper, ...rest)
}

window.EventTarget.prototype.removeEventListener = function (
  type,
  callback,
  ...rest
) {
  if (!callback) {
    return
  }
  const c = handlersCache.get(callback)
  if (!c) {
    return
  }
  r.call(this, type, c, ...rest)
}
