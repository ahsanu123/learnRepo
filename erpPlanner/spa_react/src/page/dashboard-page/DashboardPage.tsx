import { Box, Heading, StateLabel } from '@primer/react'
import '../../index.scss'

function DashboardPage() {

  return (
    <>
      <Box m={4}>
        <Heading as="h2" sx={{ mb: 2 }}>
          Hello, world!
        </Heading>
        <StateLabel status="pullOpened">Open</StateLabel>
        <p>This will get Primer text styles.</p>
      </Box>
    </>
  )
}

export default DashboardPage
