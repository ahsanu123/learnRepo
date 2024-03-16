import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxSolid,
  heroBeakerSolid,
  heroCurrencyDollarSolid,
  heroPencilSolid,
  heroChartPieSolid
} from '@ng-icons/heroicons/solid';
import { ProsemirrorBasicEditorComponent } from '../prosemirror-basic-editor/prosemirror-basic-editor.component';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../sharedComponent/dialog/dialog.component';
import { MilkdownEditorComponent } from '../../sharedComponent/milkdown-editor/milkdown-editor.component';
import { InputNoBorderDirective } from '../../directive';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [
    NgIconComponent,
    MilkdownEditorComponent,
    ProsemirrorBasicEditorComponent,
    DialogComponent,
    InputNoBorderDirective,
    CommonModule
  ],
  templateUrl: './project-summary.component.html',
  styleUrl: './project-summary.component.scss',
  providers: [
    provideIcons({
      heroPencilSolid,
      heroBeakerSolid,
      heroCurrencyDollarSolid,
      heroArchiveBoxSolid,
      heroChartPieSolid
    })
  ]
})
export class ProjectSummaryComponent {

  listDialog: string[] = ['satu', 'dua', 'tiga'];
}
