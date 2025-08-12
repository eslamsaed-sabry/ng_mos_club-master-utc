import { Component, inject, OnInit } from '@angular/core';
import { MaximumExpirationDateReport, MaximumExpirationDateReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MaximumExpirationDateReportFilterComponent } from './maximum-expiration-date-report-filter/maximum-expiration-date-report-filter.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-maximum-expiration-date-report',
  templateUrl: './maximum-expiration-date-report.component.html',
  styleUrl: './maximum-expiration-date-report.component.scss',
  imports: [ReportsPageHeaderComponent, MaximumExpirationDateReportFilterComponent, DatePipe, TranslateModule]
})
export class MaximumExpirationDateReportComponent implements OnInit {

  filters: MaximumExpirationDateReportFilter = new MaximumExpirationDateReportFilter();
  reports: MaximumExpirationDateReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getMaximumExpirationDateReport(this.filters).subscribe({
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
        this.filters = new MaximumExpirationDateReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

