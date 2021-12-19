import { shouldProcessMessage } from './utils'
import {
  ENABLE_RECORDER,
  ALLOW_INJECTING,
  IS_INJECTION_ALLOWED,
  INJECTION_ALLOWED_STATUS,
} from '../globalConstants/messageTypes'
import { SESSION_STORAGE_KEY } from './constants'

console.log('Content script attached')

const isInjectingAllowed = sessionStorage.getItem(SESSION_STORAGE_KEY)
let shouldSendMessage = false

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
    chrome.runtime.sendMessage(data)
  }
})

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
  if (shouldProcessMessage(message.type)) {
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
