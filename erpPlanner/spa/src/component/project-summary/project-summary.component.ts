import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  bootstrapBoxSeamFill,
  bootstrapChevronDown,
  bootstrapMemory,
  bootstrapStack,
  bootstrapHddStackFill
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxSolid,
  heroBeakerSolid,
  heroChartPieSolid,
  heroCurrencyDollarSolid,
  heroPencilSolid
} from '@ng-icons/heroicons/solid';
import { InputNoBorderDirective } from '../../directive';
import { CardWithIconOnSideComponent } from '../../sharedComponent/card-with-icon-on-side/card-with-icon-on-side.component';
import { DialogComponent } from '../../sharedComponent/dialog/dialog.component';
import { MilkdownEditorComponent } from '../../sharedComponent/milkdown-editor/milkdown-editor.component';
import { TableComponent } from '../../sharedComponent/table/table.component';
import { ProsemirrorBasicEditorComponent } from '../prosemirror-basic-editor/prosemirror-basic-editor.component';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [
    NgIconComponent,
    MilkdownEditorComponent,
    ProsemirrorBasicEditorComponent,
    DialogComponent,
    InputNoBorderDirective,
    CommonModule,
    CardWithIconOnSideComponent,
    TableComponent
  ],
  templateUrl: './project-summary.component.html',
  styleUrl: './project-summary.component.scss',
  providers: [
    provideIcons({
      heroPencilSolid,
      heroBeakerSolid,
      heroCurrencyDollarSolid,
      heroArchiveBoxSolid,
      heroChartPieSolid,
      bootstrapBoxSeamFill,
      bootstrapChevronDown,
      bootstrapMemory,
      bootstrapStack,
      bootstrapHddStackFill
    })
  ]
})
export class ProjectSummaryComponent {

  listDialog: string[] = ['satu', 'dua', 'tiga'];
}
