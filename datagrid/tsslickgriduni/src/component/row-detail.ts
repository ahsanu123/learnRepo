import { Column, createDomElement, Editors, EventSubscription, ExtensionName, FieldType, Filters, Formatters, GridOption, Observable, RowDetailView, SlickEventHandler, Subject, titleCase } from "@slickgrid-universal/common";
import { IComponent } from "./component-interface";
import { EventPubSubService, Slicker, SlickVanillaGridBundle } from "@slickgrid-universal/vanilla-bundle";
import { SlickRowDetailView } from "@slickgrid-universal/row-detail-view-plugin";
import { PubSubService } from '@slickgrid-universal/common'

interface Item {
  id: number;
  title: string;
  duration: number;
  percentComplete: number;
  start: Date;
  finish: Date;
  effortDriven: boolean;
}
interface ItemDetail extends Item {
  assignee: string;
  reporter: string;
}

export class SlickGridRowDetail implements IComponent {

  private rowDetailViewOption: RowDetailView = {
    columnIndexPosition: 1,
    cssClass: 'detail-view-toggle',
    preTemplate: this.loadingTemplate.bind(this),
    postTemplate: this.loadView.bind(this),
    process: this.simulateServerAsyncCall.bind(this),
    useRowClick: false,
    panelRows: 8,
    expandableOverride: (_row, dataContext) => dataContext.id % 2 === 1,
  }

  private _eventHandler: SlickEventHandler;
  private data: Item[] = []
  private grid!: SlickVanillaGridBundle
  private rowDetail!: SlickRowDetailView

  private option: GridOption = {
    enableFiltering: true,
    enableRowDetailView: true,
    rowHeight: 33,
    rowDetailView: this.rowDetailViewOption,
    enableCheckboxSelector: true,
    enableRowSelection: true,
    checkboxSelector: {
      hideInFilterHeaderRow: false,
      hideSelectAllCheckbox: true,
    },
    autoResize: {
      container: '.demo-container',
    },
    preRegisterExternalExtensions: (pubSubService) => {
      this.rowDetail = new SlickRowDetailView(pubSubService);
      return [{ name: ExtensionName.rowDetailView, instance: this.rowDetail }];
    },
  }
  private column: Column<Item>[] = [
    { id: 'title', name: 'Title', field: 'title', width: 110, minWidth: 110, cssClass: 'cell-title', filterable: true, sortable: true, editor: { model: Editors.text } },
    { id: 'duration', name: 'Duration', field: 'duration', width: 90, maxWidth: 200, filterable: true, sortable: true, type: FieldType.number },
    { id: '%', name: '% Complete', field: 'percentComplete', minWidth: 100, width: 250, resizable: false, filterable: true, sortable: true, editor: { model: Editors.slider }, type: FieldType.number, formatter: Formatters.percentCompleteBar },
    { id: 'start', name: 'Start', field: 'start', minWidth: 60, maxWidth: 130, filterable: true, filter: { model: Filters.compoundDate }, type: FieldType.dateIso, formatter: Formatters.dateIso },
    { id: 'finish', name: 'Finish', field: 'finish', minWidth: 60, maxWidth: 130, filterable: true, filter: { model: Filters.compoundDate }, type: FieldType.dateIso, formatter: Formatters.dateIso },
    { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', width: 90, minWidth: 20, maxWidth: 120, filterable: true, formatter: Formatters.checkmarkMaterial }

  ]

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  loadingTemplate() {
    const headerElm = createDomElement('h5', { className: 'title is-5' });
    headerElm.appendChild(createDomElement('i', { className: 'mdi mdi-load mdi-spin-1s mdi-40px' }));
    headerElm.appendChild(document.createTextNode('Loading...'));

    return headerElm;
  }

  simulateServerAsyncCall(item: ItemDetail) {
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    return new Promise((resolve) => {
      setTimeout(() => {
        const itemDetail = item;

        itemDetail.assignee = randomNames[10]
        itemDetail.reporter = randomNames[2]
        this.notifyTemplate(itemDetail);
        resolve(itemDetail);
      }, 1000);
    });
  }

  notifyTemplate(itemDetail: ItemDetail) {
    this.rowDetail.onAsyncResponse.notify({
      item: itemDetail,
      itemDetail,
    }, undefined, this);
  }

  loadView(itemDetail: ItemDetail) {
    return `
      <div>
        <h4 class="title is-4">${itemDetail.title}</h4>
        <div class="container">
          <div class="columns">
            <div class="column is-half">
            <div class="detail"><label>Assignee:</label> <input class="input is-small is-8 column mt-1" id="assignee_${itemDetail.id}" type="text" value="${itemDetail.assignee}"/></div>
              <div class="detail"><label>Reporter:</label> <span>${itemDetail.reporter}</span></div>
              <div class="detail"><label>Duration:</label> <span>${itemDetail.duration}</span></div>
              <div class="detail"><label>% Complete:</label> <span>${itemDetail.percentComplete}</span></div>
              <div class="detail"><label>Start:</label> <span>${itemDetail.start.toDateString()}</span></div>
              <div class="detail"><label>Finish:</label> <span>${itemDetail.finish.toDateString()}</span></div>
              <div class="detail"><label>Effort Driven:</label> <span>${itemDetail.effortDriven}</span></div>
            </div>
            <div class="column is-half">
              <div class="detail">
                <span class="is-flex is-align-items-center">
                  <label>Find out who is the Assignee</label>
                  <button class="button is-small" id="who-is-assignee_${itemDetail.id}" data-test="assignee-btn">Click Me</button>
                </span>
                <button class="button is-small is-danger ml-5" id="delete_row_${itemDetail.id}" data-test="delete-btn">
                  Delete Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mockData(count: number) {
    const mockDataset: Item[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100),
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  constructor() {
    this._eventHandler = new SlickEventHandler();
  }

  Begin() {
    this.data.push(...this.mockData(10))
    const rowDetailEl = document.querySelector("#rowDetail") as HTMLDivElement
    this.grid = new SlickVanillaGridBundle(
      rowDetailEl!,
      this.column,
      this.option,
      this.data
    )

    this.rowDetail.onBeforeRowDetailToggle.subscribe((_e, args) => {
      console.log('before toggling row detail', args.item);
    });

  }

}
