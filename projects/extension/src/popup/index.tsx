import { render } from 'react-dom'

import { fatal } from '@roboportal/utils/logger'

import StylesProvider from '@/components/StylesProvider'

import App from './App'

interface Module extends NodeModule {
  hot: {
    accept(path?: () => void, callback?: () => void): void
  }
}

render(
  <StylesProvider>
    <App />
  </StylesProvider>,
  document.getElementById('root'),
)

const m = module as Module

if (m.hot) {
  m.hot.accept()
}

const errorHandler: OnErrorEventHandler = (e) => {
  if (e instanceof Event) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
  }
  fatal('Fatal error', e)
}

window.onerror = errorHandler
window.onunhandledrejection = errorHandler
