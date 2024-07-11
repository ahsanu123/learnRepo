import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface FormModel {
  name: string;
  type: FormType;
  age: number;
}

type FormType = 'text' | 'date' | 'checkbox';

interface BasicProject {
  name: string;
  date: Date;
}

@Component({
  selector: 'app-form-generator',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-generator.component.html',
  styleUrl: './form-generator.component.scss'
})
export class FormGeneratorComponent implements OnInit {
  @Input({ required: true }) data!: any;
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

    console.log(obj)
    this.formGroup = this.formBuilder.group(obj)
    this.formKey = Object.keys(this.formGroup.controls)
  }

  sendSubmitToParent(event: any) {
    this.OnSubmit.emit(this.formGroup.value)
  }

}
