import { Component, OnInit } from '@angular/core';
import { ComponentModule } from '../../component/component.module';
import { ProjectRepositoryService } from '../../repositoryService/project-repository.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CreateNewProjectComponent } from './component/create-new-project-page.component';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { BookListComponent } from '../../component/book/book-list.component';
import { BookCollectionComponent } from '../../component/book-collection/book-collection.component';
import { Store } from '@ngrx/store';
import { BooksActions } from '../../model/state/book-action';
import { selectBookCollection, selectBooks } from '../../model/state/book-selector';
import { projectPageSelectProjects } from './state/project-page-selector-collection';
import { projectPageActionCollection } from './state/project-page-action-collection';
import { DataViewModule } from 'primeng/dataview';
import { ProjectListComponent } from './component/project-list.component';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    ComponentModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    AsyncPipe,
    CreateNewProjectComponent,
    BookListComponent,
    BookCollectionComponent,
    DataViewModule,
    ProjectListComponent
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit {

  projectData!: Observable<string>
  visible: boolean = false
  projectById$ = this.projectRepoService.project$

  books$ = this.store.select(selectBooks)
  bookCollection$ = this.store.select(selectBookCollection)
  projects$ = this.store.select(projectPageSelectProjects)

  onAdd(bookId: string) {
    this.store.dispatch(BooksActions.addBook({ bookId }));
  }

  onRemove(bookId: string) {
    this.store.dispatch(BooksActions.removeBook({ bookId }));
  }

  showDialog() {
    this.visible = !this.visible
  }

  ngOnInit(): void {
    this.store.dispatch(projectPageActionCollection.getProjectLists({}))
  }

  OnFormSubmit(data: any) {
    console.log(data)
  }

  constructor(
    private projectRepoService: ProjectRepositoryService,
    private store: Store
  ) { }

}
