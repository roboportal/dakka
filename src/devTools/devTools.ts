import { info } from '../shared/logger'

chrome.devtools.panels.create('Dakka', '', 'devTools/panel.html', () => {
  info('Dakka Panel created')
})
