import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardPage from './page/dashboard-page/DashboardPage'
import { ThemeProvider } from 'styled-components'
import { BaseStyles, theme } from '@primer/react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      theme={theme}
    >
      <BaseStyles>
        <RouterProvider router={router} />
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
