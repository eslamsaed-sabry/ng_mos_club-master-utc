import { Component, inject, OnInit } from '@angular/core';
import { DeletedReceiptsReport, DeletedReceiptsReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { DeletedReceiptsFilterComponent } from './deleted-receipts-filter/deleted-receipts-filter.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-deleted-receipts-report',
  templateUrl: './deleted-receipts-report.component.html',
  styleUrls: ['./deleted-receipts-report.component.scss'],
  imports: [ReportsPageHeaderComponent, DeletedReceiptsFilterComponent, DatePipe, TranslateModule]
})
export class DeletedReceiptsReportComponent implements OnInit {

  filters: DeletedReceiptsReportFilter = new DeletedReceiptsReportFilter();
  reports: DeletedReceiptsReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getDeletedReceipts(this.filters).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new DeletedReceiptsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
