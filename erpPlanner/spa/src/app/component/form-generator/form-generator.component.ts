import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as icon from '@ng-icons/heroicons/solid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { InputType } from '../../shared';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'form-generator',
  standalone: true,
  imports: [
    NgIconComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MarkdownComponent,
    InputTextModule,
    InputSwitchModule,
    ButtonModule,
    InputTextareaModule
  ],
  providers: [
    provideIcons(icon),
    provideMarkdown()
  ],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss'
})
export class FormGeneratorComponent implements OnInit {
  @Input({ required: true }) data!: any
  @Input() showCode: boolean = true // TODO: enable hide and show code in markdown
  @Input() submitLabel: string = 'Submit'

  @Output() OnSubmit: EventEmitter<any> = new EventEmitter();

  formGroup!: FormGroup;
  formKey!: Array<string>;

  constructor(

    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const key = Object.keys(this.data)
    const obj: any = {}
    key.forEach((key) => {
      obj[key] = this.data[key].value
    })

    this.formGroup = this.formBuilder.group(obj)
    this.formKey = Object.keys(this.formGroup.controls)
  }

  sendSubmitToParent(event: any) {
    this.OnSubmit.emit(this.formGroup.value)
  }

  camelCase2space(value: string): string {
    const result = value.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  getIconFromType(type: InputType): string {
    let iconName: string = 'heroPencilSquareSolid'
    switch (type) {
      case 'checkbox': iconName = 'heroCheckCircleSolid'; break;
      case 'textarea': iconName = 'heroBookOpenSolid'; break;
      case 'date': iconName = 'heroCalendarDaysSolid'; break;
      default: break;
    }
    return iconName
  }
  onShowCode() {
    this.showCode = !this.showCode
  }
}
