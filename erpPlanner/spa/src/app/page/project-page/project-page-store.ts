import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ProjectModel } from "../../model";

@Injectable({
  providedIn: 'root',
})
export class ProjectPageStore {

  private newProjectData$ = new BehaviorSubject<ProjectModel>({} as ProjectModel)

  projectData = this.newProjectData$.asObservable()

  setProjectData(data: string) {
    // this.newProjectData$.next(data)
  }

}
