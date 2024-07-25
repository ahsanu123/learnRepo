import { useContext } from 'react';
import reactLogo from '../assets/react.svg'
import { Props } from '../shared';
import viteLogo from '/vite.svg'
import { observer } from "mobx-react-lite";
import { StoreContext } from '../store/StoreProvider';
import { TodoListComponent } from '../component/TodoListComponent';


const WelcomePageObs: React.FC<Props> = () => {

  const {
    todoStore
  } = useContext(StoreContext)

  return <>
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Total TODO {todoStore.getAllTodoList.length}</h1>
    <div className="card">
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
    <p className="read-the-docs">
      Click on the Vite and React logos to learn more
    </p>
    <TodoListComponent />
  </>
}

export const WelcomPage = observer(WelcomePageObs);
