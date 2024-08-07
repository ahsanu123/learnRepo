import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, Editors, FieldType, Filters, Formatters, GridOption, Observable, RowDetailView, RowDetailViewOption, Subject } from 'angular-slickgrid';
import { DefaultLoadViewComponent } from '../default-load-view/default-load-view.component';

interface ProjectModel {
  rowId: number;
  title: string;
  duration?: string;
  percentComplete: number;
  percentComplete2: number;
  percentCompleteNumber: number;
  start: Date,
  finish: Date,
  effortDriven: boolean
}

@Component({
  selector: 'app-row-detail-slick',
  standalone: true,
  imports: [
    AngularSlickgridModule
  ],
  templateUrl: './row-detail-slick.component.html',
  styleUrl: './row-detail-slick.component.scss'
})
export class RowDetailSlickComponent implements OnInit, OnDestroy {

  grid!: AngularGridInstance
  data: ProjectModel[] = []

  column: Column<ProjectModel>[] = [
    { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70, filterable: true, editor: { model: Editors['text'] } },
    { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters['decimal'], params: { minDecimal: 1, maxDecimal: 2 }, sortable: true, type: FieldType.number, minWidth: 90, filterable: true },
    {
      id: 'percent2', name: '% Complete', field: 'percentComplete2', editor: { model: Editors['slider'] },
      formatter: Formatters['progressBar'], type: FieldType.number, sortable: true, minWidth: 100, filterable: true, filter: { model: Filters['slider'], operator: '>' }
    },
    { id: 'start', name: 'Start', field: 'start', formatter: Formatters['dateIso'], sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters['compoundDate '] } },
    { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters['dateIso'], sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters['compoundDate '] } },
    {
      id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
      minWidth: 100,
      formatter: Formatters['checkmarkMaterial'], type: FieldType.boolean,
      filterable: true, sortable: true,
      filter: {
        collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
        model: Filters['singleSelect']
      }
    }
  ]

  private rowDetailView: RowDetailView = {
    panelRows: 7,
    process: (item) => this.simulateServerAsyncCall(item),
    viewComponent: DefaultLoadViewComponent,
    loadOnce: true,
    singleRowExpand: false,
    useRowClick: true,
    parent: this,
    onBeforeRowDetailToggle: (_e, args) => {
      console.log('before toggling row detail', args.item);
      return true;
    },
  }

  option: GridOption = {
    enableFiltering: true,
    enableRowDetailView: true,
    datasetIdPropertyName: 'rowId',
    rowDetailView: this.rowDetailView,
    autoResize: {
      container: '#demo-container',
      rightPadding: 20
    },
    rowSelectionOptions: {
      selectActiveRow: true
    }
  }
  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  simulateServerAsyncCall(item: any) {
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    // fill the template on async delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemDetail = item;

        // let's add some extra properties to our item for a better async simulation
        itemDetail.assignee = randomNames[this.randomNumber(0, 10)];
        itemDetail.reporter = randomNames[this.randomNumber(0, 10)];

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  mockData(total: number) {
    for (let i = 0; i < total; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.data.push({
        rowId: i,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? '' : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      })

    }
  }

  angularGridReady(angularGrid: any) {

    console.log(angularGrid.detail as AngularGridInstance)
    this.grid = angularGrid.detail as AngularGridInstance;
  }

  ngOnDestroy(): void { }
  ngOnInit(): void {
    this.mockData(10)
  }

}
