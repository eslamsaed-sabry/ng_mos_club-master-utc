import { SalesPersonClosingRatioDetailsReportFilterComponent } from './sales-person-closing-ratio-details-report-filter/sales-person-closing-ratio-details-report-filter.component';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SalesPersonClosingRatioDetailsReport, SalesPersonClosingRatioDetailsReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-sales-person-closing-ratio-details-report',
    templateUrl: './sales-person-closing-ratio-details-report.component.html',
    styleUrl: './sales-person-closing-ratio-details-report.component.scss',
    imports: [ReportsPageHeaderComponent, SalesPersonClosingRatioDetailsReportFilterComponent, TranslateModule, DatePipe]
})
export class SalesPersonClosingRatioDetailsReportComponent {

  filters: SalesPersonClosingRatioDetailsReportFilter = new SalesPersonClosingRatioDetailsReportFilter();
  reports: SalesPersonClosingRatioDetailsReport;
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private toaster = inject(ToastrService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    if (!this.filters.salesPersonId) {
      this.toaster.error(this.translate.instant('members.msgToSelectSalesPerson'))
      return
    }
    else {
      this.reportsService.getSalesPersonClosingRatioDetails(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isResult = true;
          this.reports = res.data;
        }
      })
    }

  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new SalesPersonClosingRatioDetailsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
