import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-table-card-switcher',
    templateUrl: './table-card-switcher.component.html',
    styleUrls: ['./table-card-switcher.component.scss'],
    imports: [MatIconModule, CommonModule]
})
export class TableCardSwitcherComponent {
  @Output() getView: EventEmitter<string> = new EventEmitter();
  @Input() view: string = 'table';

  onClick(view: string) {
    this.view = view;
    this.getView.emit(view);
  }
}
