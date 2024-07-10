import { SlickGrid, GridOption, Column } from 'slickgrid';
import '../node_modules/slickgrid/dist/styles/css/slick-alpine-theme.css';

interface IData {
  title: string;
  duration: string;
  percentComplete: number;
  start: string;
  finish: string;
  effortDriven: boolean;
}

export default class SlickLearn {

  data: Array<IData> = []
  options: GridOption = {
    enableCellNavigation: true,
    enableColumnReorder: false
  }

  columns: Array<Column<IData>> = [
    { id: 'title', name: 'Title', field: 'title', sortable: true },
    { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true },
    { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
    { id: 'start', name: 'Start', field: 'start' },
    { id: 'finish', name: 'Finish', field: 'finish' },
  ]

  constructor() {
    for (var i = 0; i < 500; i++) {
      this.data.push({
        title: "Task " + i,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      })
    }
  }

  onRender() {
    new SlickGrid("#myGrid", this.data, this.columns, this.options);
  }
}
