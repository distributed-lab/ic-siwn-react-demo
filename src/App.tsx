import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC, HTMLAttributes, memo } from 'react'

import { AppRoutes } from '@/routes'
import { createTheme } from '@/theme'

const App: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const theme = createTheme('dark')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <AppRoutes />
      </div>
    </ThemeProvider>
  )
}

export default memo(App)
