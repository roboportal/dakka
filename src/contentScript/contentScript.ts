import { shouldProcessMessage } from './utils'
import { ENABLE_RECORDER } from '../constants/messageTypes'

console.log('Content script attached')

function injectCode(src: string) {
  const script: any = document.createElement('script')
  script.src = src
  script.dataset.extid = chrome.runtime.id

  const doc = document.head ?? document.documentElement
  doc?.prepend(script)
}

injectCode(chrome.runtime.getURL('./contentScript/injection.bundle.js'))

let shouldSendMessage = false

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
