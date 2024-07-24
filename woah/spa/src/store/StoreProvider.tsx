import React, { createContext } from "react";
import { Props } from "../shared";
import { TodoStore } from "./TodoStore";

interface IStoreObject {
  todoStore: TodoStore;
}

const storeObject: IStoreObject = {
  todoStore: new TodoStore()
}

export const StoreContext = createContext<IStoreObject>(storeObject)

export const StoreProvider: React.FC<Props> = (props) => {
  const {
    children
  } = props
  return (
    <>
      <StoreContext.Provider value={storeObject}>
        {children}
      </StoreContext.Provider>
    </>
  )
}
