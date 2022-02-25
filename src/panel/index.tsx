import { render } from 'react-dom'
import { Provider } from 'react-redux'

import StylesProvider from 'components/StylesProvider'
import { store } from './store'
import { fatal } from '../shared/logger'

import App from './App'

interface Module extends NodeModule {
  hot: {
    accept(path?: () => void, callback?: () => void): void
  }
}

render(
  <StylesProvider>
    <Provider store={store}>
      <App />
    </Provider>
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
