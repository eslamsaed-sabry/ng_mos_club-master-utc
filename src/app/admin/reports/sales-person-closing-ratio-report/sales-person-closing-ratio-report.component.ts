import { SalesPersonClosingRatioReportFilterComponent } from './sales-person-closing-ratio-report-filter/sales-person-closing-ratio-report-filter.component';

import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { SalesPersonClosingRatioReportFilter, SalesPersonClosingRatioReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-sales-person-closing-ratio-report',
    templateUrl: './sales-person-closing-ratio-report.component.html',
    styleUrl: './sales-person-closing-ratio-report.component.scss',
    imports: [ReportsPageHeaderComponent, SalesPersonClosingRatioReportFilterComponent, TranslateModule]
})
export class SalesPersonClosingRatioReportComponent {

  filters: SalesPersonClosingRatioReportFilter = new SalesPersonClosingRatioReportFilter();
  reports: SalesPersonClosingRatioReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.reportsService.getSalesPersonClosingRatio(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new SalesPersonClosingRatioReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
