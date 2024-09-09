import { action, makeAutoObservable, observable } from "mobx";

export class DashboardPageStore {
  constructor() {
    makeAutoObservable(this)
  }

  @observable
  title: string = "hello world"

  @action
  setTitle() {
    this.title = "huh"
  }
}
