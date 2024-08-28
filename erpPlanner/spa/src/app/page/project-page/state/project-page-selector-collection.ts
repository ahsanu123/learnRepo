import { createFeatureSelector, createSelector } from "@ngrx/store"
import { ProjectModel } from "../../../model"

export const projectPageSelectProjects = createFeatureSelector<Array<ProjectModel>>('projects')

export const selectProjectLists = createSelector(projectPageSelectProjects,
  (projects) => (projects)
)
