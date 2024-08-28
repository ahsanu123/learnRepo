import { Component, Input, OnInit } from "@angular/core";
import { DataViewModule } from "primeng/dataview";
import { ProjectModel } from "../../../model";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'project-list-component',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  @Input({ required: true })
  lists!: ProjectModel[]

  ngOnInit(): void {
  }
}
