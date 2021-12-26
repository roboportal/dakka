import { shouldProcessMessage } from './utils'
import {
  ENABLE_RECORDER,
  ALLOW_INJECTING,
  IS_INJECTION_ALLOWED,
  INJECTION_ALLOWED_STATUS,
  ENABLE_SELECT_ELEMENT,
  ELEMENT_SELECTED,
  HOVER_ELEMENT,
} from '../globalConstants/messageTypes'
import { SESSION_STORAGE_KEY } from './constants'
import { composeEvent } from './composeEvent'

console.log('Content script attached')

const isInjectingAllowed = sessionStorage.getItem(SESSION_STORAGE_KEY)
let shouldSendMessage = false
let selectElementEnabled = false
let hoveredElement: any = null

function injectCode(src: string) {
  const script: any = document.createElement('script')
  script.src = src
  script.dataset.extid = chrome.runtime.id

  const doc = document.head ?? document.documentElement
  doc?.prepend(script)
}

if (isInjectingAllowed) {
  injectCode(chrome.runtime.getURL('./contentScript/injection.bundle.js'))
}

window.addEventListener('message', (p) => {
  if (!shouldSendMessage) {
    return
  }

  const { data } = p

  if (data.id === chrome.runtime.id) {
    if (selectElementEnabled && data.type !== HOVER_ELEMENT) {
      return
    }

    chrome.runtime.sendMessage(data)
  }
})

const mouseOverHandler = (event: any) => {
  if (selectElementEnabled) {
    event.stopImmediatePropagation()
    const extensionId =
      (document?.querySelector('script[data-extid]') as HTMLElement)?.dataset
        ?.extid ?? ''
    const message = composeEvent({
      event,
      extensionId,
      eventType: HOVER_ELEMENT,
    })
    window.postMessage(message)
    hoveredElement = message
  }
}

const focusHandler = (event: FocusEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  window.removeEventListener('focus', focusHandler)
}

const blurHandler = (event: FocusEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  window.removeEventListener('blur', blurHandler)
}

const mouseDownHandler = (event: MouseEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  window.removeEventListener('mousedown', mouseDownHandler)
}

const mouseUpHandler = (event: MouseEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  window.removeEventListener('mouseup', mouseUpHandler)
}

const mouseClickHandler = (event: MouseEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  window.postMessage({ ...hoveredElement, type: ELEMENT_SELECTED })
  selectElementEnabled = false
  hoveredElement = null
  window.removeEventListener('mouseover', mouseOverHandler)
  window.removeEventListener('click', mouseClickHandler)
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === ALLOW_INJECTING) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
    location.reload()
    return
  }
  if (message.type === IS_INJECTION_ALLOWED) {
    chrome.runtime.sendMessage({
      id: chrome.runtime.id,
      type: INJECTION_ALLOWED_STATUS,
      payload: {
        isInjectingAllowed,
      },
    })
    return
  }
  if (message.type === ENABLE_RECORDER) {
    shouldSendMessage = message.isRecorderEnabled
    return
  }

  if (message.type === ENABLE_SELECT_ELEMENT) {
    selectElementEnabled = true
    window.addEventListener('mouseover', mouseOverHandler, true)
    window.addEventListener('focus', focusHandler, true)
    window.addEventListener('blur', blurHandler, true)
    window.addEventListener('click', mouseClickHandler, true)
    window.addEventListener('mousedown', mouseDownHandler, true)
    window.addEventListener('mouseup', mouseUpHandler, true)
  }

  if (shouldProcessMessage(message.type) && !selectElementEnabled) {
    window.postMessage(message)
  }
})

const errorHandler = (e: any) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  console.log('Fatal error', e)
}

window.onerror = errorHandler
window.onunhandledrejection = errorHandler
