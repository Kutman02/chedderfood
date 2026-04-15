import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { STORAGE_KEYS } from './shared/constants/storage'

try {
  localStorage.removeItem(STORAGE_KEYS.RECEIPTS)
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_DATA)
} catch {
  // Ignore storage errors for private mode and restricted browsers.
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
