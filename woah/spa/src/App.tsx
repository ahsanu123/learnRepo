import './App.scss'
import { WelcomPage } from './page/WelcomePage'
import { StoreProvider } from './store/StoreProvider'

function App() {

  return (
    <StoreProvider>
      <WelcomPage />
    </StoreProvider>
  )
}

export default App
