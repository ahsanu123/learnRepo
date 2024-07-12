import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent } from './form-generator/form-generator.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormGeneratorComponent
  ],
  exports: [
    FormGeneratorComponent
  ]

})
export class ComponentModule { }
