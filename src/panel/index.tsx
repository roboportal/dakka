import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './redux'

import App from './App'

import './index.css'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
