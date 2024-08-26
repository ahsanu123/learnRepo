import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../model/book-model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  imports: [
    CommonModule
  ]
})
export class BookListComponent {
  @Input() books: ReadonlyArray<Book> = [];
  @Output() add = new EventEmitter<string>();
}
