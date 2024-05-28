import { Component, Input } from '@angular/core';
import {
  bootstrapBackpack2Fill,
  bootstrapBackpack3Fill,
  bootstrapBoxSeamFill,
  bootstrapChevronCompactDown
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxSolid,
  heroBeakerSolid,
  heroChartPieSolid,
  heroCurrencyDollarSolid,
  heroPencilSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'card-with-icon-on-side',
  standalone: true,
  imports: [
    NgIconComponent
  ],
  templateUrl: './card-with-icon-on-side.component.html',
  styleUrl: './card-with-icon-on-side.component.scss',
  providers: [
    provideIcons({
      heroPencilSolid,
      heroBeakerSolid,
      heroCurrencyDollarSolid,
      heroArchiveBoxSolid,
      heroChartPieSolid,
      bootstrapBoxSeamFill,
      bootstrapBackpack3Fill,
      bootstrapBackpack2Fill,
      bootstrapChevronCompactDown
    })
  ]
})
export class CardWithIconOnSideComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() iconName: string = '';

}
