import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './main-sidebar.component.html',
  styleUrl: './main-sidebar.component.scss'
})
export class MainSidebarComponent {

  mainMenu: string[] = ["Project", "Material", "Producing Step"];

}
