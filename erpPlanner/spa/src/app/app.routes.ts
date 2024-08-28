import { Routes } from '@angular/router';
import { DasboardComponent } from './page/dasboard-page/dasboard.component';
import { ProjectInfoComponent } from './page/project-info/project-info.component';
import { ProjectPageComponent } from './page/project-page/project-page.component';
import { DynamicFormComponent } from './component/dynamic-form/dynamic-form.component';
import { ProjectSummaryComponent } from './component/project-summary/project-summary.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { InventoryComponent } from './page/inventory/inventory.component';
import { LoginComponent } from './page/login/login.component';
import { FeatureSlice, provideState, provideStore } from '@ngrx/store';
import { booksReducer } from './model/state/book-reducer';
import { collectionReducer } from './model/state/collection-reducer';
import { projectReducer } from './page/project-page/state/project-page-reducer-collection';
import { provideEffects } from '@ngrx/effects';
import { ProjectEffects } from './effects/project.effect';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    component: DasboardComponent,
    providers: [
      provideState({ name: 'books', reducer: booksReducer }),
      provideState({ name: 'collection', reducer: collectionReducer }),
      provideState({ name: 'projects', reducer: projectReducer }),
      provideEffects(ProjectEffects)
    ],
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
      },
      {
        path: 'google-signin',
        title: 'Login With Google',
        component: LoginComponent
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
