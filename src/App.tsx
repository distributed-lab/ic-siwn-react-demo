import { CssBaseline, ThemeProvider } from '@mui/material'
import { FC, HTMLAttributes, memo, useEffect, useState } from 'react'

import { AppRoutes } from '@/routes'
import { createTheme } from '@/theme'
import { useNear } from './near'
import { SiwnIdentityProvider } from './siwn'
import { _SERVICE } from './declarations/ic_siwn_provider/ic_siwn_provider.did'
import { idlFactory } from './declarations/ic_siwn_provider/index'
import { config } from './config'

const App: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const theme = createTheme('dark')

  const { init } = useNear()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initNear = async () => {
      await init()
      setInitialized(true)
    }

    initNear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SiwnIdentityProvider<_SERVICE>
        httpAgentOptions={{ host: 'https://icp0.io' }}
        canisterId={config.IC_SIWN_CANISTER_ID}
        idlFactory={idlFactory}
      >
        <div className='App'>{initialized ? <AppRoutes /> : <></>}</div>
      </SiwnIdentityProvider>
    </ThemeProvider>
  )
}

export default memo(App)
