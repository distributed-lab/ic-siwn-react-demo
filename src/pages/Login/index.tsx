import { useNear } from '@/near'
import { Button, Stack } from '@mui/material'
import { useState } from 'react'

export default function LoginPage() {
  const { signIn } = useNear()
  const [isDisabled, setIsDisabled] = useState(false)

  const connectWallet = async () => {
    setIsDisabled(true)
    await signIn()
    setIsDisabled(false)
  }

  return (
    <Stack
      direction='row'
      flexWrap='wrap'
      gap={theme => theme.spacing(2)}
      justifyContent='flex-start'
      margin='auto'
    >
      <Button onClick={connectWallet} disabled={isDisabled}>
        Connect Near Wallet
      </Button>
    </Stack>
  )
}
