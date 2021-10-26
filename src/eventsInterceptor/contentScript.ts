import { shouldProcessMessage } from './utils'

console.log('Content script attached')

function injectCode(src: string) {
  const script: any = document.createElement('script')
  script.src = src
  script.dataset.extid = chrome.runtime.id

  const doc = document.head ?? document.documentElement
  doc?.prepend(script)
}

injectCode(chrome.runtime.getURL('/eventsInterceptor/injection.js'))

window.addEventListener('message', ({ data }) => {
  if (data.id === chrome.runtime.id) {
    chrome.runtime.sendMessage(data)
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (shouldProcessMessage(message.type)) {
    window.postMessage(message)
  }
})
