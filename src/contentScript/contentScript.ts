import { shouldProcessMessage } from './utils'

console.log('Content script attached')

function injectCode(src: string) {
  const script: any = document.createElement('script')
  script.src = src
  script.dataset.extid = chrome.runtime.id

  const doc = document.head ?? document.documentElement
  doc?.prepend(script)
}

injectCode(chrome.runtime.getURL('/injection.bundle.js'))

window.addEventListener('message', (p) => {
  const { data } = p

  if (data.id === chrome.runtime.id) {
    try {
      chrome.runtime.sendMessage(data)
    } catch {}
  }
})

chrome.runtime.onMessage.addListener((message) => {
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
