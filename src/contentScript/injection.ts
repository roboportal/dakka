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
      el.style.position = 'fixed'
      el.style.backgroundColor = '#0080ff'
      el.style.opacity = '0.5'
      el.style.display = 'none'
      el.style.border = '1px dashed gold'

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

const nop = () => {}

const alreadyInterceptedSymbol = Symbol('alreadyInterceptedSymbol')

window.EventTarget.prototype.addEventListener = function (
  type,
  callback,
  options,
) {
  const eventCallbackWrapper = (e: any) => {
    if (typeof callback === 'function') {
      callback?.call?.(this, e)
    } else if (typeof callback === 'object') {
      callback?.handleEvent?.(e)
    }
    if (
      shouldSendMessage &&
      !EVENTS_TO_IGNORE.includes(type) &&
      !e[alreadyInterceptedSymbol]
    ) {
      e[alreadyInterceptedSymbol] = true
      eventHandler(e)
    }
  }

  handlersCache.set(callback ?? nop, eventCallbackWrapper)

  a.call(this, type, eventCallbackWrapper, options)
}

window.EventTarget.prototype.removeEventListener = function (
  type,
  callback,
  options,
) {
  if (!callback) {
    return
  }
  const c = handlersCache.get(callback)
  if (!c) {
    return
  }
  r.call(this, type, c, options)
}
