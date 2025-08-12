import { Component, inject, OnInit } from '@angular/core';
import { DayByDayProfitReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DaybydayProfitReportFiltersComponent } from './daybyday-profit-report-filters/daybyday-profit-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-daybyday-profit',
  templateUrl: './daybyday-profit.component.html',
  styleUrls: ['./daybyday-profit.component.scss'],
  imports: [ReportsPageHeaderComponent, DaybydayProfitReportFiltersComponent, DecimalPipe, DatePipe, TranslateModule]
})
export class DaybydayProfitComponent implements OnInit {
  isResult: boolean;
  filters: DayByDayProfitReport = new DayByDayProfitReport();
  packages: any[] = [];
  profit: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new DayByDayProfitReport();
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
    if (this.filters.onClosing) {
      this.reportsService.generateEndOfDayTnxsProfitReport(this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.profit = res.data;
          },
        });
    } else {
      this.reportsService.generateDayByDayProfitReport(this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.profit = res.data;
          },
        });
    }
  }
}
