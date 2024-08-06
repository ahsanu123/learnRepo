import { Column, FieldType, Formatters, GridOption } from "@slickgrid-universal/common";
import { IComponent } from "../component-interface";
import { Slicker, SlickVanillaGridBundle } from "@slickgrid-universal/vanilla-bundle";
import '@slickgrid-universal/common/dist/styles/sass/slickgrid-theme-material.scss';

interface ProjectModel {
  id: number;
  title: string;
  duration: string;
  percentComplete: number;
  start: Date;
  finish: Date;
  effortDriven: boolean;
}

export class BasicSlickGrid implements IComponent {

  private data: ProjectModel[] = []
  private option: GridOption = {
    enableAutoResize: false,
    darkMode: false,
    gridHeight: 225,
    gridWidth: 800,
    rowHeight: 33,
  }
  private column: Column<ProjectModel>[] = [
    { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100, filterable: true },
    { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
    { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100, filterable: true, type: FieldType.number },
    { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
    { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, exportWithFormatter: true, filterable: true },
    { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100, filterable: true }
  ]

  private grid!: SlickVanillaGridBundle

  mockData(count: number) {
    const mockDataset: ProjectModel[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  constructor() {
  }

  Begin() {
    this.data.push(...this.mockData(10))
    this.grid = new SlickVanillaGridBundle<ProjectModel>(
      document.querySelector("#basicGrid")!,
      this.column,
      this.option,
      this.data
    )
    console.log(this.data)
    console.log(this.grid)
  }


}

