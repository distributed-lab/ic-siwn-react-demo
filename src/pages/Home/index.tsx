import { useNear } from '@/near'
import { useSiwnIdentity } from '@/siwn'
import { Stack } from '@mui/material'

export default function LoginICPPage() {
  const { accountId } = useNear()
  const { identity } = useSiwnIdentity()

  return (
    <Stack flexWrap='wrap' spacing={6} justifyContent='flex-start' margin='auto'>
      <Stack flexWrap='wrap' spacing={3} justifyContent='flex-start' margin='auto'>
        <h1>Successfuly signed to the ICP!</h1>
        <h3>Near Account ID: {accountId}</h3>
        <h3>ICP Principal: {identity?.getPrincipal().toText()}</h3>
      </Stack>
    </Stack>
  )
}
