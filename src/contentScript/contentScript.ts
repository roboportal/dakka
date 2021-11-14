import { shouldProcessMessage } from './utils'
import { REDIRECT_STARTED } from '../constants/messageTypes'

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

  if (data.id === chrome.runtime.id || data?.type === REDIRECT_STARTED) {
    chrome.runtime.sendMessage(data)
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (shouldProcessMessage(message.type)) {
    window.postMessage(message)
  }
})
