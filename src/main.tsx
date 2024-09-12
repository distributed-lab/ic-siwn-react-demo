import { createRoot } from 'react-dom/client'

import App from './App'
import { NearContextProvider } from './near'

const root = createRoot(document.getElementById('root') as Element)

root.render(
  <NearContextProvider>
    <App />
  </NearContextProvider>,
)
