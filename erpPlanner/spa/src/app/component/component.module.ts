import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent } from './form-generator/form-generator.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormGeneratorComponent,
    SidebarComponent

  ],
  exports: [
    FormGeneratorComponent,
    SidebarComponent,
  ]

})
export class ComponentModule { }
