// webapp/src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { TRPCProvider } from './trpcProvider'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </HelmetProvider>
  </React.StrictMode>
)
