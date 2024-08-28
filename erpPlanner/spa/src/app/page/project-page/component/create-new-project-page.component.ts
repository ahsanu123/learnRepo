import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentModule } from '../../../component/component.module';
import { ScrollerModule } from 'primeng/scroller';
import { GenericForm, Obj2GenericForm } from '../../../shared';
import { FormGeneratorComponent } from '../../../component/form-generator/form-generator.component';
import { ProjectModel, initProjectModel } from '../../../model';
import { Store } from '@ngrx/store';
import { projectPageActionCollection } from '../state/project-page-action-collection';
import { ProjectRepositoryService } from '../../../repositoryService/project-repository.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'project-page-create-new-project',
  standalone: true,
  imports: [
    CommonModule,
    ComponentModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    ScrollerModule,
    FormGeneratorComponent
  ],
  templateUrl: './create-new-project-page.component.html',
  styleUrl: './create-new-project-page.component.scss'
})
export class CreateNewProjectComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>()
  currentProjectData?: ProjectModel
  visible: boolean = false

  newProjectData: GenericForm<ProjectModel> = Obj2GenericForm(initProjectModel())

  constructor(
    private _store: Store,
    private _projectRepository: ProjectRepositoryService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  onConfirm() {
    this.currentProjectData && this._store.dispatch(projectPageActionCollection.createNewProject({
      newProject: this.currentProjectData,
    }))

    this.showDialog()
  }

  onDataChange(newData: ProjectModel) {
    console.log(newData)
    this.currentProjectData = newData
  }

  showDialog() {
    if (this.visible) {
      this.newProjectData = Obj2GenericForm(initProjectModel())
    }
    this.visible = !this.visible
  }
  ngOnInit(): void {
  }

}
