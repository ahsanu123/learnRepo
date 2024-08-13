import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private newProjectData$ = new BehaviorSubject("initial message")

  projectData = this.newProjectData$.asObservable()

  setProjectData(data: string) {
    this.newProjectData$.next(data)
  }

}
