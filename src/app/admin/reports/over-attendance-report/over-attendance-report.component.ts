import { Component, inject, OnInit } from '@angular/core';
import { OverAttendanceReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { OverAttendanceReportFiltersComponent } from './over-attendance-report-filters/over-attendance-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-over-attendance-report',
    templateUrl: './over-attendance-report.component.html',
    styleUrls: ['./over-attendance-report.component.scss'],
    imports: [ReportsPageHeaderComponent, OverAttendanceReportFiltersComponent, DatePipe, TranslateModule]
})
export class OverAttendanceReportComponent implements OnInit {
  isResult: boolean;
  filters: OverAttendanceReport = new OverAttendanceReport();
  packages: any[] = [];
  attendance: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new OverAttendanceReport();
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
    if (this.filters.onRemaining) {
      this.reportsService.generateNotPaidAttendReport(this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.attendance = res.data;
            console.log(this.attendance);

          },
        });
    } else {
      this.reportsService.generateExpiredAttendReport(this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.attendance = res.data;
          },
        });
    }
  }
}
