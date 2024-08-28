import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ProjectModel } from "../../../model";
import { createReducer, on } from "@ngrx/store";
import { projectPageActionCollection } from "./project-page-action-collection";

export const projectInitialData: ReadonlyArray<ProjectModel> = []
export const projectReducer = createReducer(
  projectInitialData,
  on(projectPageActionCollection.retriveProjectsLists, (_state, { projects }) => projects),
  on(projectPageActionCollection.createNewProject, (state, { newProject }) => {
    return [...state, newProject]
  }),
  on(projectPageActionCollection.upsertProjectLists, (state, { projects }) => {
    console.log(state)
    return state
  })
)


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
