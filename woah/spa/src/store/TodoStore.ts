import {
  makeAutoObservable,
} from "mobx";
import { TodoModel } from "../model";

//
// Inference rules:
//
// All own properties become observable.
// All getters become computed.
// All setters become action.
// All functions become autoAction.
// All generator functions become flow. (Note that generator functions are not detectable in some transpiler configurations, if flow doesn't work as expected, make sure to specify flow explicitly.)
// Members marked with false in the overrides argument will not be annotated. For example, using it for read only fields such as identifiers.
//

export class TodoStore {

  todoList: Map<number, TodoModel> = new Map<number, TodoModel>()

  toggle(key: number): void {

    const todo = this.todoList.get(key)
    todo!.isFinished = !todo!.isFinished
    this.todoList.set(key, todo!)
  }

  get getAllTodoList() {
    return Array.from(this.todoList)
  }

  constructor() {
    makeAutoObservable(this)
    for (let i = 0; i < 10; i++) {
      this.todoList
        .set(i, {
          isFinished: false,
          name: `Todo List  ${i}`,
          description: `lorem ipsum description ${i}`
        })

    }
  }

}

