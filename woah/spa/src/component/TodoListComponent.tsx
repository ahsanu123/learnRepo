import { observer } from "mobx-react-lite";
import { Props } from "../shared";
import { StoreContext } from "../store/StoreProvider";
import { useContext } from "react";

const TodoListComponentObs: React.FC<Props> = (props) => {

  const {
    todoStore
  } = useContext(StoreContext)


  const todoList = todoStore.getAllTodoList

  const onDoneClick = (key: number) => {
    todoStore.toggle(key)
  }

  return (
    <>
      <div
        className="todo-list-component"
      >
        {
          todoList.map((item, index) => (
            <li
              key={index}
            >
              <input
                type="checkbox"
                checked={item[1].isFinished}
                onChange={() => onDoneClick(index)}
              />
              <p>{item[1].name}{` ${item[1].isFinished ? 'finished' : 'todo'}`}</p>
            </li>
          ))
        }

      </div>
    </>
  )
}

export const TodoListComponent = observer(TodoListComponentObs)

