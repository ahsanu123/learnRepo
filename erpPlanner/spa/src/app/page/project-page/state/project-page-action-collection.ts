import { createActionGroup, props } from "@ngrx/store";
import { ProjectModel } from "../../../model";

export const projectPageActionCollection = createActionGroup({
  source: 'Project Page',
  events: {
    'Retrive Projects Lists': props<{ projects: Array<ProjectModel> }>(),
    'Get Project Lists': props<{ id?: number }>(),
    'Upsert Project Lists': props<{ projects?: ProjectModel[] }>(),
    'Create New Project': props<{ newProject: ProjectModel }>(),
  },
})
