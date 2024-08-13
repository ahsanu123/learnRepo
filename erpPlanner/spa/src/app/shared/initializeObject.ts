import { ProjectModel } from "../model";

export function initializeProjectModel() {
  const initialProjectModel: ProjectModel = {
    id: 0,
    name: "",
    createdDate: new Date(),
    lastUpdatedDate: new Date(),
    capital: 0,
    fail: false,
    finish: false,
    profitInPersen: 0,
    description: ""
  }
  return initialProjectModel
}
