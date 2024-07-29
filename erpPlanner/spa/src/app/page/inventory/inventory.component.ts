import { Component } from '@angular/core';
import { TableComponent } from '../../component/table/table.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    TableComponent
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {

}
