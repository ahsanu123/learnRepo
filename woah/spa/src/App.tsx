import { FluentProvider } from '@fluentui/react-components'
import './App.scss'
import { StoreProvider } from './store/StoreProvider'
import { reddishThemeDark } from './shared'
import { RouterProvider } from 'react-router-dom'
import { MainRoute } from './Router'

function App() {
  return (
    <FluentProvider theme={reddishThemeDark}>
      <StoreProvider>
        <RouterProvider
          router={MainRoute}
        />
      </StoreProvider>
    </FluentProvider>
  )
}

export default App
