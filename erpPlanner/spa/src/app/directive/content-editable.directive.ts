import {
  Directive,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  forwardRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[editable][formControlName],[editable][formControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableDirective),
      multi: true,
    },
  ],
})
export class EditableDirective implements ControlValueAccessor {
  value: string = '';
  disabled = false;
  onChange: any = (value: any) => { };
  onTouched: any = () => { };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private containerRef: ViewContainerRef
  ) {
    console.log(containerRef)
  }

  writeValue(value: any): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      EditableDirective.processValue(value),
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  private static processValue(value: unknown): string {
    const processed = String(value == null ? '' : value);

    return processed.trim() === '<br>' ? '' : processed;
  }
}
