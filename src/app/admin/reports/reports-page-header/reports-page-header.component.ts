import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatButtonModule } from '@angular/material/button';
import { ExportExcelComponent } from '../../../shared/export-excel/export-excel.component';


@Component({
    selector: 'app-reports-page-header',
    templateUrl: './reports-page-header.component.html',
    styleUrls: ['./reports-page-header.component.scss'],
    imports: [ExportExcelComponent, MatButtonModule, RoleAttrDirective, MatIconModule, TranslateModule]
})
export class ReportsPageHeaderComponent {
  @Input() isResult: boolean;
  @Input() reportName: string;
  @Input() permissions: string[] = [];
  @Output() onAction: EventEmitter<string> = new EventEmitter();
  hideGenerateBtn = input(false);
  hideClearBtn = input(false);

  emitAction(actionName: string) {
    this.onAction.emit(actionName);
  }

}
