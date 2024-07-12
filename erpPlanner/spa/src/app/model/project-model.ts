export interface ProjectModel {
  id: number;
  Name: string;
  CreateDate: Date;
  DeadLineDate?: Date;
  LastUpdateDate: Date;
  FinishedDate?: Date;
  SellPrice?: number;
  Capital: number;
  Fail: boolean;
  Finish: boolean;
  ProfitInPersen: number;
  Description: string;
}
