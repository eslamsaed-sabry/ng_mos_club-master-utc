import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { EmployeeFinancialFiltersComponent } from './employee-financial-filters/employee-financial-filters.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeFinancialReport, EmployeeFinancialReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-employee-financial-report',
    templateUrl: './employee-financial-report.component.html',
    styleUrl: './employee-financial-report.component.scss',
    imports: [ReportsPageHeaderComponent, EmployeeFinancialFiltersComponent, DecimalPipe, DatePipe, TranslateModule]
})

export class EmployeeFinancialReportComponent implements OnInit {

  filters: EmployeeFinancialReportFilter = new EmployeeFinancialReportFilter();
  reports: EmployeeFinancialReport;
  isResult: boolean;

  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getEmployeeFinancialReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new EmployeeFinancialReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
