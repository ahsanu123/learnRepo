export interface ProjectModel {
  id: number;
  name: string;
  createdDate: Date;
  deadLineDate?: Date;
  lastUpdatedDate: Date;
  finishedDate?: Date;
  sellPrice?: number;
  capital: number;
  fail: boolean;
  finish: boolean;
  profitInPersen: number;
  description: string;
}
