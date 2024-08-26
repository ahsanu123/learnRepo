export interface ProjectModel {
  id?: number;
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

export const initProjectModel = () => {
  return {
    name: '',
    createdDate: new Date(),
    deadLineDate: new Date(),
    lastUpdatedDate: new Date(),
    finishedDate: new Date(),
    sellPrice: 0.0,
    capital: 0.0,
    fail: false,
    finish: false,
    profitInPersen: 10,
    description: ''
  } as ProjectModel
}
