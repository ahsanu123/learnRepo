import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, Editors, FieldType, Filters, Formatters, GridOption } from 'angular-slickgrid';
import { RowDetailViewComponent } from './tableDetailView.component';

@Component({
  selector: 'table-component',
  standalone: true,
  imports: [
    AngularSlickgridModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnDestroy, OnInit {

  angularGrid!: AngularGridInstance
  columnDefinition: Column[] = []
  gridOption!: GridOption
  dataset: any[] = []
  detailViewCount = 9
  message = ''
  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  simulateServerAsyncCall(item: any) {
    // random set of names to use for more item detail
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

  constructor() {
  }
  ngOnInit(): void {

    this.defineGrid()
  }
  ngOnDestroy(): void {
    console.log('Method not implemented.');
  }

  defineGrid() {
    this.columnDefinition = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        sortable: true,
        type: FieldType.string,
        width: 70,
        filterable: true,
        editor: {
          model: Editors.text
        }
      },
      {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration', formatter: Formatters.decimal,
        params: {
          minDecimal: 1, maxDecimal: 2
        },
        sortable: true,
        type: FieldType.number,
        minWidth: 90,
        filterable: true
      },
      {
        id: 'percent2',
        name: '% Complete',
        field: 'percentComplete2',
        editor: {
          model: Editors.slider
        },
        formatter: Formatters.progressBar,
        type: FieldType.number,
        sortable: true, minWidth: 100,
        filterable: true,
        filter: {
          model: Filters.slider,
          operator: '>'
        }
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        formatter: Formatters.dateIso,
        sortable: true,
        type: FieldType.date,
        minWidth: 90,
        exportWithFormatter: true,
        filterable: true,
        filter: {
          model: Filters.compoundDate
        }
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        formatter: Formatters.dateIso,
        sortable: true, type: FieldType.date,
        minWidth: 90, exportWithFormatter: true,
        filterable: true,
        filter: {
          model: Filters.compoundDate
        }
      },
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        minWidth: 100,
        formatter: Formatters.checkmarkMaterial,
        type: FieldType.boolean,
        filterable: true,
        sortable: true,
        filter: {
          collection: [
            {
              value: '',
              label: ''
            },
            {
              value: true,
              label: 'True'
            },
            {
              value: false,
              label: 'False'
            }
          ],
          model: Filters.singleSelect
        }
      }
    ];


    this.gridOption =
    {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableRowDetailView: true,
      datasetIdPropertyName: 'rowId',
      rowDetailView: {
        process: (item) => this.simulateServerAsyncCall(item),
        loadOnce: true,

        singleRowExpand: false,
        useRowClick: true,
        panelRows: this.detailViewCount,
        viewComponent: RowDetailViewComponent,
        parent: this,

        onBeforeRowDetailToggle: (_e, args) => {
          console.log('before toggling row detail', args.item);
          return true;
        },
      },
      rowSelectionOptions: {
        selectActiveRow: true
      },
    };
    this.getData()
  }

  getData() {
    const tmpData: any[] = [];
    for (let i = 0; i < 50; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      tmpData[i] = {
        rowId: i,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
    this.dataset = tmpData;
  }

}
