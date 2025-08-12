import { Component, inject, OnInit } from '@angular/core';
import { CallsSummaryReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { CallSummaryReportFiltersComponent } from './call-summary-report-filters/call-summary-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-call-summary-report',
  templateUrl: './call-summary-report.component.html',
  styleUrls: ['./call-summary-report.component.scss'],
  imports: [ReportsPageHeaderComponent, CallSummaryReportFiltersComponent, TranslateModule]
})
export class CallSummaryReportComponent implements OnInit {
  isResult: boolean;
  filters: CallsSummaryReport = new CallsSummaryReport();
  packages: any[] = [];
  calls: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new CallsSummaryReport();
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.clear();
        break;
      default:
        window.print();
        break;
    }
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  generate() {
    this.isResult = false;
    this.reportsService.generateCallsSummaryReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.calls = res.data;
        },
      });
  }

}
