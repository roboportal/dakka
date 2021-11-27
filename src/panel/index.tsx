import { render } from 'react-dom'
import { Provider } from 'react-redux'

import StylesProvider from 'components/StylesProvider'
import { store } from './store'

import App from './App'

render(
  <StylesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </StylesProvider>,
  document.getElementById('root'),
)

const m = module as any
if (m.hot) {
  m.hot.accept()
}

const errorHandler = (e: any) => {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  console.log('Fatal error', e)
}

window.onerror = errorHandler
window.onunhandledrejection = errorHandler
