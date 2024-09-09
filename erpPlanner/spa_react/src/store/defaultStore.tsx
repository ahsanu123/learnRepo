import { DashboardPageStore } from "../page/dashboard-page/dashboard-page-store";
import { IStore } from "./store-provider";

export const defaultStore: IStore = {
  dashboardPageStore: new DashboardPageStore(),
};

