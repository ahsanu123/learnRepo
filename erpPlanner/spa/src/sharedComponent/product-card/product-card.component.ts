import { Component } from '@angular/core';
import { SupportedImageType } from '../../shared/shared-variable';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  ProductCardTags: string[];

  constructor() {
    this.ProductCardTags = [];
  }

  getSupportedImageType() {
    return SupportedImageType.join(",");
  }

}
