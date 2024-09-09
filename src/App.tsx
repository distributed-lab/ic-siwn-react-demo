import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC, HTMLAttributes, memo } from 'react'

import { AppRoutes } from '@/routes'
import { createTheme } from '@/theme'
import { NearContextProvider } from './near'
import { SiwnIdentityProvider } from './siwn'

const App: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const theme = createTheme('dark')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NearContextProvider>
        <SiwnIdentityProvider canisterId={canisterId} idlFactory={idlFactory}>
          <div className='App'>
            <AppRoutes />
          </div>
        </SiwnIdentityProvider>
      </NearContextProvider>
    </ThemeProvider>
  )
}

export default memo(App)
