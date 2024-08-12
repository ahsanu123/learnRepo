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
              <svg width="33" height="35" viewBox="0 0 33 35" fill="none" xmlns="http://www.w3.org/2000/svg" class="block mx-auto">
                  <path d="..." fill="var(--primary-color)" />
                  <mask id="mask0_1_36" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="31" height="33">
                      <path d="..." fill="var(--primary-color-text)" />
                  </mask>
                  <g mask="url(#mask0_1_36)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="..." fill="var(--primary-color)" />
                  </g>
                  <path d="..." fill="var(--primary-color-text)" />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="..."
                      fill="var(--primary-color-text)"
                  />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="..."
                      fill="var(--primary-color-text)"
                  />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path d="..." fill="var(--primary-color-text)" />
                  <path d="..." fill="var(--primary-color-text)" />
              </svg>
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
        label: 'Documents',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus'
          },
          {
            label: 'Search',
            icon: 'pi pi-search'
          }
        ]
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out'
          }
        ]
      }
    ];
  }

}
