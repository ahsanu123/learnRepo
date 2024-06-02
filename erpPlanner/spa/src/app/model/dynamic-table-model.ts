import { ValidationsModel } from "./dynamic-form.model";

export interface DynamicTableModel {
  header: string;
  footer: string;
  description: string;
  name: string;
  rows: Array<DynamicTableModelRow>;
}

export interface DynamicTableModelRow {
  name: string;
  index: number;
  header: string[];
  data: Array<DynamicTableModelCellObject>;
}

export interface DynamicTableModelCellObject {
  value: string | number | Array<number> | Array<string>;
  row: number;
  col: number;
  type: CellObjectType;
  formulas?: string;
  validations?: Array<ValidationsModel>;
}

type CellObjectType = 'CURRENCY' | 'PLAIN' | 'LIST' | 'OPTION';

export const DynamicTableJsonToTable = (obj: object) => {

}

export const DynamicTableTableToJson = (obj: object) => {

}

