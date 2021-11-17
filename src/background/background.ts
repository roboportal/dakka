import { v4 as uuid } from 'uuid'

import { REDIRECT_STARTED } from '../constants/messageTypes'

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
        id: uuid(),
        triggeredAt: Date.now(),
        type: REDIRECT_STARTED,
        selector: tab?.url,
      },
    })
  }
})
