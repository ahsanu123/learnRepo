import { Component, Input, OnInit } from "@angular/core";
import { DataViewModule } from "primeng/dataview";
import { ProjectModel } from "../../../model";
import { CommonModule, DatePipe } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { TagModule } from 'primeng/tag';
import { ChipsModule } from 'primeng/chips';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'project-list-component',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule,
    CardModule,
    ButtonModule,
    DatePipe,
    TagModule,
    TableModule,
    ChipsModule,
    FloatLabelModule,
    ToggleButtonModule,
    CheckboxModule,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
  @Input({ required: true })
  lists!: ProjectModel[]

  getDate(text: string) {
    return new Date(text).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  ngOnInit(): void {
  }
}
