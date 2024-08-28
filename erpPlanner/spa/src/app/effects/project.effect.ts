import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProjectModel } from "../model";
import { BaseUrl } from "../shared";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProjectRepositoryService } from "../repositoryService/project-repository.service";
import { projectPageActionCollection } from "../page/project-page/state/project-page-action-collection";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProjectEffects {
  constructor(
    private action$: Actions,
    private projectRepo: ProjectRepositoryService
  ) { }

  addNewProjectEffect = createEffect(() =>
    this.action$.pipe(
      ofType(projectPageActionCollection.createNewProject),

      exhaustMap((action) =>
        this.projectRepo.addNewProject(action.newProject).pipe(
          map((res) => console.log(res)),
          catchError((error) => of(error))
        )
      )
    )
  )

  loadProjectLists = createEffect(() =>
    this.action$.pipe(
      ofType(projectPageActionCollection.getProjectLists),

      exhaustMap((_action) =>
        this.projectRepo.project$.pipe(
          map((res) => projectPageActionCollection.retriveProjectsLists({ projects: res })),
          catchError((error) => of(error))
        )
      )
    )
  )

}
