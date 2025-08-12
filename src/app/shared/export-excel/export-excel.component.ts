
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { WorkBook, WorkSheet, utils, writeFileXLSX } from 'xlsx';

@Component({
    selector: 'app-export-excel',
    templateUrl: './export-excel.component.html',
    styleUrls: ['./export-excel.component.scss'],
    imports: [TranslateModule, MatProgressSpinnerModule, MatButtonModule]
})
export class ExportExcelComponent {
  loading: boolean;
  @Input() fileName: string;


  exportTable2Excel(): void {
    let elements = document.querySelectorAll('.printable-report table');
    this.loading = false;
    let ws: WorkSheet,
      wb: WorkBook = utils.book_new();  // work book

    elements.forEach((el) => {
      if (el.parentElement!.style.display !== 'none') {
        let sheetName = el.parentElement!.id
        ws = utils.table_to_sheet(el); // work sheet
        utils.book_append_sheet(wb, ws, sheetName); // excel page name
      }
    })
    writeFileXLSX(wb!, this.fileName + ' - ' + new Date().toLocaleDateString('en-US') + '.xlsx');
  }

}
