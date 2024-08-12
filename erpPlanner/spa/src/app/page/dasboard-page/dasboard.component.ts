import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  bootstrapGithub
} from '@ng-icons/bootstrap-icons';
import { ComponentModule } from '../../component/component.module';
import { RouterModule } from '@angular/router';
import {
  ButtonModule,
} from 'primeng/button'
import {
  DataViewModule
} from 'primeng/dataview'
import {
  TagModule
} from 'primeng/tag'
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from '../../component/menu-bar/menu-bar.component';
import { SideBarComponent } from '../../component/sidebar-component/sidebar.component';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [
    RouterModule,
    NgIconComponent,
    ComponentModule,
    ButtonModule,
    CommonModule,
    DataViewModule,
    TagModule,
    MenuBarComponent,
    CardModule,
    SideBarComponent,
    AccordionModule
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
  products: any[] = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },

    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
  ]
  getSeverity(product: any) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  };
}
