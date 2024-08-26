import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../model/book-model';

const mockBook: Array<Book> = [
  {
    id: '1',
    volumeInfo: {
      title: 'hell yeah',
      authors: ['william minerva']
    }
  },
  {
    id: '2',
    volumeInfo: {
      title: 'hell yeah',
      authors: ['william minerva']
    }
  },
  {
    id: '3',
    volumeInfo: {
      title: 'hell yeah',
      authors: ['william minerva']
    }
  },
  {
    id: '4',
    volumeInfo: {
      title: 'hell yeah',
      authors: ['william minerva']
    }
  },
]

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {
  constructor(private http: HttpClient) { }

  getBooks(): Observable<Array<Book>> {
    return this.http
      .get<{ items: Book[] }>(
        'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
      )
      .pipe(map((books) => mockBook));
  }
}
