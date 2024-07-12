import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportedImageType } from '../../shared';

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
