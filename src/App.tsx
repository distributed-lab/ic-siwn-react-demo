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

  // testPayloadHash()

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

// import * as Borsh from '@dao-xyz/borsh'
// import { field, option, fixedArray } from '@dao-xyz/borsh'
// import * as js_sha256 from 'js-sha256'

// class Payload {
//   @field({ type: 'u32' })
//   tag: number // Always the same tag: 2**31 + 413

//   @field({ type: 'string' })
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-expect-error
//   message: string // The same message passed in `SignMessageParams.message`

//   @field({ type: fixedArray('u8', 32) })
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-expect-error
//   nonce: number[] // The same nonce passed in `SignMessageParams.nonce`

//   @field({ type: 'string' })
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-expect-error
//   recipient: string // The same recipient passed in `SignMessageParams.recipient`

//   @field({ type: option('string') })
//   callbackUrl?: string

//   constructor({ message, nonce, recipient, callbackUrl }: Payload) {
//     this.tag = 2147484061
//     Object.assign(this, { message, nonce, recipient, callbackUrl })
//   }
// }

// const testPayloadHash = () => {
//   // const payload = new Payload({
//   //   tag: 2147484061,

//   //   message:
//   //     'http://localhost:5173 wants you to sign in with your Near account:\nnapalmpapalam.testnet\n\nURI: http://localhost:5173\nCallback URL: f4NeozjryVH5jR3Tefu0YO1dO7K0Ea3t6FCJLwzXhSw=\nChain ID: testnet\nNonce: f4NeozjryVH5jR3Tefu0YO1dO7K0Ea3t6FCJLwzXhSw=\nIssued At: 2024-09-12T08:54:32.429379027Z\nExpiration Time: 2024-09-12T08:59:32.429379027Z',
//   //   nonce: Array.from(Buffer.from('f4NeozjryVH5jR3Tefu0YO1dO7K0Ea3t6FCJLwzXhSw=', 'base64')),
//   //   recipient: 'http://localhost:5173',
//   //   callbackUrl: 'http://localhost:5173/login-icp',
//   // })
//   // const borshPayload = Borsh.serialize(payload)
//   // // console.log('Borsh payload:', Buffer.from(borshPayload).toString('base64'))
//   // const hashedPayload = js_sha256.sha256.array(borshPayload)
//   // const hashedPayloadBase64 = Buffer.from(hashedPayload).toString('base64')
//   // console.log('Hashed payload:', hashedPayloadBase64)
// }
