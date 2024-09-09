import { createContext } from "react"
import { DashboardPageStore } from "../page/dashboard-page/dashboard-page-store"
import { defaultStore } from "./defaultStore";

export interface IStore {
  dashboardPageStore: DashboardPageStore
}

export const MainStore = createContext<IStore>(defaultStore);

export const StoreProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
  const {
    children
  } = props
  return (
    <MainStore.Provider value={defaultStore}>
      {children}
    </MainStore.Provider>
  )
}
