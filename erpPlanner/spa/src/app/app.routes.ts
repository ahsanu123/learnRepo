import { Routes } from '@angular/router';
import { DasboardComponent } from '../page/dasboard/dasboard.component';
import { DynamicFormComponent } from '../component/dynamic-form/dynamic-form.component';
import { ProjectSummaryComponent } from '../component/project-summary/project-summary.component';
import { ProjectInfoComponent } from '../page/project-info/project-info.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    component: DasboardComponent,
    children: [
      {
        path: 'project-summary',
        title: 'Project Summary',
        component: ProjectSummaryComponent
      }
    ]
  },
  {
    path: 'form',
    title: 'Dynamic Form',
    component: DynamicFormComponent,
  },
  {
    path: 'projectinfo',
    title: 'Project Information',
    component: ProjectInfoComponent,
  }
];
