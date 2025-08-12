import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    imports: [CommonModule]
})
export class SpinnerComponent {
  @Input() width: string = '40px';
  @Input() height: string = '40px';
  @Input() class: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return this.class;
  }
}
