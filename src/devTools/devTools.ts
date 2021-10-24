chrome.devtools.panels.create(
  'Test Recorder',
  '',
  './panel/panel.html',
  (panel) => {
    console.log('Test Recorder Panel created')
  },
)
