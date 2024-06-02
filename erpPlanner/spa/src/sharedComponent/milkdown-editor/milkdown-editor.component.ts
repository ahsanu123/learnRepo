import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Editor, defaultValueCtx, rootCtx } from '@milkdown/core';
import { history } from '@milkdown/plugin-history';
import { math } from '@milkdown/plugin-math';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { bootstrapMarkdownFill } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { clipboard } from '@milkdown/plugin-clipboard';
import 'katex/dist/katex.min.css';
import { InputNoBorderDirective } from '../../directive/input-no-border.directive';

@Component({
  selector: 'app-milkdown-editor',
  standalone: true,
  imports: [
    NgIconComponent,
    InputNoBorderDirective
  ],
  templateUrl: './milkdown-editor.component.html',
  styleUrl: './milkdown-editor.component.scss',
  providers: [
    provideIcons({
      bootstrapMarkdownFill
    })
  ]

})
export class MilkdownEditorComponent implements OnDestroy {
  @ViewChild('editorRef') editorRef!: ElementRef;

  defaultValue = '_markdown supported_';
  editor: Editor = new Editor();

  ngAfterViewInit() {
    this.editor
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef.nativeElement);
        ctx.set(defaultValueCtx, this.defaultValue);
      })
      .config(nord)
      .use(commonmark)
      .use(history)
      .use(math)
      .use(clipboard)
      .create();

  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
