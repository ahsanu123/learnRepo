import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { BaseStyles, ThemeProvider } from '@primer/react'
import { MainStore } from './store/store-provider'
import { defaultStore } from "./store/defaultStore"
import { DashboardPage } from './page/dashboard-page/DashboardPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainStore.Provider value={defaultStore}>

      <ThemeProvider
        colorMode='day'
      >
        <BaseStyles>
          <RouterProvider router={router} />
        </BaseStyles>
      </ThemeProvider>

    </MainStore.Provider>
  </StrictMode>,
)
