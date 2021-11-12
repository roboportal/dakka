console.log('Background SW')

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated', tabId, changeInfo, tab)

  const shouldExecuteInterceptor =
    changeInfo.status == 'complete' &&
    tab.active &&
    tab?.url?.indexOf('chrome://') === -1

  if (shouldExecuteInterceptor) {
    await chrome.tabs.sendMessage(tabId, {
      type: 'started',
      payload: {
        url: tab.url,
        id: tabId,
        triggeredAt: Date.now(),
        type: 'redirect',
        selector: tab.url,
      },
    })
  }
})
