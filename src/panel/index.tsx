import { render } from 'react-dom'
import { Provider } from 'react-redux'

import StylesProvider from './components/StylesProvider'
import { store } from './redux'

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
