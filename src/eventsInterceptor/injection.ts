import { HandlersCache, eventHandler } from './utils'
import { ENABLE_RECORDER, HIGHLIGHT_ELEMENT } from '../constants/messageTypes'

const EVENTS_TO_IGNORE = ['message']

console.log('Script injected')

const a = window.EventTarget.prototype.addEventListener
const r = window.EventTarget.prototype.removeEventListener

const handlersCache = new HandlersCache()

let shouldSendMessage = false
let highLightElement: HTMLDivElement | null = null

window.addEventListener('message', ({ data }) => {
  if (data.type === ENABLE_RECORDER) {
    shouldSendMessage = data.isRecorderEnabled
  }

  if (data.type === HIGHLIGHT_ELEMENT) {
    const selector: string = data.selector
    if (!highLightElement && selector) {
      const el = document.createElement('div')
      el.style.position = 'absolute'
      el.style.backgroundColor = '#0080ff'
      el.style.opacity = '0.7'
      el.style.display = 'none'
      document.body.append(el)
      highLightElement = el
    }

    if (!highLightElement) {
      return
    }

    if (selector) {
      const { top, left, width, height } = document
        .querySelector(selector)
        ?.getBoundingClientRect() ?? { top: 0, bottom: 0, left: 0, right: 0 }
      if (top && width && left && height) {
        highLightElement.style.top = top + 'px'
        highLightElement.style.width = width + 'px'
        highLightElement.style.left = left + 'px'
        highLightElement.style.height = height + 'px'
        highLightElement.style.display = 'block'
        highLightElement.style.zIndex = '999999999'
      }
    } else {
      highLightElement.style.display = 'none'
    }
  }
})

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  ...rest
) {
  if (!callback) {
    return
  }
  function eventCallbackWrapper(e: any) {
    if (shouldSendMessage && !EVENTS_TO_IGNORE.includes(type)) {
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
