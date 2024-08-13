import { Component, Input, OnDestroy, OnInit, input } from '@angular/core';
import { ProjectModel } from '../../model/project-model';
import { ComponentModule } from '../../component/component.module';
import { GenericForm, Obj2GenericForm } from '../../shared';
import { ProjectRepositoryService } from '../../repositoryService/project-repository.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CreateNewProjectComponent } from './component/create-new-project-page.component';
import { BaseEventModel, BaseEventModelStatus } from '../../model';
import { ProjectService } from '../../services/ProjectService';
import { Observable, takeUntil } from 'rxjs';

const dataFromApi: Partial<ProjectModel> = {
  id: 5,
  name: 'project 1',
  createdDate: new Date(),
  deadLineDate: new Date(0),
  lastUpdatedDate: new Date("2024-11-12"),
  finishedDate: new Date(0),
  sellPrice: 280.3,
  capital: 20,
  fail: false,
  finish: false,
  profitInPersen: 10,
  description: `

## Crumbs 🍪 - Rotary Encoder With 74HC595 And 74HC165

Simple Breakout Board to Learn Shift Register with Tactile Switch And Rotary Encoder 
![schematic](https://raw.githubusercontent.com/ahsanu123/crumbs/main/crumbs595165/docs/rotaryEncoderWith595.svg)
![render](https://raw.githubusercontent.com/ahsanu123/crumbs/main/crumbs595165/docs/rotaryEncoderWith595.png)

### 🍑 Features
> 🎈 4 Rotary Encoder With Low Pass Filter Debounce  
> 🏀 4 Input  With Low Pass Filter Debounce  
> 🍨 Use 2x 74HC595  
> 🍛 Use 2x 74HC165


<sup> 27 Juni 2024 19:11 Work In Progress, Made with ♥️ by AH... </sup>

`

}

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
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit, OnDestroy {

  projectData!: Observable<string>
  visible: boolean = false
  projectById$ = this.projectRepoService.project$
  showDialog() {
    this.visible = !this.visible
  }

  onChildrenConfirmed(event: BaseEventModel) {
    console.log(event)
  }

  ngOnInit(): void {
    this.projectData = this._projectData.projectData
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  OnFormSubmit(data: any) {
  }

  formData?: GenericForm<any> = Obj2GenericForm(dataFromApi)

  constructor(
    private projectRepoService: ProjectRepositoryService,
    private _router: Router,
    private _projectData: ProjectService,
  ) { }

}
