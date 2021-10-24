import { render } from 'react-dom'
import { Provider } from 'react-redux'

import StylesProvider from './components/StylesProvider'
import { store } from './redux'

import App from './App'

import './index.css'

render(
  <StylesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </StylesProvider>,
  document.getElementById('root'),
)
