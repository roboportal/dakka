import { nanoid } from 'nanoid'

import { REDIRECT_STARTED } from '../globalConstants/messageTypes'

console.log('Background SW')

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const shouldLogRedirect =
    tab.status === 'complete' &&
    tab.active &&
    tab?.url?.indexOf('chrome://') === -1

  if (shouldLogRedirect) {
    await chrome.runtime.sendMessage({
      type: REDIRECT_STARTED,
      id: chrome.runtime.id,
      payload: {
        url: tab?.url,
        id: nanoid(),
        triggeredAt: Date.now(),
        type: REDIRECT_STARTED,
        selector: tab?.url,
      },
    })
  }
})
