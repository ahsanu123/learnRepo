import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RowDetailSlickComponent } from './component/row-detail-slick/row-detail-slick.component';

export const routes: Routes = [
  {
    path: '',
    title: 'home',
    children: [
      {
        path: 'slick',
        title: 'slick',
        component: RowDetailSlickComponent,
      }
    ]
  }
];
