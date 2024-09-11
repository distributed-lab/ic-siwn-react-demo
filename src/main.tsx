import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { NearContextProvider } from './near'

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <StrictMode>
    <NearContextProvider>
      <App />
    </NearContextProvider>
  </StrictMode>,
)
