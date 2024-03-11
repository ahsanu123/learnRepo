import { Component, ElementRef, ViewChild } from '@angular/core';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { history } from '@milkdown/plugin-history';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';

import 'katex/dist/katex.min.css';

@Component({
  selector: 'app-milkdown-editor',
  standalone: true,
  imports: [],
  templateUrl: './milkdown-editor.component.html',
  styleUrl: './milkdown-editor.component.scss'
})
export class MilkdownEditorComponent {
  @ViewChild('editorRef') editorRef!: ElementRef;

  defaultValue = '# Milkdown x Angular ';

  ngAfterViewInit() {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef.nativeElement);
        ctx.set(defaultValueCtx, this.defaultValue);
      })
      .config(nord)
      .use(commonmark)
      .use(history)
      .create();
  }
}
