import { createBrowserRouter } from "react-router-dom"
import { WelcomPage } from "./page/WelcomePage"

export const MainRoute = createBrowserRouter([
  {
    path: '/',
    element: <WelcomPage />
  }
])
