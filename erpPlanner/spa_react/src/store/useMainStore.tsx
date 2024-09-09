import { useContext } from "react";
import { MainStore } from "./store-provider";

export const useMainStore = () => useContext(MainStore);

