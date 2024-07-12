import * as heroIconSolid from '@ng-icons/heroicons/solid';
import * as heroIconOutline from '@ng-icons/heroicons/outline';

type ValidationType = 'email' | 'required';
type iconType =
  typeof heroIconSolid &
  typeof heroIconOutline;


export type IconName = keyof iconType

export interface DynamicFormModel {
  type: string,
  label: string,
  name: string,
  value: string,
  visible: boolean,
  icon?: IconName,
  validations?: ValidationsModel[]
}
export interface ValidationsModel {
  validator: ValidationType,
  errorMessage: string,
  hint?: string,
}
