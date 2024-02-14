import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
<<<<<<< HEAD
import { persistor, store } from './redux/store.js'
import { Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
=======
import { store } from './redux/store.js'
import { Provider} from 'react-redux'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
>>>>>>> 43dd960e792d11c58cdbd054cacf5866376846de
  </Provider>
)
