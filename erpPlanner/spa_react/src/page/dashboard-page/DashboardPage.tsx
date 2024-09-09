import { Box, Heading, StateLabel } from '@primer/react'
import './Dashboard.scss'
import { useMainStore } from '../../store/useMainStore'
import { observer } from 'mobx-react-lite';

const DashboardPageImpl: React.FC = () => {

  const {
    dashboardPageStore
  } = useMainStore();

  const handleOnclick = () => {
    dashboardPageStore.setTitle()
    console.log("does this work")
  }

  return (
    <>
      <Box m={4}>
        <Heading as="h2" sx={{ mb: 2 }}>
          Hello, world!
        </Heading>
        <StateLabel status="pullOpened">Open</StateLabel>
        <h2>{dashboardPageStore.title}</h2>

        <p>This will get Primer text styles.</p>
        <button
          onClick={handleOnclick}
        >
          click Me
        </button>
      </Box>
    </>
  )
}

export const DashboardPage = observer(DashboardPageImpl);
