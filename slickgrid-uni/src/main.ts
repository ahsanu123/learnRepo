import { Column, GridOption, SlickGrid } from 'slickgrid'
import 'slickgrid/dist/styles/css/slick-alpine-theme.css'

interface ProjectModel {
  title: string;
  duration: string;
  percentComplete: number;
  start: string;
  finish: string;
  effortDriven: boolean;
}

const option: GridOption = {
  enableCellNavigation: true,
  enableColumnReorder: false
}

const column: Column<ProjectModel>[] = [
  { id: "title", name: "Title", field: "title" },
  { id: "duration", name: "Duration", field: "duration" },
  { id: "%", name: "% Complete", field: "percentComplete", width: 90 },
  { id: "start", name: "Start", field: "start" },
  { id: "finish", name: "Finish", field: "finish" },
  { id: "effort-driven", name: "Effort Driven", field: "effortDriven", width: 90 }
]

const data: ProjectModel[] = []
data.push({
  title: 'hell',
  duration: '2',
  percentComplete: 0,
  start: 'dsaf',
  finish: 'sdf',
  effortDriven: false
})

for (let i = 0; i < 500; i++) {
  data.push({
    title: "Task " + i,
    duration: "5 days",
    percentComplete: Math.round(Math.random() * 100),
    start: "01/01/2009",
    finish: "01/05/2009",
    effortDriven: (i % 5 == 0)
  })
}

const app = document.querySelector("#app") as HTMLElement

new SlickGrid<ProjectModel>(app, data, column, option)


