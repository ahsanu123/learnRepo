import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArchiveBoxSolid, heroBeakerSolid, heroCurrencyDollarSolid, heroPencilSolid, heroChartPieSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [
    NgIconComponent
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

}
