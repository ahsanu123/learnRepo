import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../component/main-sidebar/main-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    MainSidebarComponent,
    RouterModule,
  ],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.scss'
})
export class DasboardComponent {
  year = new Date().getFullYear();
}