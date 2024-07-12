import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormServiceService } from '../../services/form-service.service';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { DynamicFormModel } from '../../model/dynamic-form.model';
import * as icon from '@ng-icons/heroicons/solid';
import { EditableDirective } from '../../directive/content-editable.directive';
import { AngularSlickgridModule, Column, GridOption } from 'angular-slickgrid';

import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-bootstrap.css';


@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    NgIconComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    EditableDirective,
    AngularSlickgridModule
  ],
  providers: [
    provideIcons(icon)
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {

  spanControl = new FormControl('span')
  dynamicForm: FormGroup;
  control = new FormControl('');
  controlGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  })

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormServiceService
  ) {
    this.prepareGrid()
    const formStructure = this.formService.getFormStructure();
    const controls: {
      [key: string]: Array<any | Validators>
    } = {}


    formStructure.forEach((control) => {
      controls[control.name] = [control.value];
      if (control.validations !== undefined) {
        const controlValidator: Array<Validators> = []
        control.validations.forEach((validator) => {
          if (validator.validator === "required") controlValidator.push(Validators.required);
          if (validator.validator === "email") controlValidator.push(Validators.email)
        });

        controls[control.name] = [control.value, controlValidator];
      }
    });

    this.dynamicForm = this.formBuilder.group(controls);
    console.log(this.dynamicForm.get('name') as FormControl)
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const keys = Object.keys(this.controlGroup.controls) as Array<keyof typeof this.controlGroup.controls>

    for (let i = 0; i < keys.length; i++) {
      console.log(this.controlGroup.controls[keys[i]])
    }
  }

  onDynamicSubmit() {
    console.log(this.dynamicForm.value);
  }

  getStructure() {
    return this.formService.getFormStructure();
  }

  getErrorMessage(control: DynamicFormModel) {
    const formControl = this.dynamicForm.get(control.name);
    if (control.validations !== undefined) {
      for (let validation of control.validations) {
        if (formControl?.hasError(validation.validator)) return validation.errorMessage;
      }
    }
    return ""
  }

  trackByKey = (index: number, obj: object): number => {
    //trackBy will update list created by ngfor based on returned value, 
    //which mean id or object index
    // reference: https://stackoverflow.com/questions/42108217/how-to-use-trackby-with-ngfor

    return index;
  };

  getControlAsFormControl(name: string) {
    return this.dynamicForm.get(name) as FormControl;
  }

  echoSpanControl() {
    console.log(this.spanControl)
  }


  prepareGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start' },
      { id: 'finish', name: 'Finish', field: 'finish' },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true
    };

    // fill the dataset with your data (or read it from the DB)
    for (let i = 0; i < 100; i++) {
      this.dataset.push(
        { id: i, title: `Task ${i}`, duration: 33 + i, percentComplete: 34, start: '2001-01-11', finish: '2001-02-04' },
      )
    }
  }

}
