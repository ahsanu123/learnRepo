import 'slickgrid/dist/styles/css/slick-alpine-theme.css'
import { Column, GridOption, SlickDataView, SlickEventData, SlickGrid, SlickRowDetailView, SlickRowSelectionModel } from 'slickgrid'
import { ProjectModel } from './model'

const option: GridOption = {
  enableCellNavigation: true,
  enableColumnReorder: false,
  rowHeight: 20,
  autoHeight: true,
  multiColumnSort: true,
  editable: false,
  enableAddRow: false,
}

const column: Column<ProjectModel>[] = [
  { id: "id", name: "ID", field: "id" },
  { id: "title", name: "Title", field: "title", sortable: true },
  { id: "duration", name: "Duration", field: "duration" },
  { id: "%", name: "% Complete", field: "percentComplete", minWidth: 120 },
  { id: "start", name: "Start", field: "start", minWidth: 120, sortable: true },
  { id: "finish", name: "Finish", field: "finish", minWidth: 120 },
  { id: "effort-driven", name: "Effort Driven", field: "effortDriven", minWidth: 150 }
]

const loadingTempate = (_itemDetail: any) => {
  return '<div>loading</div>'
}

const loadView = (_itemDetail: any) => {
  return `
    <div>
      <h2>hello </h2>
    </div>
`
}
const simulateServerCall = (item: any) => {
  setTimeout(() => {
    rowDetailView.onAsyncResponse.notify({
      item: item,
      itemDetail: undefined
    })
  }, 1000)
  return Promise.resolve()
}

const rowDetailView = new SlickRowDetailView({
  expandedClass: 'hell-yeah',
  panelRows: 7,
  useRowClick: true,
  singleRowExpand: true,
  process: simulateServerCall,
  preTemplate: loadingTempate,
  postTemplate: loadView,
  expandableOverride: (_row, datacontext, _grid) => {
    return datacontext.id % 2 === 1
  }
})


const dataView = new SlickDataView<ProjectModel>()

for (let i = 0; i < 10; i++) {
  const item: ProjectModel = {
    id: `${i} `,
    title: "Task " + i,
    duration: "5 days",
    percentComplete: Math.round(Math.random() * 100),
    start: "01/01/2009",
    finish: "01/05/2009",
    effortDriven: (i % 5 == 0)
  }
  dataView.addItem(item)
}


const myGrid = document.querySelector("#myGrid") as HTMLElement

var grid = new SlickGrid<ProjectModel>(myGrid, dataView, column, option)

grid.setSelectionModel(new SlickRowSelectionModel({ selectActiveRow: false }))
grid.registerPlugin(rowDetailView)

rowDetailView.onAfterRowDetailToggle.subscribe((_event, _args) => {
  console.log("on After Toggle", _args)
})
rowDetailView.onAsyncEndUpdate.subscribe((_event, _args) => {
  console.log("end async updated ", _args)
})

grid.init()
dataView.beginUpdate()
dataView.endUpdate()



