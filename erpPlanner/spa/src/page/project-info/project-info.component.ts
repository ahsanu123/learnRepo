import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSlickgridModule, Column, GridOption } from 'angular-slickgrid';
import {
  MarkdownComponent,
  MarkdownService,
  provideMarkdown
} from 'ngx-markdown';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownComponent,
    AngularSlickgridModule
  ],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.scss',
  providers: [
    provideMarkdown()
  ]
})
export class ProjectInfoComponent implements OnInit {
  descriptionContent = `## Markdown __rulez__! :snake: \n- hello :turtle:`;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  showCode: boolean = false;

  costructor(
    markdownService: MarkdownService
  ) { }

  ngOnInit(): void {
    this.prepareGrid()
  }

  prepareGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start' },
      { id: 'finish', name: 'Finish', field: 'finish' },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
      autoResize: {
        container: "#statistic-info",
        maxHeight: 500,
      }
    };

    // fill the dataset with your data (or read it from the DB)
    for (let i = 0; i < 100; i++) {
      this.dataset.push(
        { id: i, title: `Task ${i}`, duration: 33 + i, percentComplete: 34, start: '2001-01-11', finish: '2001-02-04' },
      )
    }
  }
}
