export interface MaterialModel {
  MaterialId: number;
  Name: string;
  Type?: string;
  Category?: string;
  Description?: string;
  Price: number;
  Suplier?: string;
  SuplierLink?: string;
  StorageId: number;
  Active: boolean;
}
