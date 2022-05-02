import { info } from '@roboportal/utils/logger'

chrome.devtools.panels.create('Dakka', '', 'devTools/panel.html', () => {
  info('Dakka Panel created')
})
