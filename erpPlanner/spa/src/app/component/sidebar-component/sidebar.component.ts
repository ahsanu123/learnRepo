import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'sidebar-component',
  standalone: true,
  imports: [MenuModule, ToastModule],
  template: `
    <div class="justify-content-center">
          <span class="inline-flex align-items-center gap-1 px-2 py-2">
              <span class="font-medium text-xl font-semibold">
                  DJANGKRIK
              </span>
          </span>
        <p-menu [model]="items" />
    </div>
  `
})
export class SideBarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Project',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            routerLink: '/project',
            queryParams: {
              action: 'new',
            },
            state: {
              action: 'new'
            }
          },
          {
            label: 'List',
            icon: 'pi pi-search'
          }
        ]
      },
      {
        label: 'Administration',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog'
          },
          {
            label: 'Stocks',
            icon: 'pi pi-sign-out'
          }
        ]
      }
    ];
  }

}
