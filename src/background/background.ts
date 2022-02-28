import { nanoid } from 'nanoid'

import { REDIRECT_STARTED } from '../globalConstants/messageTypes'
import { info } from '../shared/logger'

info('Background SW')

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
        title: tab?.title,
        id: nanoid(),
        triggeredAt: Date.now(),
        type: REDIRECT_STARTED,
        selector: tab?.url,
        innerWidth: tab.width,
        innerHeight: tab.height,
      },
    })
  }
})

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === (chrome.runtime as any).OnInstalledReason.INSTALL) {
    const url = 'https://dakka.dev/getting_started'
    await chrome.tabs.create({ url })
  }
})
