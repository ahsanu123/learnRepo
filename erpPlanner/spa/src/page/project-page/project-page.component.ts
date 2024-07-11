import { Component, OnInit } from '@angular/core';
import { FormGeneratorComponent, FormModel } from '../../component/form-generator/form-generator.component';
import { objectWithoutKey } from 'angular-slickgrid';

function GetFormModelFromObject(obj: any): Array<FormModel> {
  // console.log(Object.keys(obj));
  // console.log(obj["date"] instanceof Date)

  return [];
}

interface ProjectName {
  name: string;
  description: string;
  age: number;
  date: Date;
}

type Somethink = keyof ProjectName

type inputType = 'text' | 'number' | 'date'

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    FormGeneratorComponent
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit {
  ngOnInit(): void {
    GetFormModelFromObject({
      projectName: 'ell',
      description: 'this is description',
      date: new Date(),
    })
  }

  OnFormSubmit(data: any) {
    console.log(data)
  }

  formData?: Record<keyof Partial<ProjectName>, { type: inputType, value: any }> = {
    name: {
      type: 'text',
      value: undefined
    },
    description: {
      type: 'text',
      value: 'description'
    },
    age: {
      type: 'number',
      value: undefined
    },
    date: {
      type: 'date',
      value: undefined

    }
  }
}
