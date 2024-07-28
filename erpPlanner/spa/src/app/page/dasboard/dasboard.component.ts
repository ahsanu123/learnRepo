import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapGithub
} from '@ng-icons/bootstrap-icons';
import { ComponentModule } from '../../component/component.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    RouterModule,
    NgIconComponent,
    ComponentModule,
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
