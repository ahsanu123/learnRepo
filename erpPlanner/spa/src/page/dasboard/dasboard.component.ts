import { Component } from '@angular/core';
import { MainSidebarComponent } from '../../component/main-sidebar/main-sidebar.component';
import { RouterModule } from '@angular/router';
import { ProsemirrorEditorDirective } from '../../directive/prosemirror-editor.directive';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    MainSidebarComponent,
    RouterModule,
    ProsemirrorEditorDirective
  ],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.scss'
})
export class DasboardComponent {
  year = new Date().getFullYear();
}
