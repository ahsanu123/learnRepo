import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../component/main-sidebar/main-sidebar.component';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapGithub
} from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    MainSidebarComponent,
    RouterModule,
    NgIconComponent
  ],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.scss',
  providers: [
    provideIcons({
      bootstrapGithub
    })
  ]
})
export class DasboardComponent {
  year = new Date().getFullYear();
}
