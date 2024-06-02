import { Injectable } from '@angular/core';
import { DynamicFormModel, ValidationsModel } from '../app/model/dynamic-form.model';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor() { }

  getFormStructure() {
    const structure: Array<DynamicFormModel> = [];
    ["name", "email", "bio"].forEach((item) => {
      structure.push({
        type: "text",
        label: item.toUpperCase(),
        name: item,
        value: "",
        visible: true,
        icon: 'heroBoltSlashSolid',
        validations: [
          {
            validator: 'email',
            errorMessage: 'email required cuk!'
          },
          {
            validator: 'required',
            errorMessage: 'required field'
          }
        ]
      })
    });
    structure.push({
      type: "text",
      label: "jangkrik",
      name: "jangkrik",
      value: "",
      icon: 'heroViewfinderCircleSolid',
      visible: true,
    });
    structure.push({
      type: "text",
      label: "hohoho",
      name: "hoho",
      value: "",
      icon: 'heroViewfinderCircleSolid',
      visible: true,
      validations: [
        {
          validator: 'required',
          errorMessage: 'isi dulu!!'
        }
      ]
    });

    return structure;
  }

}
