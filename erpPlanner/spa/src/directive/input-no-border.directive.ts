import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: 'input[inputNoBorder]',
  standalone: true,
  host: {
    'class': 'custom-text-view outline-none bg-transparent '
  }
})
export class InputNoBorderDirective implements OnInit {

  // all field here
  private elementRef: ElementRef<HTMLInputElement | HTMLElement>;


  // all method here
  get value() {
    return this.elementRef.nativeElement.nodeValue;
  }

  constructor(
    elementRef: ElementRef<HTMLInputElement | HTMLElement>
  ) {
    this.elementRef = elementRef;
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    element.setAttribute('placeholder', this.placeholder);
  }

  // all input here
  @Input() placeholder: string = 'Enter Text';


  // all output here
  @Output() onValueChange = new EventEmitter<string>();

}
