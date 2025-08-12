import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfitSummaryReport, ProfitSummaryReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { ProfitSummaryReportFiltersComponent } from './profit-summary-report-filters/profit-summary-report-filters.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profit-summary-report',
  templateUrl: './profit-summary-report.component.html',
  styleUrl: './profit-summary-report.component.scss',
  imports: [ReportsPageHeaderComponent, ProfitSummaryReportFiltersComponent, TranslateModule, DecimalPipe, DatePipe]
})
export class ProfitSummaryReportComponent {
  filters: ProfitSummaryReportFilter = new ProfitSummaryReportFilter();
  reports: ProfitSummaryReport;
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.reportsService.getProfitSummaryReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new ProfitSummaryReportFilter();
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

}
