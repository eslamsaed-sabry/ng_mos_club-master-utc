import { Component, DestroyRef, inject } from '@angular/core';
import { IExpenses } from 'src/app/models/accounts.model';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ExpensesReportFilterComponent } from './expenses-report-filter/expenses-report-filter.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExpensesReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-expenses-report',
  templateUrl: './expenses-report.component.html',
  styleUrl: './expenses-report.component.scss',
  imports: [ReportsPageHeaderComponent, ExpensesReportFilterComponent, TranslateModule, DatePipe, DecimalPipe]
})
export class ExpensesReportComponent {
  filters: ExpensesReportFilter = new ExpensesReportFilter();
  reports: IExpenses[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getExpensesReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new ExpensesReportFilter();
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

