import { Button, Stack } from '@mui/material'

export default function Index() {
  return (
    <Stack
      direction='row'
      flexWrap='wrap'
      gap={theme => theme.spacing(2)}
      justifyContent='flex-start'
    >
      <Button>Outlined</Button>
    </Stack>
  )
}
