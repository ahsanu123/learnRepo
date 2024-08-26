import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../model/book-model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-book-collection',
  templateUrl: './book-collection.component.html',
  imports: [
    CommonModule
  ]
})
export class BookCollectionComponent {
  @Input() books: ReadonlyArray<Book> = [];
  @Output() remove = new EventEmitter<string>();
}
