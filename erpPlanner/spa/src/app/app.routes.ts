import { Routes } from '@angular/router';
import { ProjectSummaryComponent } from '../component/project-summary/project-summary.component';
import { DasboardComponent } from '../page/dasboard/dasboard.component';

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
];
