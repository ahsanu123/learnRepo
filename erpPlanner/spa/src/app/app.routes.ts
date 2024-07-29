import { Routes } from '@angular/router';
import { DasboardComponent } from './page/dasboard/dasboard.component';
import { ProjectInfoComponent } from './page/project-info/project-info.component';
import { ProjectPageComponent } from './page/project-page/project-page.component';
import { DynamicFormComponent } from './component/dynamic-form/dynamic-form.component';
import { ProjectSummaryComponent } from './component/project-summary/project-summary.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { InventoryComponent } from './page/inventory/inventory.component';

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
      },
      {
        path: 'project',
        title: 'Project Page',
        component: ProjectPageComponent
      },
      {
        path: 'inventory',
        title: 'Inventory Page',
        component: InventoryComponent
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
  },
  {
    path: 'project',
    title: 'Project Page',
    component: ProjectPageComponent,
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent
  }
];
