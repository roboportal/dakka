console.log('background')

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated', tabId, changeInfo, tab)

  const shouldExecuteInterceptor =
    changeInfo.status == 'complete' &&
    tab.active &&
    tab?.url?.indexOf('chrome://') === -1

  if (shouldExecuteInterceptor) {
    await chrome.tabs.sendMessage(tabId, 'ololol')
  }
})
