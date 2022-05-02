import { info, fatal } from '@roboportal/utils/logger'
import {
  ENABLE_RECORDER,
  ALLOW_INJECTING,
  IS_INJECTION_ALLOWED,
  INJECTION_ALLOWED_STATUS,
  ENABLE_SELECT_ELEMENT,
  DISABLE_SELECT_ELEMENT,
  ELEMENT_SELECTED,
  HOVER_ELEMENT,
} from '@roboportal/constants/messageTypes'

import { SESSION_STORAGE_KEY } from './constants'
import { composeEvent } from './composeEvent'
import { shouldProcessMessage } from './utils'

info('Content script attached')

const eventsToPassWhenRecordingDisabled = [ELEMENT_SELECTED]

const isInjectingAllowed = sessionStorage.getItem(SESSION_STORAGE_KEY)
let shouldSendMessage = false
let selectElementEnabled = false
let hoveredElement: any = null

function injectCode(src: string) {
  const script: HTMLScriptElement = document.createElement('script')
  script.src = src
  script.dataset.extid = chrome.runtime.id

  const doc = document.head ?? document.documentElement
  doc?.prepend(script)
}

if (isInjectingAllowed) {
  injectCode(chrome.runtime.getURL('./contentScript/injection.bundle.js'))
}

window.addEventListener('message', (p) => {
  if (
    !shouldSendMessage &&
    !eventsToPassWhenRecordingDisabled.includes(p.data.type)
  ) {
    return
  }

  const { data } = p

  if (data.id === chrome.runtime.id) {
    if (p.data.type === ELEMENT_SELECTED) {
      chrome.runtime.sendMessage(data)
      return
    }

    if (selectElementEnabled && data.type !== HOVER_ELEMENT) {
      return
    }

    chrome.runtime.sendMessage(data)
  }
})

const mouseOverHandler = (event: MouseEvent) => {
  if (selectElementEnabled && (event?.target as any)?.tagName !== 'IFRAME') {
    event.stopImmediatePropagation()
    const extensionId = chrome.runtime.id
    const message = composeEvent({
      event,
      extensionId,
      eventType: HOVER_ELEMENT,
    })
    window.postMessage(message)
    hoveredElement = message
  }
}

const mouseOutHandler = (event: MouseEvent) => {
  if (selectElementEnabled) {
    event.stopImmediatePropagation()
    window.postMessage({
      id: chrome.runtime.id,
      type: HOVER_ELEMENT,
    })
    hoveredElement = null
  }
}

const mouseClickHandler = (event: MouseEvent) => {
  event.stopImmediatePropagation()
  event.preventDefault()

  const url = window.location.href
  const title = document.title

  const target = event?.target as HTMLElement
  const text = target?.firstChild?.nodeValue

  const attributesMap = Object.fromEntries(
    Array.from(target?.attributes)
      .filter((f) => f)
      .map((attr) => [attr.name, attr.value]),
  )

  hoveredElement.payload = {
    ...hoveredElement.payload,
    url,
    title,
    text,
    attributesMap,
  }

  window.postMessage({
    ...hoveredElement,
    id: chrome.runtime.id,
    type: ELEMENT_SELECTED,
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse()
  if (message.type === ALLOW_INJECTING) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
    location.reload()
    return true
  }
  if (message.type === IS_INJECTION_ALLOWED) {
    chrome.runtime.sendMessage({
      id: chrome.runtime.id,
      type: INJECTION_ALLOWED_STATUS,
      payload: {
        isInjectingAllowed,
      },
    })
    return true
  }
  if (message.type === ENABLE_RECORDER) {
    shouldSendMessage = message.isRecorderEnabled
    return true
  }

  if (message.type === ENABLE_SELECT_ELEMENT) {
    selectElementEnabled = true

    window.addEventListener('click', mouseClickHandler, true)
    window.addEventListener('mouseover', mouseOverHandler, true)
    window.addEventListener('mouseout', mouseOutHandler, true)
  }

  if (message.type === DISABLE_SELECT_ELEMENT) {
    selectElementEnabled = false
    hoveredElement = null
    window.postMessage({
      id: chrome.runtime.id,
      type: HOVER_ELEMENT,
    })
    window.removeEventListener('click', mouseClickHandler, true)
    window.removeEventListener('mouseover', mouseOverHandler, true)
    window.addEventListener('mouseout', mouseOutHandler, true)
  }

  if (shouldProcessMessage(message.type) && !selectElementEnabled) {
    window.postMessage(message)
  }
  return true
})

const errorHandler: OnErrorEventHandler = (e) => {
  if (e instanceof Event) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
  }
  fatal('Fatal error', e)
}

window.onerror = errorHandler
window.onunhandledrejection = errorHandler
