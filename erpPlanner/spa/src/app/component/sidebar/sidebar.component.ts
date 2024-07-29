import { Component } from '@angular/core';
import { SideBarModel } from '../../model';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import * as icon from '@ng-icons/bootstrap-icons'
import { RouterModule } from '@angular/router';

@Component({
  selector: ' sidebar-component',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    RouterModule
  ],
  providers: [
    provideIcons(icon),
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  sideBarList: Array<SideBarModel> = [
    {
      name: 'Dashboard',
      path: ''
    },
    {
      name: 'Logistics',
      path: 'logistics',
      children: [{
        name: 'service',
        path: 'hell'
      }]
    },
    {
      name: 'Iventory',
      path: 'inventory'
    },
    {
      name: 'Project',
      path: 'project'
    },
    {
      name: 'Sales',
      path: 'sales'
    },
    {
      name: 'Document',
      path: 'document'
    }
  ]


}
