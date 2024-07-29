import { Component } from "@angular/core";
import { SlickDataView, SlickGrid } from "angular-slickgrid";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TableComponent } from "./table.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  template: `
    <h3>{{model.title}}</h3>
    <p>{{model.reporter}}</p>
`
})
export class RowDetailViewComponent {

  // this name seem need exact "model"
  model!: {
    duration: Date;
    percentComplete: number;
    reporter: string;
    start: Date;
    finish: Date;
    effortDriven: boolean;
    assignee: string;
    title: string;
  };

  addon: any;
  grid!: SlickGrid;
  dataView!: SlickDataView;

  // you can also optionally use the Parent Component reference
  // NOTE that you MUST provide it through the "parent" property in your "rowDetail" grid options
  parent!: TableComponent;

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }

  deleteRow(model: any) {
    if (confirm(`Are you sure that you want to delete ${model.title}?`)) {
      // you first need to collapse all rows (via the 3rd party addon instance)
      this.addon.collapseAll();

      // then you can delete the item from the dataView
      this.dataView.deleteItem(model.rowId);

      // this.parent.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model: any) {
    // this.parent.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }
}
