import { Component, Input, OnInit, input } from '@angular/core';
import { ProjectModel } from '../../model/project-model';
import { ComponentModule } from '../../component/component.module';
import { GenericForm, Obj2GenericForm } from '../../shared';

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

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    ComponentModule
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
