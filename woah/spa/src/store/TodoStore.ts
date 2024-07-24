import {
  action,
  computed,
  observable
} from "mobx";

export class TodoStore {
  @observable
  title: string = ""

  @observable
  finsihed: boolean = false

  @action
  toggle(): void {
    this.finsihed = !this.finsihed
  }

  @computed
  get getTitleWithMark() {
    return this.title + "!!"
  }
}

