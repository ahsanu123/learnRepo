import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentModule } from '../../../component/component.module';
import { ScrollerModule } from 'primeng/scroller';
import { GenericForm, Obj2GenericForm, initializeProjectModel } from '../../../shared';
import { FormGeneratorComponent } from '../../../component/form-generator/form-generator.component';
import { BaseEventModel, BaseEventModelStatus, ProjectModel } from '../../../model';
import { ProjectPageStore } from '../project-page-store';

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
export class CreateNewProjectComponent implements OnInit {

  @Output() confirmEvent: EventEmitter<ProjectModel> = new EventEmitter()

  visible: boolean = false
  field: string[] = []

  newProjectData: GenericForm<ProjectModel> = Obj2GenericForm(initializeProjectModel())

  constructor(
    private _projectService: ProjectPageStore
  ) {
    for (let i = 0; i < 20; i++) {
      this.field.push(`field ${i}`)
    }
  }

  onConfirm() {
    // this._projectService.setProjectData("changed from new Project")
    this.visible = false
  }

  showDialog() {
    this.visible = !this.visible
  }
  ngOnInit(): void {
  }

}
