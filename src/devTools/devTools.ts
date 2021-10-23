chrome.devtools.panels.create(
  'Test Recorder',
  '',
  './panel/panel.html',
  (panel) => {
    console.log('Panel created')
  },
)
