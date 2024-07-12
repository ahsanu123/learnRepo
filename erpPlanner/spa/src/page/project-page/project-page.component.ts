import { Component, Input, OnInit, input } from '@angular/core';
import { FormGeneratorComponent, FormModel } from '../../component/form-generator/form-generator.component';
import { ProjectModel } from '../../model/project-model';

interface ProjectName {
  name: string;
  description: string;
  age: number;
  date: Date;
  isActive: boolean;
}

export type InputType = 'text' | 'textarea' | 'number' | 'date' | 'button' | 'checkbox' | 'datetime-local' | 'email' | 'file' | 'password' | 'radio' | 'range'
export type GenericForm<T> = Record<keyof Partial<T>, { type: InputType, value: any }>

const dataFromApi: Partial<ProjectModel> = {
  id: 5,
  Name: 'project 1',
  CreateDate: new Date(),
  DeadLineDate: new Date(0),
  LastUpdateDate: new Date("2024-11-12"),
  FinishedDate: new Date(0),
  SellPrice: 280.3,
  Capital: 20,
  Fail: false,
  Finish: false,
  ProfitInPersen: 10,
  Description: `

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

function Obj2GenericForm<T>(obj: T) {
  const returnObj = {} as GenericForm<T>;
  for (const key in obj) {

    let inputType: InputType

    if (typeof obj[key] === 'boolean')
      inputType = 'checkbox'

    else if (obj[key] instanceof Date)
      inputType = 'date'

    else if (typeof obj[key] === 'number')
      inputType = 'number'

    else if (typeof obj[key] === 'string' && (obj[key] as string).length > 10)
      inputType = 'textarea'

    else inputType = 'text'

    returnObj[key] = {
      type: inputType,
      value: inputType === 'date' ? (obj[key] as Date).toISOString().split('T')[0] : obj[key]
    }
  }
  console.log(returnObj)
  return returnObj
}

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
  }

  OnFormSubmit(data: any) {
    console.log(data)
  }

  formData?: GenericForm<ProjectModel> = Obj2GenericForm(dataFromApi)
}
