import { AfterViewInit, Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[hideIfNull]',
  standalone: true
})
export class HiddenParentDirective implements AfterViewInit {

  private elementRef = inject(ElementRef);

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement;
    if (!element.innerHTML.trim()) {
      this.hideParentElement();
    }
  }

  private hideParentElement() {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement) {
      parentElement.style.display = 'none';
    }
  }

}
