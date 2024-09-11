import { useNear } from '@/near'
import { useSiwnIdentity } from '@/siwn'
import { Button, Stack } from '@mui/material'
import { SignedMessage } from '@near-wallet-selector/core'
import { useEffect, useMemo, useState } from 'react'

export default function LoginICPPage() {
  const { accountId, signOut } = useNear()
  const { login, onLoginSignatureSettled } = useSiwnIdentity()

  const [isDisabled, setIsDisabled] = useState(false)

  const signedMessage = useMemo(() => extractMessageFromURL(), [])

  const loginICP = async () => {
    setIsDisabled(true)
    await login()
    setIsDisabled(false)
  }

  useEffect(() => {
    const finishLogin = async () => {
      if (!signedMessage) {
        return
      }

      setIsDisabled(true)
      await onLoginSignatureSettled(signedMessage)
      setIsDisabled(false)
    }

    finishLogin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedMessage])

  return (
    <Stack flexWrap='wrap' spacing={6} justifyContent='flex-start' margin='auto'>
      <h3>Your Near account ID is: {accountId}</h3>

      <Stack direction='row' flexWrap='wrap' spacing={6} justifyContent='flex-start' margin='auto'>
        <Button variant='outlined' onClick={signOut} disabled={isDisabled}>
          Disconnect Wallet
        </Button>
        <Button onClick={loginICP} disabled={isDisabled}>
          Login Internet Coputer
        </Button>
      </Stack>
    </Stack>
  )
}

const extractMessageFromURL = (): SignedMessage | null => {
  const location = new URL(window.location.href)

  if (!location.hash) {
    return null
  }

  const parsedUrl = new URL(location.origin + `?${location.hash.slice(1)}`)

  const accountId = parsedUrl.searchParams.get('accountId')
  const signature = parsedUrl.searchParams.get('signature')
  const publicKey = parsedUrl.searchParams.get('publicKey')

  if (!accountId || !signature || !publicKey) {
    return null
  }

  return { accountId, signature, publicKey: publicKey.replaceAll('ed25519:', '') }
}
